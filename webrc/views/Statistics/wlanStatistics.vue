<template lang="jade">
  include ../components.jade
  #wlanStatistics
    +sideMenuPage('Home')
      +breadcrumb("ids_wifi_WiFiTitle")
      div.el-table-div
        table.el-table
          tbody
            tr
              th(rowspan="2") {{vuex.res.ids_wifi_WiFiTitle}}
              th(rowspan="2") {{vuex.res.ids_lan_interface_ssid}}
              th(colspan="4") {{vuex.res.ids_wlan_received}}
              th(colspan="4") {{vuex.res.ids_statistics_send}}
            tr
              th {{vuex.res.ids_byte}}
              th {{vuex.res.ids_packet}} 
              th {{vuex.res.ids_statistics_error}} 
              th {{vuex.res.ids_discarded}} 
              th {{vuex.res.ids_byte}} 
              th {{vuex.res.ids_packet}}   
              th {{vuex.res.ids_statistics_error}} 
              th {{vuex.res.ids_discarded}}
            tr(v-for="list in formData.List")
              td
                span(v-if ='list.Ssid == page.AP2GSSid')  {{vuex.res.ids_wlan_2ghz}}
                span(v-if ='list.Ssid == page.AP5GSSid') {{vuex.res.ids_wlan_5ghz}}
                span(v-if ='list.Ssid != page.AP2GSSid&&list.Ssid != page.AP5GSSid') {{vuex.res.ids_wlan_2ghz_guest}}
              td {{list.Ssid}}
              td {{list.ReceivedByte | covertNumKb}}
              td {{list.ReceivedPacket}} 
              td {{list.ReceivedError}} 
              td {{list.ReceivedDiscarded}} 
              td {{list.SentByte | covertNumKb}} 
              td {{list.SentPacket}}  
              td {{list.SentError}} 
              td {{list.SentDiscarded}}  
</template>
<script>
import {_,_config,$,vuex,G} from '../../common.js';
var Config = _config.wlanStatistics;
export default {
  created() {
    this.init()
    this.Inter = setInterval(() => {
      this.getData()
    }, 6000);
  },
  destroyed() {
    clearInterval(this.Inter)
    this.Inter = null
  },
  methods: {
    init (){
      this.vuex= vuex
      this.initdata(Config);
      this.page = {
        wlanSettings:{},
        AP2GSSid: "",
        AP5GSSid: ""
      }
      this.sdk.get("GetWlanSettings", null, (res) => {
        this.page.wlanSettings = res;
        this.page.AP2GSSid = this.page.wlanSettings.AP2G.Ssid;
        this.page.AP5GSSid = this.page.wlanSettings.AP5G.Ssid;
      })
      this.getData();      
    },
    getData(){
      this.sdk.get("GetWlanStatistics",null,(res)=>{
        this.formData = res;
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>