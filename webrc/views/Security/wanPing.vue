<template lang="jade">
  include ../components.jade
  #wanPing
    +sideMenuPage('Settings')
      +breadcrumb("ids_wanPing_title")
      +form("formData")
        +formItem("ids_wanPing_wanPortPing:")
          el-switch(v-model="page.Wan_ping_status" @change="update()" on-text="" off-text="")
        p.tips {{vuex.res.ids_note}}:<br />{{vuex.res.ids_wanPing_wanPingNote}}
</template>

<script>
import {$,vuex,_,_config} from '../../common.js';
var Config = _config.wanPing;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.initdata(Config);
        this.page={
          Wan_ping_status:false
        }
        this.sdk.get("getFirewallSwitch", null, (res) => {
          this.formData = res;
          this.page.Wan_ping_status = this.formData.wan_ping_status == 1 ? true : false;
        })
      },
      update() {
        let results = {
          callback:this.init
        };
        this.formData.wan_ping_status = this.page.Wan_ping_status == true ? 1 : 0;
        this.sdk.post("setFirewallSwitch", this.formData, results)
      }
    }
}
</script>

<style lang="sass" scoped>
</style>