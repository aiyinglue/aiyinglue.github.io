import Vue from 'vue'
import $ from 'jquery'
import ElementUI from 'element-ui'
import config from './config_custom.js'

var vuex = {
  mainMenu: "Home",
  res: {},
  SimInfo: {},
  gotoHomeRouter: true,
  LoginToRouter: "",
  LoginToRouterParams: {},
  loginDialogFormVisible: false,
  currentLanguage: "en",
  SystemStatus: {},
  DeviceNewVersion: {},
  WanSettings: {},
  WanConnStatus: {},
  smsCount: {},
  callLogCount: {},
  heartBeatInterval: null,
  GetConnectionInfo: {},
  currentRouter: "",
  logoutMethod: null,
  timeLimit: null,
  tipsError: "",
  loginState: false,
  PwEncrypt:false,//根据接口返回值判断当前版本是否支持密码加密传输
  displayRedirect: false, //index sms smsForwarding components display or no
  changePasswordTipsDialogVisible: false,
  initRes: (cb) => {
    Vue.sdk.get("GetCurrentLanguage", null, (res) => {
      if ($.inArray(res.Language, config.pageConfig.langListSupport) == -1) {
        vuex.currentLanguage = config.pageConfig.langListSupport[0];
      } else {
        vuex.currentLanguage = res.Language;
      }
      $.get("/dist/i18n/" + vuex.currentLanguage + ".json" + "?rand=" + Math.random(), (data) => {
        if (typeof(data) == "string") {
          data = JSON.parse(data);
        }
        vuex.res = data;
        if ($.isFunction(cb)) {
          cb()
        }
      })
    })
  },
  initSimInfo: () => {
    clearTimeout(vuex.initSimInfoTimer)
    vuex.initSimInfoTimer = null
    Vue.sdk.get("GetSimStatus", null, (res) => {
        vuex.SimInfo = res;
        //if (res.SIMState == "initializing") {
          vuex.initSimInfoTimer = setTimeout(() => {
            vuex.initSimInfo()
          }, 2000)
        //}
    })
  },
  initLoginState: () => {
    Vue.sdk.get('GetLoginState', null, (res) => {
      if(res.hasOwnProperty("PwEncrypt")&&res.PwEncrypt==1){
        vuex.PwEncrypt = true;
      }else{
        vuex.PwEncrypt = false;
      }
      if (res.State === 1) {
        vuex.heartBeat(true);
        vuex.loginState = true;
      } else {
        vuex.heartBeat(false);
        vuex.loginState = false;
      }
    });
  },
  refreshSystemStatus: () => {
    Vue.sdk.get("GetSystemStatus", null, (res) => {
      vuex.SystemStatus = res;
    });
    if (vuex.SystemStatus.ConnectionStatus == 2) {
      Vue.sdk.get("GetDeviceNewVersion", null, (res) => {
        vuex.DeviceNewVersion = res;
      })
    }
  },
  refreshWanSettings: () => {
    Vue.sdk.get("GetWanSettings", null, (res) => {
      vuex.WanSettings = res;
    });
  },
  refreshWanConnStatus: () => {
    Vue.sdk.get("GetWanIsConnInter", null, (res) => {
      vuex.WanConnStatus = res;
    });
  },
  refreshSMSStorageState: () => {
    Vue.sdk.get("GetSMSStorageState", null, (res) => {
      vuex.smsCount = res;
    });
  },
  refreshCallLogCountInfo: () => {
    Vue.sdk.get("GetCallLogCountInfo", null, (res) => {
      vuex.callLogCount = res;
    });
  },
  heartBeat: (IsHeart) => {
    clearInterval(vuex.heartBeatInterval);
    vuex.heartBeatInterval = null;
    if (IsHeart) {
      vuex.heartBeatInterval = setInterval(() => {
        Vue.sdk.get("HeartBeat", null, (res) => {});
      }, 6000);
    }
  },

  ConnectionActivePopu: (callback, flag, cancelCallback) => {
    Vue.sdk.get("GetSystemStatus", null, (res) => {
      vuex.SystemStatus = res;
    });
    let ConnectionStatus = vuex.SystemStatus.ConnectionStatus
    if (ConnectionStatus == 1 || ConnectionStatus == 2 || ConnectionStatus == 3) {
      ElementUI.MessageBox.confirm(vuex.res['ids_wan_connectedRule'], vuex.res['ids_confirm'], {
        cancelButtonText: vuex.res['ids_cancel'],
        confirmButtonText: vuex.res['ids_disconnect'],
        closeOnClickModal: false,
        type: 'confirm'
      }).then(() => {
        let result = {
          callback() {
            vuex.refreshSystemStatus();
            setTimeout(function(){
              callback.apply();
            },1000)
          }
        }
        let params = {}
        params=flag == true ? { ReconnectFlag: 1 } : {};
        Vue.sdk.post("DisConnect", params, function(){
            vuex.refreshSystemStatus();
            setTimeout(function(){
              callback.apply();
            },500)
        });
      }).catch(() => {
        if(cancelCallback!=undefined){
          cancelCallback.apply();
        }
      });
    } else {
      callback.apply();
    }
  },

  listenLogout: (logoutTime) => {
    if (vuex.logoutMethod != null) {
      clearTimeout(vuex.logoutMethod);
      vuex.logoutMethod = null;
    }
    vuex.timeLimit = logoutTime;
    if (logoutTime != null) {
      vuex.logoutMethod = setTimeout(function() { vuex.logoutEvent() }, logoutTime);
    }
  },
  logoutEvent: () => {
    Vue.sdk.post("Logout", {}, (res) => {
      vuex.heartBeat(false);
      vuex.loginState = false;
      location.href="/"
      //location.reload();
    })
  },
  listenObj: () => {
    var DomObject = $(".container,.main-block,.header");
    if (vuex.timeLimit != null) {
      DomObject.bind("keydown", function() {
        vuex.listenLogout(vuex.timeLimit)
      });

      DomObject.bind('keyup click', function() {
        vuex.listenLogout(vuex.timeLimit)
      });
    }
  }
};

export default vuex;
