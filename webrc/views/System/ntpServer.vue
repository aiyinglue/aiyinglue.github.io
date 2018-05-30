<template lang="jade">
  include ../components.jade
  #ntpServer
    +sideMenuPage('System')
      +breadcrumb("ids_system_ntpServer")
      +form("formData")
        +select("ids_system_ntpServer1:","NtpServer1")
        +select("ids_system_ntpServer2:","NtpServer2")
        +formBtn()

</template>
<script>
import {_config,$,sys} from '../../common.js';
import ElementUI from 'element-ui';
let Config = _config.ntpServer;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.initdata(Config);
        this.sdk.get("GetSystemSettings", null, (res) => {
          $.extend(this.formData, res);
        });
      },
      update() {
        this.sdk.post("SetSystemSettings", this.formData, (res) => {
          location.reload();
        });
      },
      requestJsonRpcIsOk(result) {
        return result.hasOwnProperty("result") && !result.hasOwnProperty("error");
      }
    }
}
</script>

<style lang="sass" scoped>
</style>