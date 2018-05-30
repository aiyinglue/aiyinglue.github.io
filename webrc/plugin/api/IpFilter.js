//import G from "../../config/G.js";
import {_,$,G} from '../../common.js';
export default {
  getIPFilterList: {
    Request(req) {
      return req;
    },
    Response(res) {
      if (res.ipFilter_list.length > 0) {
        _.each(res.ipFilter_list, (i, v) => {
          res.ipFilter_list[v].lan_port = String(i.lan_port);
          res.ipFilter_list[v].wan_port = String(i.wan_port);
        })
      }
      if (res.ipFilterAllowlist.length > 0) {
        _.each(res.ipFilterAllowlist, (i, v) => {
          res.ipFilterAllowlist[v].lan_port = String(i.lan_port);
          res.ipFilterAllowlist[v].wan_port = String(i.wan_port);
        })
      }
      return res;
    }
  },
  SetIPFilter: {
    Request(req) {
      let list=["list_id","lan_ip","lan_port","wan_ip","wan_port","ip_protocol","ip_status"];
      if (req.ipFilter_list.length > 0) {
        _.each(req.ipFilter_list, (v, i) => {
          $.each(v,function(name,value) { 
            if ($.inArray(name, list) == -1) {//; 
              delete req.ipFilter_list[i][name];
            }; 
            
          }); 
          req.ipFilter_list[i].lan_port = Number(v.lan_port);
          req.ipFilter_list[i].wan_port = Number(v.wan_port);
        })
      }
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
