<template lang="jade">
  include ../components.jade
  #wanStatus
    +sideMenuPage('Settings')
      +breadcrumb("ids_wanStatus_menuWanStatus")
      el-form(label-width="200px")
        +text("ids_wanStatus_duration:","{{vuex.WanSettings.DurationTime | times('2')}}")
        +text("ids_wanStatus_conStatus:","{{vuex.WanSettings.exStatusStr | res}}")   
        +text("ids_wanStatus_macAdress:","{{formData.MacAddr}}")
        +text("ids_wanStatus_connectionMode:","{{vuex.WanSettings.exConnectTypeStr | res}}")
        +text("ids_wanStatus_ipAddress:","{{vuex.WanSettings.IpAddress}}")
        +text("ids_wanStatus_subnetMark:","{{vuex.WanSettings.SubNetMask}}")        
        +text("ids_wanStatus_defaultGateway:","{{vuex.WanSettings.Gateway}}")
        +text("ids_wanStatus_primaryDNS:","{{vuex.WanSettings.PrimaryDNS}}")
        +text("ids_wanStatus_secondaryDNS:","{{vuex.WanSettings.SecondaryDNS}}")
</template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
//let Config = _config.wanStatus;
export default {
  created() {
      this.init();
      this.InterWanConnStatus = setInterval(vuex.refreshWanConnStatus, 5000);
      this.InterWanSettings = setInterval(vuex.refreshWanSettings, 5000);
    },
    destroyed() {
      clearInterval(this.InterWanConnStatus);
      clearInterval(this.InterWanSettings);
      this.InterWanConnStatus = null;
      this.InterWanSettings = null;
    },
    methods: {
      init() {
        //this.initdata(Config);
        this.page = {};

        this.sdk.get("GetWanCurrentMacAddr", null, (res) => {
          _.extend(this.formData, res);
        });
        vuex.refreshWanConnStatus();
        vuex.refreshWanSettings();
      }
    }
}
</script>

<style lang="sass" scoped>
</style>