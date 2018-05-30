import G from "../../config/G.js";
import _ from 'underscore';
import apidata from "./data.js";
export default {
  GetWlanSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      if (res.AP2G.ApStatus == 2) {
        res.AP2G.ApStatus = 1;
        //res.AP2G.exWpsStatus = true;
      }
      if (!_.has(res, "AP5G") || !_.has(res.AP5G, "ApStatus")) {
        res.AP5G = apidata.GetWlanSettings.AP5G
      }
      if (!_.has(res, "AP2G_guest")) {
        res.AP2G_guest = apidata.GetWlanSettings.AP2G_guest
      }
      if (res.AP2G_guest.ApStatus == 2) {
        res.AP2G_guest.ApStatus = 1;
      }
      if (res.AP5G.ApStatus == 2) {
        res.AP5G.ApStatus = 1;
      }
      return res;
    }
  },

  SetWlanSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
