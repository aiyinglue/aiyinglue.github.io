<template lang="jade">
  include ../components.jade
  #advance
    +sideMenuPage('Settings')
      +breadcrumb("ids_wlan_advanced")
      +form("formData")(style="width: 100%" v-loading.body="page.loading")
        //- 2.4GHz
        div(v-if="pageConfig.IsSupportWiFi5G||(!pageConfig.IsSupportWiFi5G&&formData.AP2G.ApStatus==0&&formData.AP2G_guest.ApStatus==0)") 
          span {{vuex.res.ids_wlan_2ghz}}
          span(v-if="formData.AP2G.ApStatus==0") {{": "+vuex.res.ids_wlan_disabled}}
        div(v-if="formData.AP2G.ApStatus!=0||(pageConfig.IsSupportWiFiAP2G_guest&&formData.AP2G_guest.ApStatus!=0)")
          div(v-if="pageItem.Supportcountryregion")
            +formItem("ids_wlan_countryRegion")
              el-select(v-model="formData.AP2G.CountryCode" @change="formData.AP2G.Channel=0")
                el-option(:label="countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList" v-if="!pageConfig.supportCountryCodeTranslation")
                el-option(:label="vuex.res['ids_wlan_country_'+cID]||countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList" v-if="pageConfig.supportCountryCodeTranslation")
          +formItem("ids_wlan_channel:")
            el-select(v-model="formData.AP2G.Channel")
              el-option(:label="vuex.res.ids_auto",:value.number="0")
              el-option(v-for="i in countryCodeALL[formData.AP2G.CountryCode][1]",:label="i",:value.number="i")
          +select("ids_wlan_802Mode:","AP2G.WMode")
          +formItem("ids_wlan_apIsolation:")
            el-switch(v-model="page.Ap2GIsolation" on-text="" off-text="") 
          +select("ids_wlan_bandwidth:","AP2G.Bandwidth")

        //- 5GHz
        div(v-if="pageConfig.IsSupportWiFi5G")
          div.category-title 
            | {{vuex.res.ids_wlan_5ghz}}
            span(v-if="formData.AP5G.ApStatus==0") {{": "+vuex.res.ids_wlan_disabled}}
          div(v-if="formData.AP5G.ApStatus!=0")
            div(v-if="pageItem.Supportcountryregion")
              +formItem("ids_wlan_countryRegion")
                el-select(v-model="formData.AP5G.CountryCode" @change="formData.AP5G.Channel=0")
                  el-option(:label="countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList" v-if="!pageConfig.supportCountryCodeTranslation")
                  el-option(:label="vuex.res['ids_wlan_country_'+cID]||countryCodeALL[cID][0]",:value="cID" v-for="cID in pageConfig.defaultCountryCodeList" v-if="pageConfig.supportCountryCodeTranslation")
            +formItem("ids_wlan_channel:")
              el-select(v-model="formData.AP5G.Channel")
                el-option(:label="vuex.res.ids_auto",:value.number="0")
                el-option(v-for="i in countryCodeALL[formData.AP5G.CountryCode][2]",:label="i",:value.number="i")
            +select("ids_wlan_802Mode:","AP5G.WMode")(@change="changeBandwidth")
            +formItem("ids_wlan_apIsolation:")
              el-switch(v-model="page.Ap5GIsolation" on-text="" off-text="") 
            +select("ids_wlan_bandwidth:","AP5G.Bandwidth")
        div(v-if="formData.AP2G.ApStatus==1||(formData.AP5G.ApStatus==1&&pageConfig.IsSupportWiFi5G)||(pageConfig.IsSupportWiFiAP2G_guest&&formData.AP2G_guest.ApStatus==1)")
          +formBtn()
</template>

<script>
import {$,_config,vuex,countryCodeALL} from '../../common.js';
let Config = _config.Wlan;
export default {
  created () {
    this.initdata(Config);
    this.init()
  },
  methods: {
    init (){
      this.vuex=vuex;
      this.pageConfig=_config.pageConfig;
      this.countryCodeALL=countryCodeALL;
      this.page={
        loading:false,
        Ap2GIsolation: false,
        Ap5GIsolation: false
      }
      this.sdk.get("GetWlanSettings",null,(res)=>{
        $.extend(this.formData,res)
        this.page.Ap2GIsolation = this.formData.AP2G.ApIsolation == 1 ? true : false;
        this.page.Ap5GIsolation = this.formData.AP5G.ApIsolation == 1 ? true : false;
        this.changeBandwidth()
      })
    },
    changeBandwidth(){
      if(this.formData.AP5G.WMode==6){
        this.formData.AP5G.Bandwidth = 4;
        this.formOptions.AP5G.Bandwidth=Config.formOptions.AP5G.BandwidthAc
      }else{
        this.formData.AP5G.Bandwidth = 0;
        this.formOptions.AP5G.Bandwidth=Config.formOptions.AP5G.BandwidthAuto
      }
    },
    update (){
      let vm = this
      let setForm = () => {
        if(vm.checkValidate() == false){
          return;
        }         
        this.$confirm(vuex.res['ids_wlan_restartWarn'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_ok'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          this.page.loading = true;
          vm.formData.AP2G.ApIsolation = this.page.Ap2GIsolation == true ? 1 : 0;
          vm.formData.AP5G.ApIsolation = this.page.Ap5GIsolation == true ? 1 : 0;
          if(this.pageConfig.IsSupportWiFiAP2G_guest){
            vm.formData.AP2G_guest.CountryCode = vm.formData.AP2G.CountryCode
            vm.formData.AP2G_guest.Channel = vm.formData.AP2G.Channel
            vm.formData.AP2G_guest.SecurityMode = vm.formData.AP2G.SecurityMode
            vm.formData.AP2G_guest.Bandwidth = vm.formData.AP2G.Bandwidth
            vm.formData.AP2G_guest.ApIsolation = vm.formData.AP2G.ApIsolation
          }

          this.sdk.post("SetWlanSettings", this.formData, {
            callback: this.init
          });
        }).catch(() => {

        }); 
      }
      setForm()   
    },
    checkValidate() {
      let vm = this;
      if(vuex.SystemStatus.WlanState == 2){
        vm.$alert(vuex.res['ids_wps_wpsActive'], vuex.res['ids_error'], {
          confirmButtonText: vuex.res['ids_ok'],
          callback: action => {
          }
        });
        return false;
      }else{
        return true;
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>