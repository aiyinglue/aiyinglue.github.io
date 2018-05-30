<template lang="jade">
  include ../components.jade
  div#deviceInfo
    +sideMenuPage('System')
      +breadcrumb("ids_system_deviceInfo")
      el-form(label-width="200px")
        +text("ids_system_deviceName:","{{page.SystemInfo.DeviceName}}")
        +text("ids_system_imei:","{{page.SystemInfo.IMEI}}")
        div(v-if="pageItem.SupportIMSI")
          +text("ids_system_imsi:","{{page.SystemInfo.IMSI}}")
        +text("ids_system_myNumber:","{{page.SystemInfo.MSISDN}}")
        div(v-if="pageItem.supportHwVersion")
          +text("ids_system_hardwareVersion:","{{page.SystemInfo.HwVersion}}")
        div(@click="activePicopointMonitor()" v-if="page.IsSupportActivePicopoint")
          +formItem("ids_system_softwareVersion:")
            div.el-text {{page.SystemInfo.SwVersionMain}}
        div(v-if="!page.IsSupportActivePicopoint")
          +text("ids_system_softwareVersion:","{{page.SystemInfo.SwVersionMain}}")
        div(v-if="pageItem.supportModemVersion")
          +text("ids_system_modemVersion:","{{page.SystemInfo.SwVersion}}")
        +text("ids_lan_macAdress:","{{page.SystemInfo.MacAddress}}")
</template>
<script>
import {_,_config,$,vuex,G} from '../../common.js';
let Config = _config.deviceinfo;
export default {
  /*data () {
    return {
      SystemInfo:{}
    }
  },*/
  created () {
    this.init()
    this.initdata(Config);
  },
  methods: {
    init (){
      this.page = {
          IsSupportActivePicopoint:_config.pageConfig.IsSupportActivePicopoint,
          SystemInfo:{},
          clickNum:0
        }
      this.sdk.get("GetSystemInfo",null,(res)=>{
        this.page.SystemInfo = res;
      })
    },

    activePicopointMonitor (){
      clearTimeout(this.Inter)
      this.Inter = null
      this.Inter = setTimeout(() => {
        this.page.clickNum = 0
      }, 5000);
      this.page.clickNum++
      if(this.page.clickNum>9){
        this.$router.push('activePicopoint');
      }
    }

  }
}
</script>

<style lang="sass" scoped>
.el-form-item {
  margin-bottom: 0
}
</style>
