<template lang="jade">
  include ../components.jade
  #wlanBasic
    +sideMenuPage('Settings')
      +breadcrumb("ids_wlan_basic")
      +form("formData")(style="width: 100%" v-loading.body="page.loading")
        div(v-if="pageConfig.IsSupportWiFi5G") {{vuex.res.ids_wlan_2ghz}}
        +switch("ids_wlan_wlan2g","page.AP2GApStatus")(@change="disable2ghz")
        //-+radio("ids_wlan_wlan2g","AP2G.ApStatus" )(@change="disable2ghz")
        div(v-if="formData.AP2G.ApStatus!=0")
          +input("ids_wlan_ssid:","AP2G.Ssid")(:maxlength="32")
          +switch("ids_wlan_ssidBroadcast","page.AP2GSsidHidden")(@change="disable24gSSIDbroadcast")
          //-+radio("ids_wlan_ssidBroadcast:","AP2G.SsidHidden")(@change="disable24gSSIDbroadcast")
          +select("ids_wlan_security:","AP2G.SecurityMode")
          div(v-show="formData.AP2G.SecurityMode==1" v-if="page.SupporWifiCertificationHide")
            +select("ids_wlan_encryption:","AP2G.WepType")
          div(v-show="formData.AP2G.SecurityMode==2||formData.AP2G.SecurityMode==3||formData.AP2G.SecurityMode==4"  v-if="page.SupporWifiCertificationHide")
            +select("ids_wlan_encryption:","AP2G.WpaType")
          div(v-if="formData.AP2G.SecurityMode==1")
            +input("ids_wlan_wlanPassword:","AP2G.WepKey")(:type="formData.show2GPassword==1?'text':'password'")
          div(v-if="formData.AP2G.SecurityMode==2||formData.AP2G.SecurityMode==3||formData.AP2G.SecurityMode==4")
            +input("ids_wlan_wlanPassword:","AP2G.WpaKey")(:type="formData.show2GPassword==1?'text':'password'")
          div(v-show="formData.AP2G.SecurityMode!=0")
            +checkbox("","show2GPassword","ids_wlan_showPw")
        div.category(v-if="pageConfig.IsSupportWiFiAP2G_guest")
          +switch("ids_wlan_2ghz_guest","page.AP2G_guestApStatus")(@change="disableAP2G_guest")
          div(v-if="formData.AP2G_guest.ApStatus!=0")
            +input("ids_wifi_ssid:","AP2G_guest.Ssid")(:maxlength="32")
            +switch("ids_wlan_ssidBroadcast","page.AP2G_guestSsidHidden")(@change="disableAP2G_guestSSIDbroadcast")
            +select("ids_wlan_security:","AP2G_guest.SecurityMode")
            div(v-show="formData.AP2G_guest.SecurityMode==1"  v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP2G_guest.WepType")
            div(v-show="formData.AP2G_guest.SecurityMode==2||formData.AP2G_guest.SecurityMode==3||formData.AP2G_guest.SecurityMode==4"  v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP2G_guest.WpaType")
            div(v-if="formData.AP2G_guest.SecurityMode==1")
              +input("ids_wlan_wlanPassword:","AP2G_guest.WepKey")(:type="formData.showAP2G_guestPassword==1?'text':'password'")
            div(v-if="formData.AP2G_guest.SecurityMode==2||formData.AP2G_guest.SecurityMode==3||formData.AP2G_guest.SecurityMode==4")
              +input("ids_wlan_wlanPassword:","AP2G_guest.WpaKey")(:type="formData.showAP2G_guestPassword==1?'text':'password'")
            div(v-show="formData.AP2G_guest.SecurityMode!=0")
              +checkbox("","showAP2G_guestPassword","ids_wlan_showPw")
        div(v-if="pageConfig.IsSupportWiFi5G")
          div.category-title {{vuex.res.ids_wlan_5ghz}}
          +switch("ids_wlan_wlan5g","page.AP5GApStatus")(@change="disable5ghz")
          //-+radio("ids_wlan_wlan5g","AP5G.ApStatus")(@change="disable5ghz")
          div(v-if="formData.AP5G.ApStatus!=0")
            +input("ids_wifi_ssid:","AP5G.Ssid")(:maxlength="32")
            +switch("ids_wlan_ssidBroadcast","page.AP5GSsidHidden")(@change="disable5gSSIDbroadcast")
            //-+radio("ids_wlan_ssidBroadcast","AP5G.SsidHidden")(@change="disable5gSSIDbroadcast")
            +select("ids_wlan_security:","AP5G.SecurityMode")
            div(v-show="formData.AP5G.SecurityMode==1"  v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP5G.WepType")
            div(v-show="formData.AP5G.SecurityMode==2||formData.AP5G.SecurityMode==3||formData.AP5G.SecurityMode==4"  v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP5G.WpaType")
            div(v-if="formData.AP5G.SecurityMode==1")
              +input("ids_wlan_wlanPassword:","AP5G.WepKey")(:type="formData.show5GPassword==1?'text':'password'")
            div(v-if="formData.AP5G.SecurityMode==2||formData.AP5G.SecurityMode==3||formData.AP5G.SecurityMode==4")
              +input("ids_wlan_wlanPassword:","AP5G.WpaKey")(:type="formData.show5GPassword==1?'text':'password'")
            div(v-show="formData.AP5G.SecurityMode!=0")
              +checkbox("","show5GPassword","ids_wlan_showPw")
        +formBtn()
</template>

<script>
import {$,_config,vuex} from '../../common.js';
let Config = _config.Wlan;
export default {
  created() {
      this.initdata(Config);
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.pageConfig=_config.pageConfig;
        this.page = {
          loading: false,
          SupporWifiCertificationHide:true,
          AP2GApStatus:false,
          AP5GApStatus:false,
          AP2GSsidHidden:false,
          AP5GSsidHidden:false,
          AP2G_guestApStatus:false,
          AP2G_guestSsidHidden:false,
        };
        this.sdk.get("GetWlanSettings", null, (res) => {
          $.extend(this.formData, res)
          this.page.AP2GApStatus = res.AP2G.ApStatus==1?true:false
          this.page.AP2GSsidHidden = res.AP2G.SsidHidden==0?true:false
          this.page.AP5GApStatus = res.AP5G.ApStatus==1?true:false
          this.page.AP5GSsidHidden = res.AP5G.SsidHidden==0?true:false
          this.page.AP2G_guestApStatus = res.AP2G_guest.ApStatus==1?true:false
          this.page.AP2G_guestSsidHidden = res.AP2G_guest.SsidHidden==0?true:false
        });
        if(Config.pageItem.SupporWifiCertification){
          this.page.SupporWifiCertificationHide = false;
        }
      },
      update() {
        let vm = this;
        let setForm = () => {          
          if(vm.checkValidate() == false){
            return;
          } 
          vm.$confirm(vuex.res['ids_wlan_restartWarn'], vuex.res['ids_confirm'], {
            confirmButtonText: vuex.res['ids_ok'],
            cancelButtonText: vuex.res['ids_cancel'],
            type: 'warning'
          }).then(() => {
            vm.page.loading = true;
            vm.sdk.post("SetWlanSettings", vm.formData, {
              callback: vm.init
            });
          }).catch(() => {

          });
        }
        if(Config.pageItem.SupporWifiCertification){
          if(this.formData.AP2G.SecurityMode==3){
            this.formData.AP2G.WpaType = 1;
          }else if(this.formData.AP2G.SecurityMode==4){
            this.formData.AP2G.WpaType = 2;
          }
          if(this.formData.AP2G_guest.SecurityMode==3){
            this.formData.AP2G_guest.WpaType = 1;
          }else if(this.formData.AP2G_guest.SecurityMode==4){
            this.formData.AP2G_guest.WpaType = 2;
          }
          if(this.formData.AP5G.SecurityMode==3){
            this.formData.AP5G.WpaType = 1;
          }else if(this.formData.AP5G.SecurityMode==4){
            this.formData.AP5G.WpaType = 2;
          }
        }

        if (this.formData.AP2G.ApStatus == 0 && (!this.pageConfig.IsSupportWiFi5G||this.formData.AP5G.ApStatus == 0)&&(!this.pageConfig.IsSupportWiFiAP2G_guest||this.formData.AP2G_guest.ApStatus==0)) {
          setForm()
        } else {
          vm.submit("formData", setForm)
        }

      },
      disable2ghz() {
        this.formData.AP2G.ApStatus = this.page.AP2GApStatus?1:0;
        if (this.pageItem.Disable2g5gwarning && this.formData.AP2G.ApStatus == 0) {
          this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disableAP2G_guest() {
        this.formData.AP2G_guest.ApStatus = this.page.AP2G_guestApStatus?1:0;
        if (this.pageItem.Disable2g5gwarning && this.formData.AP2G_guest.ApStatus == 0) {
          this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disableAP2G_guestSSIDbroadcast() {
        this.formData.AP2G_guest.SsidHidden = this.page.AP2G_guestSsidHidden?0:1;
        if (this.pageItem.DisableSSIDbroadcastwarning && this.formData.AP2G_guest.SsidHidden == 1) {
          this.$alert(vuex.res['ids_wlan_ssidDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable5ghz() {
        this.formData.AP5G.ApStatus = this.page.AP5GApStatus?1:0;
        if (this.pageItem.Disable2g5gwarning && this.formData.AP5G.ApStatus == 0) {
          this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable24gSSIDbroadcast() {
        this.formData.AP2G.SsidHidden = this.page.AP2GSsidHidden?0:1;
        if (this.pageItem.DisableSSIDbroadcastwarning && this.formData.AP2G.SsidHidden == 1) {
          this.$alert(vuex.res['ids_wlan_ssidDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable5gSSIDbroadcast() {
        this.formData.AP5G.SsidHidden = this.page.AP5GSsidHidden?0:1;
        if (this.pageItem.DisableSSIDbroadcastwarning && this.formData.AP5G.SsidHidden == 1) {
          this.$alert(vuex.res['ids_wlan_ssidDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      checkValidate() {
        let vm = this;
        if(vuex.SystemStatus.WlanState == 2){
          vm.$alert(vuex.res['ids_wps_wpsActive'], vuex.res['ids_error'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
            }
          });
          return false;
        }else{
          return true;
        }
      }
    }
}
</script>
<style lang="sass" scoped>
span {
  font-size: 14px;
  margin: 20px 0 0 95px;
}
</style>