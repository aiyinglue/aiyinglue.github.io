//import G from "../../config/G.js";
import {_,$,G} from '../../common.js';
export default {
  GetClientConfiguration: {
    Request(req) {
      return req;
    },
    Response(res) {
      res.InformInterval = String(res.InformInterval);
      return res;
    }
  },
  SetClientConfiguration: {
    Request(req) {      
      req.InformInterval = Number(req.InformInterval);
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
