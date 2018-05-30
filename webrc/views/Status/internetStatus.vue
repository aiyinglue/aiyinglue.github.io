<template lang="jade">
  include ../components.jade
  #internetStatus
    +sideMenuPage('Home')
      +breadcrumb("ids_internet")
      +form("formData")
        div.internetInfo
          +text("ids_internetStatus_simCardStatus:","{{vuex.SimInfo.SIMStateStr|res}}")
            span(v-show="vuex.SimInfo.SIMState=='pinReq'")
              router-link.el-button.el-button--primary.el-button--small(:to="{name: 'pinManagement', params: {callbackRoute: vuex.currentRouter}}") {{vuex.res.ids_internetStatus_enterPin}}
            span(v-show="vuex.SimInfo.SIMState=='pukReq'")
              router-link.el-button.el-button--primary.el-button--small(:to="{name: 'pinManagement', params: {callbackRoute: vuex.currentRouter}}") {{vuex.res.ids_sim_enterPuk}}
            span(v-show="vuex.SimInfo.SIMState=='simLock'")
              router-link.el-button.el-button--primary.el-button--small(:to="{name: 'pinManagement', params: {callbackRoute: vuex.currentRouter}}") {{vuex.res.ids_sim_enterSimLockCode}}
          +text("ids_internetStatus_conStatus:","{{vuex.SystemStatus.ConnectionStatus|netConnState}}","")
            span.f_r(v-if="vuex.SimInfo.SIMState=='ready'&&(vuex.SystemStatus.ConnectionStatus==0||vuex.SystemStatus.ConnectionStatus==2)")
              +button("{{vuex.res[vuex.SystemStatus.ConnectionStatus==0?'ids_connect':'ids_disconnect']}}")(type="primary" size="small" @click="connectOrDisconnectNet")
          +text("ids_netwrok_networkName:","{{vuex.SystemStatus.NetworkName | networkName}}")
          +text("ids_netwrok_networkType:","{{vuex.SystemStatus.NetworkType|networkType}}","")
          +text("ids_profile_name:","{{page.currentProfile}}","")(v-if="!pageItem.changeProfileName")
          +formItem("ids_profile_name:")(v-if="pageItem.changeProfileName")
            el-select(v-model.mumber="page.currentProfileId" @change="changeProfileNameEvent()",:disabled="vuex.SystemStatus.ConnectionStatus==0?false:true" @visible-change="page.saveProfileName = true")
              el-option(v-for="val in profileList",:label="val.Default==1?val.ProfileName+' '+'('+vuex.res.ids_profile_default+')':val.ProfileName",:value.number="val.ProfileID")
          div(v-if="!(pageItem.hideEmptyIP && page.ConnectionState.IPv4Adrress == '0.0.0.0')")
            +text("ids_internetStatus_ipv4Address:","{{page.ConnectionState.IPv4Adrress}}","")
          div(v-if="!(pageItem.hideEmptyIP && page.ConnectionState.IPv6Adrress == '0::0')")
            +text("ids_internetStatus_ipv6Address:","{{page.ConnectionState.IPv6Adrress}}","")
          div(v-if="pageItem.supportUSBStatus")
            div(v-if="vuex.SystemStatus.UsbStatus==1")
              +text("ids_internetStatus_usbStatus:","{{vuex.SystemStatus.UsbName}}","") 
            div(v-if="vuex.SystemStatus.UsbStatus!=1")  
              +text("ids_internetStatus_usbStatus:","{{vuex.SystemStatus.UsbStatus|usbStateText}}","") 
          div(v-if="pageItem.supportDeviceUptime")
            +text("ids_internetStatus_Deviceuptime:","{{vuex.SystemStatus.DeviceUptime | times('2')}}","")     
      //-+formBtn()
</template>

<script>
import {$,G,vuex,_,_config} from '../../common.js'
var Config = _config.homeInternetStatus//_config.homeStatus//

