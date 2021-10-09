import React, { useEffect, useState } from "react";
import Main from "../Common/Main";
import { getLotteries, getTickets } from "../../redux/actions";
import { connect, useSelector } from "react-redux";
import "./Lottery.css";
import LotteryType from "./LotteryType";
import { secondsToHms, timestampToLocalDate } from "../../utils/Utils";
import CurrentLottery from "./CurrentLottery";
import { getLotteryWinners } from "./LotteryUtils";

const Lottery = (props) => {
  const { getLotteries, getTickets } = props;
  const address = useSelector((state) => state.address);
  const lotteries = useSelector((state) => state.lotteries) || [];

  const previousTickets =
    useSelector((state) => state.tickets.previousLottery) || [];
  const currentTickets =
    useSelector((state) => state.tickets.currentLottery) || [];

  const [counter, setCounter] = useState(0);
  const [show, setShow] = useState(false);
  const [ticketsAmount, setTicketsAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [calAmount, setCalAmount] = useState("1");

  const sortedLotteries =
    (lotteries &&
      lotteries.sort((lot1, lot2) => lot2.createdDate - lot1.createdDate)) ||
    [];
  const currentLottery = sortedLotteries[0];
  const prevLottery = sortedLotteries[1];
  /* const lotteryAddress = (lottery && lottery._id) || "";
   */
  const prevLotteryAddress = (prevLottery && prevLottery._id) || "";

  /* const endDate = (lottery && lottery.endDate) || 0;*/
  const prevWinNumber = prevLottery && prevLottery.winNumber;
  /*const hasDrawn = lottery && lottery.hasDrawn;*/

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getTickets(currentLottery._id, address, LotteryType.currentLottery);
    setShow(true);
  };

  useEffect(() => {
    getLotteries();
  }, []);

  useEffect(() => {
    if (address != "" && prevLotteryAddress != "")
      getTickets(prevLotteryAddress, address, LotteryType.previousLottery);
  }, [address, prevLotteryAddress]);

  /*useEffect(() => {
    let val = endDate - Math.floor(Date.now() / 1000);
    setCounter(val > 0 ? val : 0);
  }, [endDate]);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);*/

  /*const canClaim =
    lottery &&
    lottery.usersClaimedPrize &&
    !lottery.usersClaimedPrize.some(
      (el) => el.toLowerCase() == address.toLowerCase()
    );*/

  /*const getUserPrize = () => {
    const firstPrizeTotal = (lottery.totalPrize * 40) / 100;
    const secondPrizeTotal = (lottery.totalPrize * 25) / 100;
    const thirdPrizeTotal = (lottery.totalPrize * 15) / 100;
    const match4Total = (lottery.totalPrize * 10) / 100;
    const match3Total = (lottery.totalPrize * 5) / 100;
    const match2Total = (lottery.totalPrize * 3) / 100;
    const match1Total = (lottery.totalPrize * 2) / 100;

    const totals = [
      firstPrizeTotal,
      secondPrizeTotal,
      thirdPrizeTotal,
      match4Total,
      match3Total,
      match2Total,
      match1Total,
    ];

    const allPrizes = [
      lottery.firstPrize,
      lottery.secondPrize,
      lottery.thirdPrize,
      lottery.match4,
      lottery.match3,
      lottery.match2,
      lottery.match1,
    ];

    let winAmount = 0;

    allPrizes.forEach((el, i) => {
      let winTicketsAmount = 0;
      if (el.length > 0) {
        el.forEach((adr) => {
          if (adr.toLowerCase() == address.toLowerCase()) {
            winTicketsAmount += 1;
          }
        });

        winAmount += (winTicketsAmount * totals[i]) / el.length;
      }
    });

    return winAmount;
  };*/

  const getTicketsArray = () => {
    let array = [];
    for (let i = 0; i < ticketsAmount; i++) {
      array.push(i + 1);
    }
    return array;
  };

  const winNumberLogo =
    prevWinNumber != undefined
      ? prevWinNumber
          .toString()
          .split("")
          .map((el, i) => {
            return <div className="ticket-number mx-2">{el}</div>;
          })
      : 0;

  return (
    <Main>
      <div style={{ backgroundColor: "#021025" }}>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div
          className="container py-4"
          style={{ backgroundColor: "#0f1f38", width: "60%" }}
        >
          <div className=" d-flex justify-content-center">
            <h1 className="yellow">Calypso Lucky Seven Lottery</h1>
          </div>
          <div className=" d-flex justify-content-center">
            <h1 className="red bold">2,000,000 CAL </h1>
          </div>
          <div className=" d-flex justify-content-center">
            <p className="white">In Prizes</p>
          </div>
          {currentLottery && (
            <>
              <div className=" d-flex justify-content-center">
                <button className="yellow-btn" onClick={handleShow}>
                  Buy Tickets
                </button>
              </div>
              <CurrentLottery
                show={show}
                handleClose={handleClose}
                currentLottery={currentLottery}
                sortedLotteries={sortedLotteries}
                address={address}
              />
            </>
          )}

          <div className="mt-3 d-flex justify-content-center">
            <h3 className="white"> GET YOUR TICKETS NOW!</h3>
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <p className="white">
              {" "}
              <span className="yellow">{/*secondsToHms(counter)*/}</span> until
              the draw
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <div
              className="p-3 "
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.16)",
                borderRadius: "15px",
                width: "60%",
              }}
            >
              <div class="d-flex">
                <div class="mr-auto white">LAST DRAW</div>
                <div class="bright-grey">
                  #{lotteries.length} | Draw: Sep 5, 2021, 1:00 AM
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                {prevLotteryAddress}
              </div>
              <hr style={{ border: "1px dashed  grey" }} />
              <div className="row d-flex justify-content-center">
                {winNumberLogo}
              </div>
              <div class="collapse my-3" id="collapseDetails">
                {prevLottery && getLotteryWinners(prevLottery)}
              </div>

              <hr style={{ border: "1px dashed  grey" }} />
              <div className="d-flex justify-content-center">
                <p
                  class="white"
                  data-toggle="collapse"
                  data-target="#collapseDetails"
                  aria-expanded="false"
                  aria-controls="collapseDetails"
                  style={{ cursor: "pointer" }}
                >
                  Details ^
                </p>
              </div>
            </div>
          </div>
          <div className=" d-flex justify-content-center">
            <h3 className="white mt-5">HOW TO PLAY</h3>
          </div>
          <div className=" d-flex justify-content-center">
            <p className="white">
              If the digits on your tickets match the winning numbers in the
              correct order, you win a portion of the prize pool. Simple!
            </p>
          </div>
          <div className="row d-flex justify-content-around mt-2">
            <div className="col-3 step">
              <div className="step-circle  d-flex justify-content-center my-3">
                <h4 className="white" align="center">
                  1
                </h4>
              </div>
              <h4 className="white" align="center">
                Buy tickets
              </h4>
              <p className="white" align="center">
                Each ticket costs only 1 CAL, buy more tickets to inscease your
                chances of winning!
              </p>
            </div>
            <div className="col-3 step">
              <div className="step-circle  d-flex justify-content-center my-3">
                {" "}
                <h4 className="white" align="center">
                  2
                </h4>
              </div>
              <h4 className="white" align="center">
                {" "}
                Wait for the Draw
              </h4>
              <p className="white" align="center">
                The draw takes place daily at 00:00 UTC +8
              </p>
            </div>
            <div className="col-3 step">
              <div className="step-circle  d-flex justify-content-center my-3">
                <h4 className="white" align="center">
                  3
                </h4>
              </div>
              <h4 className="white" align="center">
                Check for Prizes
              </h4>
              <p className="white" align="center">
                Once the draw is over, click on <u>Claim Winnings</u> to check
                if you’ve won!
              </p>
            </div>
          </div>
          <div className="mt-3">
            <h4
              class="white"
              data-toggle="collapse"
              data-target="#collapseHowToPlay"
              aria-expanded="false"
              aria-controls="collapseHowToPlay"
              style={{ cursor: "pointer" }}
            >
              How to win ^
            </h4>
            <hr style={{ border: "1px solid grey" }} />
            <div class="collapse" id="collapseHowToPlay">
              <div class="col-8">
                <p className="white">
                  The digits on your ticket must match in the correct order to
                  win.
                </p>
                <p className="bright-grey" align="justify">
                  There are a total of seven winning lottery numbers , from 0 to
                  9, on each ticket. To win, your numbers need to match the
                  drawn numbers in the same order as the 7 winning numbers,
                  starting from the left of the ticket.
                </p>
                <p className="bright-grey" align="justify">
                  Ticket A : The first 4 digits match but the last 3 digits do
                  not match so this ticket is entitled to the Match 4 Prize
                  Category
                </p>
                <p className="bright-grey" align="justify">
                  Ticket B : The first digit does not match but the last 6
                  digits match so this ticket is entitled to the Match 2 Prize
                  Category since the last 2 digits match the winning ticket
                  number
                </p>
                <p className="bright-grey" align="justify">
                  Prize Brackets do not stack
                </p>
                <p className="bright-grey" align="justify">
                  If you win 2nd Prize , you are not entitled to prizes in the
                  lower prize category . The highest prize category will be the
                  only category that qualify for payout
                </p>
              </div>
            </div>
          </div>
          <h4 className="white">Staking</h4>
          <hr style={{ border: "1px solid grey" }} />
          <div className="row">
            <div className="col-8">
              <p className="bright-grey" align="justify">
                Stake CAL in Lucky 7's Lottery pool to earn lottery profits!
                Stakes and profits are automatically migrated to the latest
                lottery pool daily. Staking is flexible, you may withdraw your
                whole or partial stake at any time.
              </p>
            </div>
            <div className="col-4  d-flex justify-content-center">
              <p className="yellow" align="justify">
                Average daily Return
              </p>
            </div>
          </div>
          <div>
            <h4
              class="white"
              data-toggle="collapse"
              data-target="#collapsePrizeStructure"
              aria-expanded="false"
              aria-controls="collapsePrizeStructure"
              style={{ cursor: "pointer" }}
            >
              Prize Structure ^
            </h4>
            <hr style={{ border: "1px solid grey" }} />
            <div class="collapse" id="collapsePrizeStructure">
              <p className="bright-grey" align="justify">
                The prize pool is a fixed at 2million CAL for each draw. It is
                divided according to the following:
              </p>
              <p className="bright-grey" align="justify">
                1st prize - 40% (800K CAL) is divided equally among all tickets
                that match all 7 digits in the exact order
              </p>
              <p className="bright-grey" align="justify">
                2nd prize - 25% (500K CAL) is divided equally among all tickets
                that match the first 6 digits of the winning number, in the
                exact order
              </p>
              <p className="bright-grey" align="justify">
                3rd Prize - 15% (300K CAL) is divided equally among all tickets
                that match the first 5 digits of the winning number, in the
                exact order
              </p>
              <p className="bright-grey" align="justify">
                Match4 - 10% (200K CAL) is divided equally among all tickets
                that match the first 4 digits of the winning number, in the
                exact order
              </p>
              <p className="bright-grey" align="justify">
                Match3 - 5% (100K CAL) is divided equally among all tickets that
                match the first 3 digits of the winning number, in the exact
                order{" "}
              </p>
              <p className="bright-grey" align="justify">
                Match2 - 3% (60K CAL) is divded equally among all tickets that
                match the first 2 digits, or the last 2 digits of the winning
                number, in the exact order. If your ticket matches both first
                and last 2 digits in the right order, you win 2 shares.
              </p>
              <p className="bright-grey" align="justify">
                Match1 - 2% (40K CAL) is divided equally among all tickets that
                match the first or last digit of of the winning number. If your
                ticket matches both the first and last digit, you win 2 shares
              </p>
              <p className="bright-grey" align="justify">
                <i>
                  {" "}
                  * Matching order of lottery numbers has to follow Left to
                  Right order except for Match 2 and Match 1 Prize category
                </i>{" "}
              </p>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </Main>
  );
};

export default connect(null, { getLotteries, getTickets })(Lottery);
