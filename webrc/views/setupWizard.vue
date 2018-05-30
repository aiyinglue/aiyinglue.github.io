<template lang="jade">
  include ./components.jade
  #setupWizard
    +sideMenuPage('Home')
      +breadcrumb("ids_setupWizard")
      div(style="width: 100%" v-loading.body="page.loading")
        el-steps.margin-auto(:space="250",:active.number="page.setp_status")
          el-step(:title="vuex.res.ids_quicksetup_simTitle")
          el-step(:title="vuex.res.ids_wifi_WiFiTitle")
          el-step(:title="vuex.res.ids_quicksetup_wlanSecurity")
        +form("formData")(ref="form1" v-show="page.setp_status==1")
          sim-state
            div(v-formLabelIcon="pageItem.NetworkModeHelp")
              +select("ids_netwrok_netMode:","NetworkMode")
              span(class='iconfont icon-help' v-popover:popover1)
                  el-popover(ref="popover1" placement="bottom" width="200" trigger="click")
                    div {{vuex.res.ids_network_NetworkModeTips}}
            div(v-formLabelIcon="pageItem.ConnectModeHelp")           
              +radio("ids_netwrok_connectionMode:","ConnectMode")
              span(class='iconfont icon-help' v-popover:popover2)
                el-popover(ref="popover2" placement="bottom" width="200" trigger="click")
                  div {{vuex.res.ids_network_ConnectionModeTips}}            
            div(v-show="pageConfig.displayDataRoamingSwitch") 
              div(v-if="formData.ConnectMode==1")
                +formItem("ids_network_dataRoaming:")
                  el-switch(v-model="page.roamingConnect" on-text="" off-text="")
            +formItem("ids_profile_name:")
              el-select(v-model.mumber="formData.currentProfileId")
                el-option(v-for="val in page.profileList",:label="val.Default==1?val.ProfileName+' '+'('+vuex.res.ids_profile_default+')':val.ProfileName",:value.number="val.ProfileID")
            div.center
              +button("ids_next")(@click="next" type="primary" v-show="page.setp_status!=3")
          div.center(v-if="vuex.SimInfo.SIMState=='noSim'||vuex.SimInfo.SIMState=='invalid'")
            +button("ids_next")(@click="next" type="primary" v-show="page.setp_status!=3")

        +form("formData")(ref="form2" v-show="page.setp_status==2")
          div(v-if="pageConfig.IsSupportWiFi5G") {{vuex.res.ids_wlan_2ghz}}
          +switch("ids_wlan_wlan2g","page.AP2GApStatus")(@change="disable2ghz")
          div(v-if="formData.AP2G.ApStatus!=0")
            +input("ids_wifi_ssid:","AP2G.Ssid")(:maxlength="32")
            div(v-if="pageItem.Supportcountryregion")
              +formItem("ids_wlan_countryRegion")
                el-select(v-model="formData.AP2G.CountryCode")
                  el-option(v-if="!pageConfig.supportCountryCodeTranslation",:label="countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList")
                  el-option(v-if="pageConfig.supportCountryCodeTranslation",:label="vuex.res['ids_wlan_country_'+cID]||countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList")
            +switch("ids_wlan_ssidBroadcast","page.AP2GSsidHidden")(@change="disable24gSSIDbroadcast")
          div(v-if="pageConfig.IsSupportWiFi5G")
            div {{vuex.res.ids_wlan_5ghz}}
            +switch("ids_wlan_wlan5g","page.AP5GApStatus")(@change="disable5ghz")
            div(v-if="formData.AP5G.ApStatus!=0")
              +input("ids_wifi_ssid:","AP5G.Ssid")(:maxlength="32")
              div(v-if="pageItem.Supportcountryregion")
                +formItem("ids_wlan_countryRegion")
                  el-select(v-model="formData.AP5G.CountryCode")
                    el-option(v-if="!pageConfig.supportCountryCodeTranslation",:label="countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList")
                    el-option(v-if="pageConfig.supportCountryCodeTranslation",:label="vuex.res['ids_wlan_country_'+cID]||countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList")
              +switch("ids_wlan_ssidBroadcast","page.AP5GSsidHidden")(@change="disable5gSSIDbroadcast")
          div.center
            +button("ids_back")(@click="prev" type="primary" v-show="page.setp_status!=0")
            +button("ids_next")(@click="next" type="primary" v-show="page.setp_status!=3")
        +form("formData")(ref="form3" v-show="page.setp_status==3")
          div(v-if="pageConfig.IsSupportWiFi5G") {{vuex.res.ids_wlan_2ghz}}
          div(v-if="formData.AP2G.ApStatus==0") {{vuex.res.ids_wlan_disabled}}
          div(v-if="formData.AP2G.ApStatus!=0")
            +select("ids_wlan_security:","AP2G.SecurityMode")
            div(v-show="formData.AP2G.SecurityMode==1" v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP2G.WepType")
            div(v-show="formData.AP2G.SecurityMode==2||formData.AP2G.SecurityMode==3||formData.AP2G.SecurityMode==4"  v-if="page.SupporWifiCertificationHide")
              +select("ids_wlan_encryption:","AP2G.WpaType")
            div(v-if="formData.AP2G.SecurityMode==1")
              +input("ids_wlan_wlanPassword:","AP2G.WepKey")(:type="formData.show2GPassword==1?'text':'password'")
            div(v-if="formData.AP2G.SecurityMode==2||formData.AP2G.SecurityMode==3||formData.AP2G.SecurityMode==4")
              +input("ids_wlan_wlanPassword:","AP2G.WpaKey")(:type="formData.show2GPassword==1?'text':'password'")
            div(v-show="formData.AP2G.SecurityMode!=0")
              +checkbox("","show2GPassword","ids_wlan_showPw")
          div(v-if="pageConfig.IsSupportWiFi5G")
            div {{vuex.res.ids_wlan_5ghz}}
            div(v-if="formData.AP5G.ApStatus==0") {{vuex.res.ids_wlan_disabled}}
            div(v-if="formData.AP5G.ApStatus!=0")
              +select("ids_wlan_security:","AP5G.SecurityMode")
              div(v-show="formData.AP5G.SecurityMode==1"  v-if="page.SupporWifiCertificationHide")
                +select("ids_wlan_encryption:","AP5G.WepType")
              div(v-show="formData.AP5G.SecurityMode==2||formData.AP5G.SecurityMode==3||formData.AP5G.SecurityMode==4"  v-if="page.SupporWifiCertificationHide")
                +select("ids_wlan_encryption:","AP5G.WpaType")
              div(v-if="formData.AP5G.SecurityMode==1")
                +input("ids_wlan_wlanPassword:","AP5G.WepKey")(:type="formData.show5GPassword==1?'text':'password'")
              div(v-if="formData.AP5G.SecurityMode==2||formData.AP5G.SecurityMode==3||formData.AP5G.SecurityMode==4")
                +input("ids_wlan_wlanPassword:","AP5G.WpaKey")(:type="formData.show5GPassword==1?'text':'password'")
              div(v-show="formData.AP5G.SecurityMode!=0")
                +checkbox("","show5GPassword","ids_wlan_showPw")
          div.center
            +button("ids_back")(@click="prev" type="primary" v-show="page.setp_status!=0")
            +button("ids_quicksetup_done")(@click="next" type="primary" v-show="page.setp_status==3")

      
</template>

<script>
import {
  $,
  _,
  _config,
  vuex,
  countryCodeALL
} from '../common.js'
let Config = _config.setupWizard;
_.extend(Config.formData, _config.mobileConnection.formData, _config.networkSettings.formData, _config.Wlan.formData);
_.extend(Config.formOptions, _config.mobileConnection.formOptions, _config.networkSettings.formOptions, _config.Wlan.formOptions);
_.extend(Config.formRules, _config.networkSettings.formRules, _config.Wlan.formRules);
_.extend(Config.pageItem,_config.mobileConnection.pageItem, _config.networkSettings.pageItem, _config.Wlan.pageItem);
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.initdata(Config);
        this.vuex = vuex;
        this.pageConfig = _config.pageConfig;
        this.countryCodeALL = countryCodeALL;
        this.page = {
          setp_status: 1,
          connectionSettings: {},
          profileList: [],
          networkSettings: {},
          wlanSettings: {},
          setResult: {},
          loading: false,
          SupporWifiCertificationHide: true,
          AP2GApStatus: false,
          AP5GApStatus: false,
          AP2GSsidHidden: false,
          AP5GSsidHidden: false,
          roamingConnect: true
        }
        this.sdk.get("GetNetworkSettings", null, (res) => {
          this.page.networkSettings = res;
          this.formData.NetworkMode = res.NetworkMode
        })
        this.sdk.get("GetConnectionSettings", null, (res) => {
          this.page.connectionSettings = res;
          this.$set(this.formData, "ConnectMode", res.ConnectMode)
          this.formData.RoamingConnect = res.RoamingConnect;
          this.page.roamingConnect = this.formData.RoamingConnect == 1 ? true : false;
        })
        this.sdk.get("GetProfileList", null, (res) => {
          this.page.profileList = res.ProfileList;
          let defaultProfile = $.grep(res.ProfileList, function(n, i) {
            return n.Default === 1;
          })[0];
          if (defaultProfile != undefined) {
            this.formData.currentProfileId = defaultProfile.ProfileID;
          } else {
            this.formData.currentProfileId = "";
          }
        })
        this.sdk.get("GetWlanSettings", null, (res) => {
          this.page.wlanSettings = res;
          $.extend(this.formData, res)
          this.page.AP2GApStatus = res.AP2G.ApStatus == 1 ? true : false
          this.page.AP5GApStatus = res.AP5G.ApStatus == 1 ? true : false
          this.page.AP2GSsidHidden = res.AP2G.SsidHidden == 0 ? true : false
          this.page.AP5GSsidHidden = res.AP5G.SsidHidden == 0 ? true : false
        })
        if (Config.pageItem.SupporWifiCertification) {
          this.page.SupporWifiCertificationHide = false;
        }
      },
      update() {
        let vm = this;
        vm.page.loading = true;
        if (Config.pageItem.SupporWifiCertification) {
          if (vm.formData.AP2G.SecurityMode == 3) {
            vm.formData.AP2G.WpaType = 1;
          } else if (vm.formData.AP2G.SecurityMode == 4) {
            vm.formData.AP2G.WpaType = 2;
          }
          if (vm.formData.AP5G.SecurityMode == 3) {
            vm.formData.AP5G.WpaType = 1;
          } else if (vm.formData.AP5G.SecurityMode == 4) {
            vm.formData.AP5G.WpaType = 2;
          }
        }

        
        
        let SetNetworkSettings = () => {
          vm.page.networkSettings.NetworkMode = vm.formData.NetworkMode;
          vm.sdk.post("SetNetworkSettings", vm.page.networkSettings, {
            success: {
              tips: "None",
              callback() {
                vm.page.setResult.SetNetworkSettings = true
                SetConnectionSettings()
              }
            },
            fail: {
              tips: "None",
              callback() {
                vm.page.setResult.SetNetworkSettings = false
                SetConnectionSettings()
              }
            }
          })
        }
        let SetConnectionSettings = () => {
          vm.page.connectionSettings.ConnectMode = vm.formData.ConnectMode;
          vm.formData.RoamingConnect = vm.page.roamingConnect == true ? 1 : 0;
          vm.page.connectionSettings.RoamingConnect = vm.formData.RoamingConnect;
          vm.sdk.post("SetConnectionSettings", vm.page.connectionSettings, {
            success: {
              tips: "None",
              callback() {
                vm.page.setResult.SetConnectionSettings = true
                SetDefaultProfile()
              }
            },
            fail: {
              tips: "None",
              callback() {
                vm.page.setResult.SetConnectionSettings = false
                SetDefaultProfile()
              }
            }
          })
        }
        let SetDefaultProfile = () => {
          let params = {
            ProfileID: vm.formData.currentProfileId
          }
          vm.sdk.post("SetDefaultProfile", params, {
            success: {
              tips: "None",
              callback() {
                vm.page.setResult.SetDefaultProfile = true
                SetWlanSettings()
              }
            },
            fail: {
              tips: "None",
              callback() {
                vm.page.setResult.SetDefaultProfile = false
                SetWlanSettings()
              }
            }
          })
        }

        let SetWlanSettings = () => {
          vm.page.wlanSettings.AP2G = vm.formData.AP2G;
          vm.page.wlanSettings.AP5G = vm.formData.AP5G;
          if(vuex.SystemStatus.WlanState == 2){
            vm.page.loading = false;
            vm.$alert(vuex.res['ids_wps_wpsActive'], vuex.res['ids_error'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {
              }
            });
            return false;
          }
          vm.sdk.post("SetWlanSettings", vm.page.wlanSettings, {
            success: {
              tips: "None",
              callback() {
                vm.page.setResult.SetDefaultProfile = true;
                vm.page.loading = false;
                let result = _.find(vm.page.setResult, (v) => {
                  return v == false
                })
                if (result == undefined) {
                  vm.$message({
                    message: vuex.res['ids_success'],
                    type: 'success'
                  });
                  vm.init();
                } else {
                  vm.$message({
                    message: vuex.res['ids_fail'],
                    type: 'error'
                  });
                }
              }
            },
            fail: {
              tips: "None",
              callback() {
                vm.page.loading = false;
                vm.$message({
                  message: vuex.res['ids_fail'],
                  type: 'error'
                });
              }
            }
          })
        }
        SetNetworkSettings()
      },
      prev() {
        if (this.page.setp_status-- <= 1) {
          this.page.setp_status = 1;
        }
      },
      next() {
        let IsNeedValidate = this.pageConfig.IsSupportWiFi5G&&this.formData.AP5G.ApStatus==1;
        switch(this.page.setp_status){
          case 2:
            if(this.formData.AP2G.ApStatus==1||IsNeedValidate){
              this.$refs['form2'].validate((valid) => {
                if (valid) {
                  this.page.setp_status++
                } else {
                  return false;
                }
              })
            }else{
              this.page.setp_status++
            }
            break;
          case 3:
            if((this.formData.AP2G.ApStatus==1&&this.formData.AP2G.SecurityMode!=0)||(IsNeedValidate&&this.formData.AP5G.SecurityMode!=0)){
              this.$refs['form3'].validate((valid) => {
                if (valid) {
                  this.page.setp_status++
                  this.update()
                } else {
                  return false;
                }
              })
            }else{
              this.page.setp_status++
              this.update()
            }
            break;
          default:
            this.page.setp_status++
        }

        if (this.page.setp_status > 3) {
          this.page.setp_status = 3;
        }
      },
      disable2ghz() {
        this.formData.AP2G.ApStatus = this.page.AP2GApStatus ? 1 : 0;
        if (this.pageItem.Disable2g5gwarning && this.formData.AP2G.ApStatus == 0) {
          this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable5ghz() {
        this.formData.AP5G.ApStatus = this.page.AP5GApStatus ? 1 : 0;
        if (this.pageItem.Disable2g5gwarning && this.formData.AP5G.ApStatus == 0) {
          this.$alert(vuex.res['ids_wlan_24gDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable24gSSIDbroadcast() {
        this.formData.AP2G.SsidHidden = this.page.AP2GSsidHidden ? 0 : 1;
        if (this.pageItem.DisableSSIDbroadcastwarning && this.formData.AP2G.SsidHidden == 1) {
          this.$alert(vuex.res['ids_wlan_ssidDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      },
      disable5gSSIDbroadcast() {
        this.formData.AP5G.SsidHidden = this.page.AP5GSsidHidden ? 0 : 1;
        if (this.pageItem.DisableSSIDbroadcastwarning && this.formData.AP5G.SsidHidden == 1) {
          this.$alert(vuex.res['ids_wlan_ssidDisabletips'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              //vm.reset();
            }
          })
        }
      }
    }
}
</script>

<style lang="sass" scoped>
</style>