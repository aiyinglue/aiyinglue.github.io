import G from "../../config/G.js";
export default {
  GetWanSettings: {
    Request(req) {
      return req;
    },
    Response(res) {
      let connType = "pppoe";
      let connTypeStr = "ids_wanConfigure_pppoe";
      let connState = "disconnected";
      let connStateStr = "ids_wanStatus_disconnected";
      switch (res.ConnectType) {
        case G.WAN_CONNECT_TYPE_PPPoE:
          connType = "pppoe";
          connTypeStr = "ids_wanConfigure_pppoe";
          break;
        case G.WAN_CONNECT_TYPE_DHCP:
          connType = "dhcp";
          connTypeStr = "ids_wanConfigure_dhcp";
          break;
        case G.WAN_CONNECT_TYPE_STATIC_IP:
          connType = "staticIP";
          connTypeStr = "ids_wanConfigure_staticIp";
          break;
        default:
          connType = "pppoe";
          connTypeStr = "ids_wanConfigure_pppoe";
          break;
      }
      if(res.Status == G.WAN_PORT_STATUS_CONNECTED){
        connStateStr = "ids_wanStatus_connected";
        connState = "connected";
      }else{
        connState = "disconnected";
        connStateStr = "ids_wanStatus_disconnected";
      }
      res.IpAddress = res.IpAddress || "0.0.0.0";
      res.exConnectType = connType;
      res.exConnectTypeStr = connTypeStr;
      res.exStatus = connState;
      res.exStatusStr = connStateStr;
      res.Mtu = String(res.Mtu);
      res.pppoeMtu = String(res.pppoeMtu);
      return res;
    }
  },

  SetWanSettings: {
    Request(req) {      
      req.Mtu = Number(req.Mtu);
      req.pppoeMtu = Number(req.pppoeMtu);
      return req;
    },
    Response(res) {
      return res;
    }
  },
  GetWanCurrentMacAddr: {
    Request(req) {

      return req;
    },
    Response(res) {
      res.exCurrMacAddr = res.MacAddr;
      return res;
    }
  },
  SetWanCurrentMacAddr: {
    Request(req) {
      return req;
    },
    Response(res) {
      return res;
    }
  },
  GetWanIsConnInter: {
    Request(req) {

      return req;
    },
    Response(res) {
      let connState = "disconnected";
      let connStateStr = "ids_wanStatus_disconnected";
      switch (res.ConnToInterStatus) {
        case G.WAN_PORT_INTERNET_DISCONNECTED:
          connState = "disconnected";
          connStateStr = "ids_wanStatus_disconnected";
          break;
        case G.WAN_PORT_INTERNET_CONNECTED:
          connStateStr = "ids_wanStatus_connected";
          connState = "connected";
          break;
        default:
          connStateStr = "ids_wanStatus_disconnected";
          connState = "disconnected";
          break;
      }
      res.exConnToInterStatus = connState;
      res.exConnToInterStatusStr = connStateStr;
      return res;
    }
  }
}
