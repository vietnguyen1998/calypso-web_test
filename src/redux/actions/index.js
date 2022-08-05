import { SupportedCoins } from "../../const/Const";
import ActionType from "../type";
import network from "./network";
import UrlConst from "./UrlConst";
import * as Contracts from "../../utils/Contracts";
import LotteryType from "../../components/Lottery/LotteryType";

export const updateCalBalance = (address) => (dispatch) => {
  const Cal = Contracts.getCal();
  Cal &&
    address &&
    Cal.balanceOf(address)
      .then((bal) =>
        dispatch({
          type: ActionType.calBalance,
          payload: bal / 1e18,
        })
      )
      .catch((err) =>
        dispatch({
          type: ActionType.calBalance,
          payload: 0,
        })
      );
};

export const updateUsdtBalance = (address) => (dispatch) => {
  const Usdt = Contracts.getUsdt();
  Usdt &&
    address &&
    Usdt.balanceOf(address)
      .then((bal) =>
        dispatch({
          type: ActionType.usdtBalance,
          payload: bal / 1e18,
        })
      )
      .catch((err) =>
        dispatch({
          type: ActionType.usdtBalance,
          payload: 0,
        })
      );
};

export const updateEthBalance = (address) => (dispatch) => {
  const web3 = Contracts.getWeb3();
  web3 &&
    address &&
    web3
      .getBalance(address)
      .then((bal) =>
        dispatch({
          type: ActionType.ethBalance,
          payload: bal / 1e18,
        })
      )
      .catch((err) =>
        dispatch({
          type: ActionType.ethBalance,
          payload: 0,
        })
      );
};

export const updateChainId = (chainId) => (dispatch) => {
  dispatch({
    type: ActionType.chainId,
    payload: chainId,
  });
};

export const updateAddress = (address) => (dispatch) => {
  dispatch({
    type: ActionType.currentAddress,
    payload: address,
  });
};

export const getPools = () => async (dispatch) => {
  network.get(UrlConst.getPoolsUrl).then((res) => {
    const { pools } = res.data;
    dispatch({
      type: ActionType.getPools,
      payload: pools,
    });
  });
};

export const getLotteries = () => async (dispatch) => {
  network.get(UrlConst.getLotteries).then((res) => {
    const { lotteries } = res.data;
    dispatch({
      type: ActionType.getLotteries,
      payload: lotteries,
    });
  });
};

export const getPool = (poolAddress, userAddress) => async (dispatch) => {
  dispatch({
    type: ActionType.resetPool,
  });

  network
    .get(UrlConst.getPoolUrl, { poolAddress, userAddress })
    .then((res) => {
      dispatch({
        type: ActionType.getPool,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getLottery = (lotteryAddress) => async (dispatch) => {
  network
    .get(UrlConst.getLottery, { lotteryAddress })
    .then((res) => {
      dispatch({
        type: ActionType.getLottery,
        payload: res.data.lottery,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getOwnPools = (PoolManager) => async (dispatch) => {
  const pools = await PoolManager.methods.getOwnPools().call();
  dispatch({
    type: ActionType.getOwnPool,
    payload: pools,
  });
};

export const getBets = (poolAddress, userAddress) => async (dispatch) => {
  network
    .get(UrlConst.getBetsUrl, {
      poolAddress,
      userAddress,
    })
    .then((res) => {
      const { bets } = res.data;
      dispatch({
        type: ActionType.getBets,
        payload: bets,
      });
    });
};

export const getTickets =
  (lotteryAddress, userAddress, lotteryType) => async (dispatch) => {
    return new Promise((resolve, reject) => {
      network
        .get(UrlConst.getTicketsUrl, {
          lotteryAddress,
          userAddress,
          lotteryType,
        })
        .then((res) => {
          dispatch({
            type: ActionType.getTickets,
            payload: res.data,
          });
        })
        .catch((err) => {
          reject(String(err));
        });
    });
  };

export const getMatches = () => (dispatch) => {
  network.get(UrlConst.getMatchesUrl).then((res) => {
    dispatch({
      type: ActionType.getMatches,
      payload: res.data,
    });
  });
};

export const createPool = (pool) => (dispatch) => {
  return new Promise((resolve, reject) => {
    network
      .post(UrlConst.createPoolUrl, pool)
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(String(err));
      });
  });
};

export const createBetTxId = (bet) => {
  return new Promise((resolve, reject) => {
    network
      .post(UrlConst.createBetTxId, bet)
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(String(err));
      });
  });
};

export const affiliateAddrCheck = (addresses) => {
  return new Promise((resolve, reject) => {
    network
      .post(UrlConst.affiliateAddrCheck, addresses)
      .then((res) => {
        resolve(res.data.validAddrs);
      })
      .catch((err) => {
        reject(String(err));
      });
  });
};

export const getAffiliateStatus = (address) => (dispatch) => {
  const affiliateSc = Contracts.getAffiliate();
  affiliateSc
    .getAffiliateStatus(
      SupportedCoins.map((el) => el.value),
      { from: address }
    )
    .then((res) => {
      dispatch({
        type: ActionType.getAffiliateStatus,
        payload: res,
      });
    });
};

export const createUserName = (name, address) => {
  return new Promise((resolve, reject) => {
    network
      .post(UrlConst.createUserName, { _name: name, _address: address })
      .then((res) => {
        resolve();
      })
      .catch((err) => {
        reject(String(err));
      });
  });
};

export const getUserName = (address) => (dispatch) => {
  network.get(UrlConst.getUserName, { address }).then((res) => {
    dispatch({
      type: ActionType.getUserName,
      payload: res.data.userName,
    });
  });
};

export const getUserAddress = (name) => (dispatch) => {
  network.get(UrlConst.getUserAddress, { name }).then((res) => {
    dispatch({
      type: ActionType.getUserAddress,
      payload: res.data.userAddress,
    });
  });
};

