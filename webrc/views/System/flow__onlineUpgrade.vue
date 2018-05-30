<template lang="jade">
  include ../components.jade
  #onlineUpgrade
    +breadcrumb("ids_onlineUpgrade_Online")
    sim-state(v-show="page.Status!=2&&vuex.SimInfo.SIMState!='noSim'||(page.Status!=2&&vuex.SimInfo.SIMState!='ready')")
    
</template>
<script>
import { $, vuex, G, _, _config } from '../../common.js';
let pageConfig = _config.pageConfig;
let Config = _config.onlineUpgrade;
export default {
  created() {
    let vm = this;
    vm.init()
  },
  methods: {
    init() {
      let vm = this;
      vm.vuex = vuex
      vuex.initSimInfo()
      vm.page = {
        IsAutoCheck: false,
        DeviceUpgradeState: {
          "Status": 0,
          "Process": 0
        },
        DeviceNewVersionInfo: {
          "State": 0,
          "Version": "",
          "total_size": 0
        }
      }
      vm.GetDeviceUpgradeState(true)
    },

    //查询下载状态
    GetDeviceUpgradeState(IsInit) {
      let vm = this;
      vm.sdk.get("GetDeviceUpgradeState", null, (res) => {
        vm.DeviceUpgradeState = res

        if(res.State==G.FOTA_DOWNLOAD_STATE_DOWNLOADING){
          setTimeout(function () {
              vm.GetDeviceUpgradeState(IsInit)
            }, 3000)
        }else if(res.State==G.FOTA_DOWNLOAD_STATE_FREE&&IsInit){
          vm.GetDeviceNewVersions(IsInit)
        }
        //G.FOTA_DOWNLOAD_STATE_COMPLETED
      })
    },

    GetDeviceNewVersions(IsInit) {
      let vm = this;
      vm.sdk.get("GetDeviceNewVersion", null, (res) => {
        vm.DeviceNewVersionInfo = res;
        switch (res.State) {
          case G.VERSION_CHECKING:
            setTimeout(function () {
              vm.GetDeviceNewVersions(IsInit)
            }, 3000)
            break;
          case G.VERSION_NO_CONNECT:
          case G.VERSION_NO_SERVICE:
            if (vm.page.IsAutoCheck&&IsInit) {
              setTimeout(function () {
                vm.SetCheckNewVersion()
              }, 3000)
            }
            break;
          default:
        }

      })
    },

    //触发检查版本
    SetCheckNewVersion() {
      let vm = this
      vm.sdk.set("SetCheckNewVersion", null, (res) => {
        vm.GetDeviceNewVersions(false)
      })
    },
    //触发下载
    SetFOTAStartDownload() {
      let vm = this;
      vm.sdk.set("SetFOTAStartDownload", null, (res) => {
        //查询下载状态
        vm.GetDeviceUpgradeState(false)
      })
    },
    //停止下载
    SetDeviceUpdateStop() {
      let vm = this;
      vm.sdk.set("SetDeviceUpdateStop", null, (res) => {
        
      })
    },

    //开始升级
    SetDeviceStartUpdate() {
      let vm = this;
      vm.sdk.set("SetDeviceStartUpdate", null, (res) => {
        //弹框提示正在升级
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

