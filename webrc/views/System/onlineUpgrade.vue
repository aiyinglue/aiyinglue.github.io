<template lang="jade">
  include ../components.jade
  #onlineUpgrade
    +sideMenuPage('System')
      +breadcrumb("ids_onlineUpgrade_Online")
      sim-state(v-show="page.Status!=2&&vuex.SimInfo.SIMState!='noSim'||(page.Status!=2&&vuex.SimInfo.SIMState!='ready')")
      +form("formData")
        div(v-show="vuex.SimInfo.SIMState=='ready'||page.Status==2")
          div(v-show="(page.actionTypeCheck==1&&!pageItem.autoUpgradeMode)||(vuex.DeviceNewVersion.State!=1&&page.actionTypeCheck==1)")
            p
              span.title {{vuex.res.ids_onlineUpgrade_currentVersion}} :
              span {{page.SwVersion}}
            +formItem("")
              +button("ids_onlineUpgrade_checkBtn")(v-show="!pageItem.autoUpgradeMode" type="primary" @click="startCheckUpdate")
              +button("ids_onlineUpgrade_btnUpdate")(disabled v-show="pageItem.autoUpgradeMode" type="primary" @click="")
          div(v-show="page.actionTypeChecking==1")
            p
              span(v-loading.body="page.loading") 
              span {{vuex.res.ids_onlineUpgrade_checking}}
            +formItem("")
              +button("ids_onlineUpgrade_checkBtn")(disabled type="primary" @click="")
          div(v-show="pageItem.autoUpgradeMode&&vuex.DeviceNewVersion.State==1")
            p
              span.title {{vuex.res.ids_onlineUpgrade_newVersionAvailable}}
              span {{vuex.res.ids_onlineUpgrade_version}}: {{vuex.DeviceNewVersion.Version}}&nbsp;&nbsp; {{vuex.res.ids_onlineUpgrade_Size}}: {{vuex.DeviceNewVersion.total_size | byTes}}.
            +formItem("")
              +button("ids_onlineUpgrade_btnUpdate")(type="primary" @click="setFOTAStartDownload")
          el-dialog(:title="vuex.res.ids_onlineUpgrade_title" v-model="page.newVersionType",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false")
            p.newVersionAvailable
              span {{vuex.res.ids_onlineUpgrade_newVersionAvailable}}<br/>{{vuex.res.ids_onlineUpgrade_version}}: {{page.Version}}<br/>{{vuex.res.ids_onlineUpgrade_Size}}: {{page.total_size | byTes}}.
            +formItem("")
              +button("ids_onlineUpgrade_btnUpdate")(type="primary" @click="setFOTAStartDownload")
              +button("ids_cancel")(type="primary" @click="reset")
          el-dialog(v-model="page.actionTypeDownloading",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false")
            el-progress(:text-inside="true",:stroke-width="24",:percentage="page.fotaProcess")
            p(v-show="page.fotaProcess<100") {{vuex.res.ids_onlineUpgrade_downloading}}
            p(v-show="page.fotaProcess==100") {{vuex.res.ids_onlineUpgrade_downloadcomplete}}
            +formItem("")
              +button("ids_cancel")(type="primary" @click="stopDownloadFOTA")
          el-dialog(v-model="page.actionTypeDownloaded",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false")
            p {{vuex.res.ids_onlineUpgrade_updateConfirm}}
            +formItem("")
              +button("ids_onlineUpgrade_btnUpdate")(type="primary" @click="startUpdateFOTA",:disabled="page.isStartUpdate")
          el-dialog(:title="vuex.res.ids_onlineUpgrade_Updating" v-model="page.actionTypeUpgrading",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false",:show-close="false")
            p {{vuex.res.ids_onlineUpgrade_upgradingWarning}}
          el-dialog(v-model="page.newVersionTypeNo",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false")
            p {{vuex.res.ids_onlineUpgrade_noNewSoft}}
            +formItem("")
              +button("ids_onlineUpgrade_btnFinish")(type="primary" @click="reset")
          p.tips {{vuex.res.ids_note}}:<br />{{vuex.res.ids_onlineUpgrade_upgradingWarning}}      
</template>
<script>
import {$,vuex,G,_,_config} from '../../common.js';
let pageConfig = _config.pageConfig;
let Config=_config.onlineUpgrade;
export default {
  created() {
      let vm= this;
      vm.init()
      if (vm.pageItem.autoUpgradeMode) {
        vuex.DeviceNewVersion
      }
    },
    methods: {
      init() {
        this.vuex = vuex
        this.initdata(Config);
        vuex.initSimInfo()
        this.page = {
          fotaStatus: "",
          fotaProcess: 0,
          actionTypeCheck: 1,
          actionTypeChecking: 0,
          connectionState: 0,
          Status:0,
          deviceNewVersionState: "",
          Version:"",
          SwVersion:"",
          total_size:"",
          actionTypeUpgrading: false,
          actionTypeDownloading: false,
          actionTypeDownloaded: false,
          newVersionType: false,
          newVersionTypeNo: false,
          loading:false,
          deviceNewVersion:"",
          t: null,
          isStartUpdate:false
        }
        this.sdk.get("GetConnectionState", null, (res) => {
          this.page.connectionState = res.ConnectionStatus;
        });
        this.sdk.get("GetWanSettings", null, (res) => {
          this.page.Status = res.Status;
        });
        this.sdk.get("GetSystemInfo", null, (res) => {
          this.page.SwVersion=res.SwVersion;
        });
      },
      GetDeviceNewVersions() {
        let vm = this;
        this.sdk.get("GetDeviceNewVersion", null, (res) => {
          vm.page.deviceNewVersionState = res.State;
          vm.page.Version=res.Version;
          vm.page.total_size=res.total_size;
          switch (vm.page.deviceNewVersionState) {

            case G.VERSION_CHECKING:
              vm.page.actionTypeChecking = 1;
              vm.page.loading=true;
              vm.page.actionTypeCheck = 0;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              setTimeout(function() {
                vm.GetDeviceNewVersions();
              }, 2000)
              break;
            case G.VERSION_NEW_YES:
              vm.page.actionTypeChecking = 0;
              vm.page.loading=false;
              vm.page.actionTypeCheck = 1;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = true;
              break;
            case G.VERSION_NEW_NO:
              vm.page.actionTypeChecking = 0;
              vm.page.loading=false;
              vm.page.actionTypeCheck = 0;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = true;
              vm.page.newVersionType = false;
              break;
            case G.VERSION_NO_CONNECT:
              vm.page.actionTypeChecking = 0;
              vm.page.loading=false;
              vm.page.actionTypeCheck = 0;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              this.$alert(vuex.res['ids_onlineUpgrade_InternetDisabledMsg'],  vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
              break;
            case G.VERSION_NO_SERVICE:
              vm.page.actionTypeChecking = 0;
              vm.page.loading=false;
              vm.page.actionTypeCheck = 0;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              this.$alert(vuex.res['ids_onlineUpgrade_noservice'],  vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  this.reset();
                }
              });
              break;
            default:
              vm.page.actionTypeChecking = 0;
              vm.page.loading=false;
              vm.page.actionTypeCheck = 0;
              vm.page.actionTypeDownloading = false;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              this.$alert(vuex.res['ids_onlineUpgrade_checkFail'],  vuex.res['ids_confirm'], {
                confirmButtonText:vuex.res['ids_ok'],
                callback: action => {
                  this.reset();
                }
              });
          }
        })
      },
      showFOTADownloadProcess() {
        this.startCheckUpdate();
      },
      startCheckUpdate() {
        let vm = this
        
        this.sdk.get("GetDeviceUpgradeState", null, (res) => {
          vm.formData = res;
          vm.page.fotaStatus = vm.formData.Status;
          if (vm.page.fotaStatus == G.FOTA_DOWNLOAD_STATE_COMPLETED) {
            vm.page.actionTypeDownloaded = true;
            vm.page.actionTypeChecking = 0;
            vm.page.loading=false;
            vm.page.actionTypeCheck = 1;
            vm.page.actionTypeDownloading = false;
            vm.page.newVersionTypeNo = false;
            vm.page.newVersionType = false;
          }
          if (vm.page.fotaStatus == G.FOTA_DOWNLOAD_STATE_DOWNLOADING) {
            vm.page.actionTypeDownloading = true;
            vm.page.loading=false;
            vm.page.actionTypeChecking = 0;
            vm.page.actionTypeCheck = 1;
            vm.page.actionTypeDownloaded = false;
            vm.page.newVersionTypeNo = false;
            vm.page.newVersionType = false;
            vm.page.fotaProcess = vm.formData.Process;
            if(pageConfig.IsSupportTimeOutLogout){
              vuex.listenLogout(_config.login.pageItem.stopListenLogoutTime);
            }
            vm.page.t=setTimeout(function() {
              vm.showFOTADownloadProcess();
            }, 2000)

          }
          if (vm.page.fotaStatus == G.FOTA_DOWNLOAD_STATE_FREE) {
            if (vm.page.connectionState == G.WAN_STATE_CONNECTED||vm.page.Status == G.WAN_PORT_STATUS_CONNECTED) {
              this.sdk.post("SetCheckNewVersion", null, {
                success: {
                  tips: "None",
                  callback: vm.GetDeviceNewVersions
                },
                fail: {
                  tips: "None",
                  callback() {
                    vm.$alert(vuex.res['ids_onlineUpgrade_checkFail'],  vuex.res['ids_confirm'], {
                      confirmButtonText: vuex.res['ids_ok'],
                      callback: action => {
                        vm.reset();
                      }
                    });
                  }
                }
              })
            }
            else {
              this.$alert(vuex.res['ids_onlineUpgrade_InternetDisabledMsg'],  vuex.res['ids_confirm'], {
                confirmButtonText:vuex.res['ids_ok'],
                callback: action => {
                  this.reset();
                }
              });
            }
          }
        })
      },
      setFOTAStartDownload() {
        let vm = this;
        this.sdk.post("SetFOTAStartDownload", null, {
          success: {
            tips: "None",
            callback() {
              vm.page.actionTypeDownloading = true;
              vm.page.loading=false;
              vm.page.actionTypeChecking = 0;
              vm.page.actionTypeCheck = 1;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              vm.startCheckUpdate()
            }
          },
          fail: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_onlineUpgrade_downloadFail'],  vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
            }
          }
        })
      },
      startUpdateFOTA() {
        let vm = this;
        vm.page.isStartUpdate = true
        this.sdk.post("SetDeviceStartUpdate", null, {
          success: {
            tips: "None",
            callback() {
              vm.page.actionTypeUpgrading = true;
              vm.page.loading=false;
              vm.page.actionTypeChecking = 0;
              vm.page.actionTypeCheck = 1;
              vm.page.actionTypeDownloaded = false;
              vm.page.newVersionTypeNo = false;
              vm.page.newVersionType = false;
              setTimeout(function() {
                window.location.reload();
              }, 300000)
            }
          },
          fail: {
            tips: "None",
            callback() {
              vm.page.isStartUpdate = false;
              vm.$alert(vuex.res['ids_onlineUpgrade_updateFail'],  vuex.res['ids_confirm'],{
                confirmButtonText:  vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
            }
          }
        })
      },
      stopDownloadFOTA() {
        let vm = this;
        this.sdk.post("SetDeviceUpdateStop", null, {
          success: {
            tips: "None",
            callback() {
              if(pageConfig.IsSupportTimeOutLogout){
                vuex.listenLogout(_config.login.pageItem.listenLogoutTime)
              }
              if (!vm.pageItem.autoUpgradeMode) {
                //vm.startCheckUpdate();
                vm.page.actionTypeCheck==1;
                vm.page.actionTypeDownloading=false;
                clearTimeout(vm.page.t);
                vm.page.t = null;
              }else{
                vm.page.actionTypeDownloading=false;
                clearTimeout(vm.page.t);
                vm.page.t = null;
              }
            }
          },
          fail: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_error'],  vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
            }
          }
        })
      }
    }
}
</script>

<style lang="sass" scoped>
p {
  font-size: 14px;
}
.newVersionAvailable{
  margin-left: 40px;
}
span {
  line-height: 24px;
  font-size: 14px;
  margin-top: 60px;
}

.title {
  font-weight: 700;
  margin-right: 10px;
}

</style>

