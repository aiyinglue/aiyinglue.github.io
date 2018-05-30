import G from "../../config/G.js";
import filters from '../../filters/filters.js';

export default {
  GetSystemStatus: {
    Request(req) {
      return req;
    },
    Response(res) {
      res.exRoaming = res.Roaming == G.ROAM_STATE_YES ? true : false;
      res.SignalStrength = filters.signalStrength(res.SignalStrength);
      return res;
    }
  },
  GetCurrentTime: {
    Request(req) {
      return req;
    },
    Response(res) {
      res.exCurrTime = filters.formatBlockTime(res.CurrTime);
      return res;
    }
  }
} 
