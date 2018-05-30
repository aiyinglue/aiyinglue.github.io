import G from "../../config/G.js";
export default {
  GetQosSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      res.UserUpBand = String(res.UserUpBand);
      res.UserDownBand = String(res.UserDownBand);
      return res;
    }
  },

  SetQosSettings: {
    Request(req) {
      req.UserUpBand = Number(req.UserUpBand);
      req.UserDownBand = Number(req.UserDownBand);
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
