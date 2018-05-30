<template lang="jade">
  include ./components.jade
  #statusIcon.status
    ul
      li.iconfont.icon-ic_update(v-show="vuex.SystemStatus.ConnectionStatus == 2 && vuex.DeviceNewVersion.State == 1" @click="$router.push({ name: 'onlineUpgrade'})")
      li.icon-network-type(v-if="vuex.SimInfo.SIMState=='ready'") {{vuex.SystemStatus.NetworkType | networkType}}      
      li.svg-signal
        svg-img(:svgUrl="'ic_signal'+vuex.SystemStatus.SignalStrength+'.svg'" v-if="pageConfig.showFourOrFiveSignal")
        svg-img(:svgUrl="'ic_signal'+vuex.SystemStatus.SignalStrength+'_5.svg'" v-else="!pageConfig.showFourOrFiveSignal")  
        i.roaming(v-if="vuex.SystemStatus.exRoaming==true") R
      li.iconfont.icon-ic_global_off(:class="{'icon-ic_global_on':vuex.SystemStatus.ConnectionStatus==2||vuex.SystemStatus.ConnectionStatus==3}")
      li.iconfont.icon-ic_wifi_off(:class="{'icon-ic_wifi_on':(vuex.SystemStatus.WlanState==1)}" v-if="vuex.SystemStatus.WlanState!=2")
      li.icon-wps(v-if="vuex.SystemStatus.WlanState==2") WPS
      li.icon-sms(class='iconfont icon-ic_message' v-if="vuex.SystemStatus.SmsState==3")        
      li.svg-sms-full(v-if="vuex.SystemStatus.SmsState==1")
        svg-img(:svgUrl="'ic_message_full.svg'")
      li.iconfont.icon-ic_usb_disconnect(:class="{'icon-ic_usb_connect':(vuex.SystemStatus.UsbStatus==1||vuex.SystemStatus.UsbStatus==2)}" v-if="supportUSBStatus")
  
</template>

<script>
import {_config,vuex} from '../common.js'
export default {
  created () {
    this.init()
    setInterval(vuex.refreshSystemStatus,5000)
  },
  methods: {
    init (){
      this.vuex = vuex;
      this.pageConfig = _config.pageConfig;
      this.supportUSBStatus = _config.homeInternetStatus.pageItem.supportUSBStatus;
      vuex.initSimInfo();
      vuex.refreshSystemStatus();
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@scss/color.scss";
$iconDirectory:"../images/icon/";

</style>
