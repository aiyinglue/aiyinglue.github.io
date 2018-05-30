<template lang="jade">
  include ../components.jade
  #wanConfigure
    +sideMenuPage('Settings')
      +breadcrumb("ids_wanConfigure_Title")
      +form("formData")
        +select("ids_wanConfigure_connectionMode:","ConnectType")
        div(v-if="formData.ConnectType == 2")
          +input("ids_wanConfigure_ipAddress:","StaticIpAddress")
          +input("ids_wanConfigure_subnetMark:","SubNetMask")
          +input("ids_wanConfigure_defaultGateway:","Gateway")
          +input("ids_wanConfigure_Mtu:","Mtu")           
          +subText("","{{vuex.res.ids_wanConfigure_MtuNote | replace('1492','1500')}}")
          +input("ids_wanConfigure_primaryDNS:","PrimaryDNS")
          +input("ids_wanConfigure_secondaryDNS:","SecondaryDNS")
        div(v-if="formData.ConnectType == 0")
          +input("ids_wanConfigure_userName:","Account")(:maxlength="32")
          +input("ids_wanConfigure_password:","Password")(:maxlength="32")
          +input("ids_wanConfigure_Mtu:","pppoeMtu")
          +subText("","{{vuex.res.ids_wanConfigure_MtuNote}}")
          
          
        +formBtn()      

</template>

<script>
import { _, _config, $, vuex, G } from '../../common.js';
let Config = _config.wanConfigure;
export default {
  created() {
    this.init()
  },
  methods: {
    init() {
      this.vuex = vuex
      this.initdata(Config);
      this.sdk.get("GetWanSettings", null, (res) => {
        this.formData = res;
      })
    },

    update() {
      let setForm = () => {
        this.$confirm(vuex.res['ids_wanConfigure_restartWarn'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_ok'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          let params = _.pick(this.formData, function (value, key, object) {
            function isAPIParam(value) {
              return key.substring(0, 2) != "ex" ? true : false;
            }
            return isAPIParam(value);
          });
          this.sdk.post("SetWanSettings", params, {
            callback: this.init
          });
        }).catch(() => {

        });
      }
      if(this.formData.ConnectType!=1){
        this.submit("formData", setForm)
      }else{
        setForm()
      }
      
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
