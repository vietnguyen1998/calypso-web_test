import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getBettingPool, getErc20, getSigner } from "../../utils/Contracts";
import { byte32ToString, getWei } from "../../utils/Web3Utils";
import { RadioGroup, Radio } from "react-radio-group";
import { BetSides, SupportedCoins, ZeroAddress } from "../../const/Const";
import { toast } from "react-toastify";
import useInput from "../hook/useInput";
import { roundNumber } from "../../utils/Utils";

const BettingPanel = (props) => {
  const { pool, poolAddress, onReload, setLoading, game } = props;
  const [selectedSide, setSelectedSide] = useState(BetSides.team1);
  const [amount, bindAmount, resetAmount] = useInput("0");
  const [approved, setApproved] = useState(false);
  const signer = getSigner();
  const Pool = getBettingPool(poolAddress, pool.version).connect(signer);
  const bets = pool.bets || [];
  const betAmounts = Object.values(BetSides).map((el) => {
    const amount = bets.reduce(
      (acc, cur) => (cur.side === el ? acc + cur.amount : acc),
      0
    );
    return amount;
  });
  let odds;
  if (betAmounts.some((el) => el === 0)) {
    odds = betAmounts.join(" : ");
  } else {
    const minAmount = Math.min(...betAmounts);
    const transformAmount = betAmounts.map((el) =>
      roundNumber(el / minAmount, 2)
    );
    odds = transformAmount.join(" : ");
  }

  const betWithEth = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    setLoading(true);
    Pool &&
      Pool.betWithEth(selectedSide, { value: getWei(amount) })
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            resetAmount();
            toast.success("Bet successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const approveToken = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    setLoading(true);
    const Erc20 = getErc20(pool.currency).connect(signer);
    Erc20 &&
      Erc20.approve(poolAddress, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.success("Approved successfully! Can bet now.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const betWithTokens = () => {
    if (amount <= 0) {
      return toast.error("Amount is too small.");
    }
    setLoading(true);
    Pool &&
      Pool.betWithToken(selectedSide, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            setApproved(false);
            resetAmount();
            toast.success("Bet successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const items = Object.values(BetSides).map((item, index) => {
    return (
      <React.Fragment key={index}>
        {" "}
        <Radio value={item} />{" "}
        <span style={{ marginRight: 20 }}>
          {item === BetSides.team1
            ? game.team1
            : item === BetSides.team2
            ? game.team2
            : "Draw"}
        </span>
      </React.Fragment>
    );
  });
  const currency = SupportedCoins.find((item) => item.value == pool.currency);
  return (
    <>
      <h3 className="bold">Betting</h3>
      <div class="form-check form-check-inline mt-2 mr-5">
        {items && (
          <RadioGroup
            selectedValue={selectedSide}
            onChange={setSelectedSide}
            children={items}
          />
        )}
      </div>
      <div style={{ marginTop: 15 }}>
        Odds: <span style={{ fontWeight: "bold", marginLeft: 20 }}>{odds}</span>
      </div>
      <form className="grey mt-3">
        <span> Input {currency && currency.label} number</span>
        <br />
        <input className="text-input" type="number" {...bindAmount} />
      </form>
      {pool.currency == ZeroAddress ? (
        <button className="yellow-btn mr-3" onClick={betWithEth}>
          Play
        </button>
      ) : (
        <button
          className="yellow-btn mr-3"
          onClick={!approved ? approveToken : betWithTokens}
        >
          {!approved ? "Approve Token" : "Place Bet"}
        </button>
      )}
    </>
  );
};

export default connect(null)(BettingPanel);