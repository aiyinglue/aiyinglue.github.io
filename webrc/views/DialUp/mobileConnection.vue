<template lang="jade">
  include ../components.jade
  #mobileConnection
    +sideMenuPage('Settings')
      +breadcrumb("ids_network_Mobconn")
      +form("formData")
        div(v-if="pageItem.ConnectModeVisible")
          div(v-formLabelIcon="pageItem.ConnectModeHelp")
            +radio("ids_netwrok_connectionMode:","ConnectMode")            
            span(class='iconfont icon-help' v-popover:popover2)
              el-popover(ref="popover2" placement="bottom" width="200" trigger="click")
                div {{vuex.res.ids_network_ConnectionModeTips}} 
        div(v-show="pageConfig.displayDataRoamingSwitch")           
          +formItem("ids_network_dataRoaming:")(v-show="formData.ConnectMode==1")
            el-switch(v-model="page.RoamingConnect" on-text="" off-text="")  
            div.noteTips(v-if="pageItem.isNetworkRoamNoteRule") {{vuex.res.ids_network_noteRule}}
        +select("ids_netwrok_connnectIpMode:","PdpType")        
        +formItem("")
          +button("ids_apply")(type="primary" @click="vuex.ConnectionActivePopu(update)")
          +button("ids_cancel")(type="primary" @click="init")
  </template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
var Config = _config.mobileConnection;
export default {
  created() {
      this.init();
      this.initdata(Config);
    },
    methods: {
      init() {
        this.pageConfig = _config.pageConfig;
        this.page = {
          RoamingConnect: false
        }
        this.vuex= vuex
        this.sdk.get("GetConnectionSettings", null, (res) => {
          this.formData = res;
          this.page.RoamingConnect = this.formData.RoamingConnect == 1 ? true : false;
        })
      },
      update() {
        let results = {
          callback:this.init
        };
        // no form validate ,no need to setform submitted.
        this.formData.RoamingConnect = this.page.RoamingConnect == true ? 1 : 0;
        this.sdk.post("SetConnectionSettings", this.formData, results);
      }
    }
}
</script>
<style lang="sass" scoped>
.noteTips{
  line-height:21px;
  font-size: 14px;
  color: #5e6d82;

}
</style>