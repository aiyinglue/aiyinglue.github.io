<template lang="jade">
  include ../components.jade
  #lanStatistics
    +sideMenuPage('Home')
      +breadcrumb("ids_lan_Lan")
      div.el-table-div
        table.el-table
          tbody
            tr
              th(rowspan="2") {{vuex.res.ids_lan_interface}}
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
              td {{list.LanFlag}}
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
var Config = _config.lanStatistics;
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
      init() {
        this.vuex=vuex
        this.initdata(Config);
        this.getData()
      },
      getData(){
        this.sdk.get("GetLanStatistics",null,(res)=>{
          this.formData = res;
        })
      }
    }
}
</script>

<style lang="sass" scoped>
</style>

