<template lang="jade">
  include ../components.jade
  #lanSettings
    +sideMenuPage('Settings')
      +breadcrumb("ids_lanSettings_lanSettings")
      +form("formData")
        +input("ids_lanSettings_gatewayAddress:","IPv4IPAddress")
        +input("ids_lanSettings_subnetMark","SubnetMask")
        //-+radio("ids_lanSettings_dhcpServer:","DHCPServerStatus")
        +formItem("ids_lanSettings_dhcpServer:")
            el-switch(v-model="page.dhcpServerStatus" on-text="" off-text="")
        div(v-if="page.dhcpServerStatus==true")
          +input("ids_lanSettings_startIpAddress:","StartIPAddress")
          +input("ids_lanSettings_endIpAddress:","EndIPAddress")
          +select("ids_lanSettings_dhcpLeaseTime:","DHCPLeaseTime","{{vuex.res.ids_lanSettings_hours}}")         
        +formBtn()
</template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
let Config = _config.lanSettings;
export default {
  created() {
      this.init();
      this.initdata(Config, this);
    },
    methods: {
      init() {            
        this.vuex = vuex;
        this.page={
          dhcpServerStatus:true
        }
        this.sdk.get("GetLanSettings", null, (res) => {
          this.formData = res;
          this.page.dhcpServerStatus=this.formData.DHCPServerStatus==1?true:false;
        })
      },
      update (){
        let setForm = () => {
          this.$confirm(vuex.res['ids_lanSettings_restartWarn'], vuex.res['ids_confirm'], {
            confirmButtonText: vuex.res['ids_ok'],
            cancelButtonText: vuex.res['ids_cancel'],
            type: 'warning'
          }).then(() => {
            this.formData.DHCPServerStatus=this.page.dhcpServerStatus==true?1:0;
            this.sdk.post("SetLanSettings", this.formData, {
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

<style lang="sass">
</style>