<template lang="jade">
  include ../components.jade
  #upnpSettings
    +sideMenuPage('Settings')
      +breadcrumb("ids_upnp_upnpTitle")
      +form("formData")
        //-+radio("ids_upnp_upnpTitle:","upnp_switch")
        +formItem("ids_upnp_upnpTitle:")
          el-switch(v-model="page.upnp_switch" on-text="" off-text="" @change="update()")
        //-+formBtn()
        p.tips {{vuex.res.ids_note}}:<br/>{{vuex.res.ids_upnp_upnpNote}}
</template>

<script>
import {_,_config,vuex} from '../../common.js';
var Config = _config.upnpSettings;
export default {
  created () {
    this.initdata(Config);
    this.init();
  },
  methods: {
    init (){
      this.vuex=vuex;
      this.page = {
        upnp_switch:false
      }
      this.sdk.get("GetUpnpSettings",null,(res)=>{
        _.extend(this.formData,res)
        this.page.upnp_switch = this.formData.upnp_switch == 1 ? true:false;
      })
    },
    update (){
      this.formData.upnp_switch = this.page.upnp_switch == true ? 1:0;
      this.sdk.post("SetUpnpSettings",this.formData,{
        callback:this.init
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>