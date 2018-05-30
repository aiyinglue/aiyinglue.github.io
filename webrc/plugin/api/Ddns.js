//import G from "../../config/G.js";
import { _, $, G } from '../../common.js';
export default {
  GetDdnsSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      return res;
    }
  },
  SetDdnsSettings: {
    Request(req) {
      //req= JSON.parse(JSON.stringify(req));
      let list = ["connection_status", "service_Provider", "status", "domain_name", "user_name", "password"];
      _.each(req.Ddns_list, (v, i) => {
        $.each(v, function(name, value) {
          if ($.inArray(name, list) == -1) { 
            delete req.Ddns_list[i][name];
            
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

