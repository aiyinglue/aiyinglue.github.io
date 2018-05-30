//import G from "../../config/G.js";
import { _, $, G } from '../../common.js';
export default {
  GetParentalSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      return res;
    }
  },
  SetParentalSettings: {
    Request(req) {
      req= JSON.parse(JSON.stringify(req));
      let list = ["list_id", "device_name", "mac_address", "url", "forbidden_Starttime", "forbidden_Endtime", "Control_status"];
      _.each(req.ParentalControl_list, (v, i) => {
        $.each(v, function(name, value) {
          if ($.inArray(name, list) == -1) { 
            delete req.ParentalControl_list[i][name];
          };

        });
      })
      return req;
    },
    Response(res) {
      return res;
    }
  }
}

