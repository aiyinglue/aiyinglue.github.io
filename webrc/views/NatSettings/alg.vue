<template lang="jade">
  include ../components.jade
  #algSettings
    +sideMenuPage('Settings')
      +breadcrumb("ids_alg_title")
      +form("formData")
        +radio("FTP:","FtpStatus")
        +radio("ids_alg_h323Status:","H323AlgStatus")
        +radio("ids_alg_sipStatus:","SipAlgStatus")
        +input("ids_alg_sipPort","SipAlgPort")
        +formBtn()
        p.tips {{vuex.res.ids_note}}:<br/>{{vuex.res.ids_alg_Note}}
</template>

<script>
import {_,_config,vuex} from '../../common.js';
var Config = _config.algSettings;
export default {
  created() {
      this.initdata(Config);
      this.init()
    },
    methods: {
      init() {
        this.vuex=vuex;
        this.sdk.get("GetALGSettings", null, (res) => {
          _.extend(this.formData,res)
        })
      },
      update() {
        let setForm = () => {
          this.sdk.post("SetALGSettings", this.formData, {
            callback: this.init
          })
        }
        this.submit("formData", setForm)
      }
    }
}
</script>

<style lang="sass" scoped>
</style>