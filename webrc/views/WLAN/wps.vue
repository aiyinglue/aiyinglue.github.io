<template lang="jade">
  include ../components.jade
  #wps
    +sideMenuPage('Settings')
      +breadcrumb("ids_wps_title_wps")
      +form("formData")
        form(@keyup.enter="update" @submit.prevent)
          +radio("ids_wps_wpsMode:","wpsMode")
          div(v-if="formData.wpsMode==0")
            +input("ids_wps_wpsPin:","WpsPin")        
          +formBtn()
          p.tips(v-if="formData.wpsMode==0")        
            | {{vuex.res.ids_note}}:<br/>         
            | {{vuex.res.ids_wps_enableWpsPinStep1}}<br/>        
            | {{vuex.res.ids_wps_enableWpsPinStep2}}<br/>        
            | {{vuex.res.ids_wps_enableWpsPinStep3}}
          p.tips(v-if="formData.wpsMode==1") 
            | {{vuex.res.ids_note}}:<br/>        
            | {{vuex.res.ids_wps_enablePbcStep1}}<br/>        
            | {{vuex.res.ids_wps_enablePbcStep2}}<br/>        
            | {{vuex.res.ids_wps_enablePbcStep3}}
</template>
<script>
import {_,_config,$,vuex,G} from '../../common.js';
let Config = _config.wps
export default {
  created() {
      this.init();      
      this.initdata(Config);
    },
    methods: {
      init() {        
        this.vuex = vuex;
        this.pageConfig=_config.pageConfig;
        this.page = {
          WlanInfo:{},
          filter_policy: 0
        }
        this.formData.wpsMode = 0;
        this.sdk.get("GetWlanSettings",null,(res)=>{
          $.extend(this.page.WlanInfo, res);
        });
        this.sdk.get("GetMacFilterSettings", null, (res) => {
          this.page.filter_policy = res.filter_policy;
        }) 
      },
      update() {
        let vm = this;
        let results = {
          callback: this.init,
          success: {
            tips: "Message",
            msg: this.vuex.res.ids_success,
            callback() {
              this.init;
            }
          },
          fail: this.vuex.res.ids_fail,
          e2: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_wps_notSuppotWepWpa'], vuex.res['ids_error'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  this.init;
                }
              });
            }
          },
          e3: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_wps_wpsActive'], vuex.res['ids_error'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  this.init;
                }
              });
            }
          }
        };
        if(vm.checkValidate() == false){
            return;
          } 
        if (this.formData.wpsMode == 0) {
          let params = {
            "WpsPin": this.formData.WpsPin
          }
          let setForm = () => {
            this.sdk.post("SetWPSPin", params, results);
          }
          this.submit("formData", setForm)
          
        }
        if (this.formData.wpsMode == 1) {
          this.sdk.post("SetWPSPbc", null, results);
        }
      },
      checkValidate() {
        let vm = this;
        let isSsidHidden = false;
        let WlanInfo = vm.page.WlanInfo;
        //not support wps when wlan off both 2.4G and 5G
        if(vuex.SystemStatus.WlanState == 0){
          vm.$alert(vuex.res['ids_wps_wlanOff'], vuex.res['ids_error']);
          return false;
        }

        //not support wps when ssid hidden both 2.4G and 5G
        if(vm.pageConfig.IsSupportWiFi5G){
            if(!((WlanInfo.AP2G.ApStatus == 1 && WlanInfo.AP2G.SsidHidden == 0) || (WlanInfo.AP5G.ApStatus == 1 && WlanInfo.AP5G.SsidHidden == 0))){
            isSsidHidden = true;  
            vm.$alert(vuex.res['ids_wps_notSuppotSSIDHidden'], vuex.res['ids_error']);
            isSsidHidden = true;  
          }
        }else{
          if(WlanInfo.AP2G.SsidHidden == 1){              
            isSsidHidden = true;  
            vm.$alert(vuex.res['ids_wps_notSuppotSSIDHidden'], vuex.res['ids_error']);
          }
        }
        
        if(isSsidHidden){
          return false;
        }

        //not support wps under mac filter allow status 
        if(vm.page.filter_policy == 1){
          vm.$alert(vuex.res['ids_wps_notSuppotMacFilter'], vuex.res['ids_error']);
          return false;
        }
        return true;
      }
    }
}
</script>

<style lang="sass" scoped>
</style>