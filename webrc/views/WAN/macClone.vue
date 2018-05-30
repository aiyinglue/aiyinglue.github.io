<template lang="jade">
  include ../components.jade
  #macClone
    +sideMenuPage('Settings')
      +breadcrumb("ids_macClone_menuMacClone")
      +form("formData")
        +input("ids_macClone_currentMACAddress:","MacAddr")(disabled=true)
        el-form-item
          +button("ids_macClone_reset")(type="primary" @click="changeMACAddress('restore')")
        +input("ids_macClone_hostMACAddress:","HostMacAddr")        
        el-form-item
          +button("ids_macClone_clone")(type="primary" @click="changeMACAddress('clone')")
</template>

<script>
import { _, _config, $, vuex, G } from '../../common.js';
let Config = _config.macClone;
export default {
  created() {
    this.init();
    this.initdata(Config);
  },
  methods: {
    init() {
      this.sdk.get("GetWanCurrentMacAddr", null, (res) => {
        this.formData = res;
      })
    },

    changeMACAddress(type) {
      let setForm = () => {
        this.$confirm(vuex.res['ids_macClone_restartWarn'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_ok'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          let params = {
            "Type": 0,
            "MacAddr": ""
          }
          if (type == "clone") {
            params.Type = G.WAN_MAC_ADDRESS_CLONE;
            params.MacAddr = this.formData.HostMacAddr;
          }
          if (type == "restore") {
            params.Type = G.WAN_MAC_ADDRESS_RESTORE;
          }
          this.sdk.post("SetWanCurrentMacAddr", params, {
            callback: this.init
          });
        }).catch(() => {

        });
      }
      this.submit("formData", setForm)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>