export default {
  created () {
    this.init();
    this.initdata(Config);
    this.Inter = setInterval(() => {
        this.IntergetData()
      }, 6000);
  },
  destroyed() {
      clearInterval(this.Inter)
      this.Inter = null
    },
  methods: {
    init (){
      this.vuex = vuex;
      this.vuex.initSimInfo();
      this.page={
        currentProfile:"----",
        ConnectionState:{},
        currentProfileId:"",
        saveProfileName: false
      }
      this.profileList = {};
      this.defaultProfile = {};
      this.IntergetData();
    },
    IntergetData(){
      this.sdk.get("GetConnectionState",null,(res)=>{
        this.page.ConnectionState = res;
      });
      this.sdk.get("getCurrentProfile",null,(res)=>{
        if(res){
          this.page.currentProfile = res.ProfileName||"----";
          if(Config.pageItem.changeProfileName){
            this.page.currentProfileId = res.ProfileID
           }
        }
      });
      if(Config.pageItem.changeProfileName){
        this.sdk.get("GetProfileList", null, (res) => {
            this.profileList = res.ProfileList;
            let defaultProfile = $.grep(res.ProfileList, function(n, i) {
              return n.Default === 1;
            })[0];
            this.formData = $.extend({}, defaultProfile);
            this.defaultProfile = $.extend({}, defaultProfile);
            /*if (defaultProfile != undefined) {
              this.page.currentProfileId = defaultProfile.ProfileID;
            } else {
              this.page.currentProfileId = "";
            }*/
          });
      }
    },
    connectOrDisconnectNet (){
      let vm = this;
      let result={
        callback(){
          vm.vuex.refreshSystemStatus();
        }
      }
      if(this.vuex.SystemStatus.ConnectionStatus == G.WAN_STATE_CONNECTED){
        this.sdk.post("DisConnect",{},result);
      }else if(this.vuex.SystemStatus.ConnectionStatus == G.WAN_STATE_DISCONNECTED){
        if(Config.pageItem.monthlyPlanRunOutDialTips){
            vm.monthlyPlanRunOutDialEvnet(result)
        }else{
            this.sdk.post("Connect",{},result);
        }
      }
    },
    monthlyPlanRunOutDialEvnet(result) {
        let vm = this;
        this.sdk.get("GetUsageRecord", null, (res) => {
            nextEvent(res.HUseData,res.MonthlyPlan)
        })
        function nextEvent(HUseData,MonthlyPlan){
            vm.sdk.get("GetUsageSettings", null, (res) => {
                if (((MonthlyPlan <= HUseData) && (Number(res.AutoDisconnFlag) == 1 && res.MonthlyPlan !=0)) || ((res.TimeLimitTimes <= res.UsedTimes) && (Number(res.TimeLimitFlag) == 1))) {
                    vm.$alert(vuex.res['ids_internetStatus_UsageUseOverflowTips'], ' ', {
                        confirmButtonText: vuex.res['ids_ok'],
                        callback: action => {
                            //vm.reset();
                        }
                    });
                }else{
                    vm.sdk.post("Connect",{},result);
                }
            })
        }
    },
    changeProfileNameEvent() {
        let vm = this;
        vm.$refs.formData.resetFields()
        let currentProfile = $.grep(vm.profileList, function(n, i) {
          return n.ProfileID === vm.page.currentProfileId;
        })[0];
        vm.formData = $.extend({}, currentProfile);
        if(this.page.saveProfileName){
            vm.saveProfileNameEvent();
        }
    },
    saveProfileNameEvent(){
        let vm = this;
        let params = {
            ProfileID:vm.formData.ProfileID
        }
        let results = {
            callback() {

            }
        }
        this.sdk.post("setCurrentProfile", params, results)
    }
  }
}
</script>

<style lang="sass" scoped>
.el-text{
  width:auto;
}
</style>