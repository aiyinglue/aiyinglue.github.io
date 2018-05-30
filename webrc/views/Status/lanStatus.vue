<template lang="jade">
  include ../components.jade
  #lanStatus
    +sideMenuPage('Home')
      +breadcrumb("ids_lan_Lan")
      table.state-table
        tr
          th(width="40%")
          th(width="30%") {{vuex.res.ids_lanStatus_Lan1}}
          th(width="30%") {{vuex.res.ids_lanStatus_Lan2}}
        tr
          td {{vuex.res.ids_lanStatus_conStatus}}:
          td {{page.lan1.ConnectionStatus|lanProtState}}
          td {{page.lan2.ConnectionStatus|lanProtState}}
        tr
          td {{vuex.res.ids_ipAddress}}:
          td {{page.lan1.IPAddress|dataDealWith}}
          td {{page.lan2.IPAddress|dataDealWith}}
        tr
          td {{vuex.res.ids_lan_macAdress}}:
          td {{page.lan1.MACAddress|dataDealWith}}
          td {{page.lan2.MACAddress|dataDealWith}}
        tr
          td {{vuex.res.ids_lanStatus_dhcpServer}}:
          td {{page.lan1.DHCPServer|dataDealWith}}
          td {{page.lan2.DHCPServer|dataDealWith}}
</template>

<script>
import {
  $,
  _config,
  vuex
} from '../../common.js'
var Config = _config.homeLanStatus

export default {
  created() {
      this.init();
      this.Inter = setInterval(() => {
        this.getLanPortInfo()
      }, 6000);
    },
    destroyed() {
      clearInterval(this.Inter)
      this.Inter = null
    },
    methods: {
      init() {
        this.vuex = vuex
        this.page = {
          lan1: {
            "LanFlag": "LAN1",
            "ConnectionStatus": 0,
            "IPAddress": "----",
            "MACAddress": "----",
            "DHCPServer": "----"
          },
          lan2: {
            "LanFlag": "LAN2",
            "ConnectionStatus": 0,
            "IPAddress": "----",
            "MACAddress": "----",
            "DHCPServer": "----"
          }
        }
        this.getLanPortInfo()
      },
      getLanPortInfo() {
        this.sdk.get("GetLanPortInfo", null, (res) => {
          let vm = this;
          if (res.List && $.isArray(res.List)) {
            $.each(res.List, (i, v) => {
              if (v.LanFlag.toUpperCase() == "LAN1") {
                vm.page.lan1 = v;
              };
              if (v.LanFlag.toUpperCase() == "LAN2") {
                vm.page.lan2 = v
              };
            })
          }
          this.page.lanPortInfo = res.List;
        })
      }
    }
}
</script>

<style lang="sass" scoped>
.state-table {
  width: 60%;
  margin: 40px auto;
  font-size: 14px;
  text-align: left;
  th,
  td {
    padding: 10px;
  }
}
</style>
