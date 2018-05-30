<template lang="jade">
  include ../components.jade
  #wlanStatus
    +sideMenuPage('Home')
      +breadcrumb("ids_wifi_WiFiTitle")
      +form("formData")
        
        div.internetInfo(v-if="page.isDisplay")
          div.modeTitle()
            +text("ids_wlan_2ghz","{{page.wlanAP2GModeText}}","")
          div.AP2GMode(v-show="page.ApStatus2GMode")
            +text("ids_wifi_ssid:","{{formData.AP2G.Ssid}}","")
              +button('ids_wlanStatus_change')(@click="warningEvent('basic')" type="primary" size="small")
            +text("ids_wlan_ssidBroadcast:","{{page.ssid2gBroadcastTxt}}","")
            +text("ids_wlan_security:","{{formData.AP2G.SecurityMode|valText(WlanConfig.formOptions.AP2G.SecurityMode)}}","")
            +text("ids_wlanStatus_connectedUsers:","{{formData.AP2G.curr_num}}","")
            +text("ids_wlanStatus_gatewayAddress:","{{formData.IPv4IPAddress}}","")
            +text("ids_lan_macAdress:","{{page.SystemInfo.MacAddress}}","")
          div(v-if="pageConfig.IsSupportWiFiAP2G_guest")
            div.line
            div.modeTitle(v-if="formData.AP2G_guest.ApStatus==0")
              +text("ids_wlan_2ghz_guest","{{vuex.res.ids_disabled}}")
            div.AP2G_GeustMode(v-if="formData.AP2G_guest.ApStatus!=0")
              +text("ids_wifi_ssid:","{{formData.AP2G_guest.Ssid}}")
                +button('ids_wlanStatus_change')(@click="warningEvent('basic')" type="primary" size="small")
              +text("ids_wlan_ssidBroadcast:","{{formData.AP2G_guest.SsidHidden|valText(WlanConfig.formOptions.AP2G_guest.SsidHidden)}}")
              +text("ids_wlan_security:","{{formData.AP2G_guest.SecurityMode|valText(WlanConfig.formOptions.AP2G_guest.SecurityMode)}}")
              +text("ids_wlanStatus_connectedUsers:","{{formData.AP2G_guest.curr_num}}")
              +text("ids_wlanStatus_gatewayAddress:","{{formData.IPv4IPAddress}}")
              +text("ids_lan_macAdress:","{{page.SystemInfo.MacAddress}}")      
          div(v-if="pageConfig.IsSupportWiFi5G")
            div.line
            div.modeTitle
              +text("ids_wlan_5ghz","{{page.wlanAP5GModeText}}")
            div.AP5GMode(v-show="page.ApStatus5GMode")
              +text("ids_wifi_ssid:","{{formData.AP5G.Ssid}}")
                +button('ids_wlanStatus_change')(@click="warningEvent('basic')" type="primary" size="small")
              +text("ids_wlan_ssidBroadcast:","{{page.ssid5gBroadcastTxt}}","")
              +text("ids_wlan_security:","{{formData.AP5G.SecurityMode|valText(WlanConfig.formOptions.AP5G.SecurityMode)}}","")
              +text("ids_wlanStatus_connectedUsers:","{{formData.AP5G.curr_num}}","")
              +text("ids_wlanStatus_gatewayAddress:","{{formData.IPv4IPAddress}}","")
              +text("ids_lan_macAdress:","{{page.SystemInfo.MacAddress5G}}","")      
      //-+formBtn()
</template>

<script>
import { $, _, G, _config, vuex } from '../../common.js'
var Config = _config.homeWlanStatus

export default {
  created() {
    this.init();

  },
  methods: {
    init() {
      this.vuex = vuex;
      this.initdata(Config);
      this.pageConfig = _config.pageConfig;
      this.WlanConfig = _config.Wlan;
      this.page = {
        ssid2gBroadcastTxt: "",
        ssid5gBroadcastTxt: "",
        ApStatus2GMode: false,
        ApStatus5GMode: false,
        wlanAP2GModeText: "",
        wlanAP5GModeText: "",
        numFinish: 0,
        countFinish: 3,
        SystemInfo: {},
        isDisplay: false
      }

      this.sdk.get("GetWlanSettings", null, (res) => {
        _.extend(this.formData, res);
        if (++this.page.numFinish == this.page.countFinish) {
          this.wlanSupportMode();
        }
      });
      this.sdk.get("GetSystemInfo", null, (res) => {
        this.page.SystemInfo = res;
        if (++this.page.numFinish == this.page.countFinish) {
          this.wlanSupportMode();
        }
      });
      this.sdk.get("GetLanSettings", null, (res) => {
        _.extend(this.formData, res);
        if (++this.page.numFinish == this.page.countFinish) {
          this.wlanSupportMode();
        }
      });

    },
    wlanSupportMode() {
      this.page.isDisplay = true;
      if(this.formData.AP2G.ApStatus != G.WLAN_MODEL_ApStatus_DISABLE){
        this.page.ApStatus2GMode = true;
      }else{
        this.page.ApStatus2GMode = false;
        this.page.wlanAP2GModeText = this.vuex.res.ids_disabled;
      }

      if(this.formData.AP5G.ApStatus != G.WLAN_MODEL_ApStatus_DISABLE){
        this.page.ApStatus5GMode = true;
      }else{
        this.page.ApStatus5GMode = false;
        this.page.wlanAP5GModeText = this.vuex.res.ids_disabled;
      }
      this.page.ssid2gBroadcastTxt = this.vuex.res[Config.ssidBroadcastArr[this.formData.AP2G.SsidHidden][Config.ssidBroadcastDisplayNum]];
      this.page.ssid5gBroadcastTxt = this.vuex.res[Config.ssidBroadcastArr[this.formData.AP5G.SsidHidden][Config.ssidBroadcastDisplayNum]];
    },
    warningEvent(router) {
      let vm = this;
      if (this.pageItem.warningBeforeChange) {
        this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
          confirmButtonText: vuex.res['ids_ok'],
          callback: action => {
            vm.$router.push(router);
          }
        })
      } else {
        vm.$router.push(router);
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>