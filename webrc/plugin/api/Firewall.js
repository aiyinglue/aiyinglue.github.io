//import G from "../../config/G.js";
import {_,$,G} from '../../common.js';
export default {
  getPortFwding: {
    Request(req) {
      return req;
    },
    Response(res) {
      if (res.portfwd_list.length > 0) {
        _.each(res.portfwd_list, (i, v) => {
          res.portfwd_list[v].private_port = String(i.private_port);
          res.portfwd_list[v].global_port = String(i.global_port);
        })
      }
      return res;
    }
  },
  SetPortFwding: {
    Request(req) {
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
