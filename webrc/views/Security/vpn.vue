<template lang="jade">
  include ../components.jade
  #vpn
    +sideMenuPage('Settings')
      +breadcrumb("ids_vpn_title")
      +form("formData")
        +formItem("ids_vpn_title:")
          el-switch(v-model="page.status" @change="update()" on-text="" off-text="")
</template>

<script>
import {
  $,
  vuex,
  _,
  _config
} from '../../common.js';
var Config = _config.vpn;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.initdata(Config);
        this.page = {
          status: false
        }
        this.sdk.get("GetVPNPassthrough", null, (res) => {
          this.formData = res;
          this.page.status = this.formData.status == 1 ? true : false;
        })
      },
      update() {
        let results = {
          callback: this.init
        };
        this.formData.status = this.page.status == true ? 1 : 0;
        this.sdk.post("SetVPNPassthrough", this.formData, results)
      }
    }
}
</script>

<style lang="sass" scoped>
</style>