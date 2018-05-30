<template lang="jade">
  include ../components.jade
  #internetStatistics
    +sideMenuPage('Home')
      +breadcrumb("ids_diagnostic")
      div
        table.el-table
          tbody
            tr
              th {{vuex.res.ids_diagnostic}}
              th {{vuex.res.ids_diagnostic_data}}
            tr
              td RSSI
              td {{page.NetworkInfo.RSSI | showdBm}}
            tr
              td EC/IO
              td {{page.NetworkInfo.EcIo | showEcIoLACSellId}}
              
            tr
              td LAC Code
              td {{page.NetworkInfo.LAC | showEcIoLACSellId}}
               
            tr
              td Cell ID
              td {{page.NetworkInfo.CellId | showEcIoLACSellId}}

            tr
              td RSRP
              td {{page.NetworkInfo.RSRP | showRSCPRSRP}}

            tr
              td SINR
              td {{page.NetworkInfo.SINR | showSINR}}
</template>
<script>
import {
  _,
  _config,
  $,
  vuex,
  G,
  units
} from '../../common.js';
var Config = _config.diagnostic;
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
        this.vuex = vuex
        this.units = units
        this.initdata(Config);
        this.page = {
          NetworkInfo: {} 
        };
        this.getData();
      },
      getData() {
        this.sdk.get("GetNetworkInfo", null, (res) => {
          this.page.NetworkInfo = res
        });
      }
    }
}
</script>
<style lang="sass" scoped>
.el-table {
  width: 60%;
  margin-top: 50px;
}
tr {
  th {
    width: 50%;
  }
}
</style>