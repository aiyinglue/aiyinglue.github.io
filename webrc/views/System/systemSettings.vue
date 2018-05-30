<template lang="jade">
  include ../components.jade
  #systemSettings
    +sideMenuPage('System')
      +breadcrumb("ids_systemSettings_pageTitle")
      +form("formData")
        +formItem("ids_systemSettings_languageSettings:")(v-if="langListSupport.length>1")
          el-select(v-model="formData.Language",:placeholder="vuex.res.ids_systemSettings_placeholderSelect")
            el-option(v-for="val in langListSupport",:label="langListAll[val]",:value="val")
        +formItem("ids_systemSettings_timeZone:")
          el-select(v-model="formData.ZoneName")
            el-option(v-for="val in formOptions.ZoneName",:label="(val[3]+vuex.res[val[2]])",:value="val[1]")
        +text("ids_systemSettings_currentTime:","{{formData.exCurrTime}}")
        +formBtn()

</template>
<script>
import {_config,$,sys,vuex} from '../../common.js';
import ElementUI from 'element-ui';
let Config = _config.systemSettings;
let pageConfig = _config.pageConfig;
export default {
  created() {
      let vm = this;
      vm.init();
      vm.Inter = setInterval(() => {
        vm.getCurrentTimeInfo();
      }, 5000);
      vm.Inter1 = setInterval(() => {
        vm.refreshCurrentTime(vm.formData.exCurrTime);
      }, 1000);
    },
    destroyed() {
      let vm = this;
      clearInterval(this.Inter);
      this.Inter = null;
      clearInterval(this.Inter1);
      this.Inter1 = null;
      clearTimeout(vm.page.t);
      vm.page.t = null
    },
    methods: {
      init() {
        this.langListSupport=pageConfig.langListSupport;
        this.langListAll=pageConfig.langListAll;
        this.initdata(Config);
        /*this.sdk.get("GetSystemSettings", null, (res) => {
          $.extend(this.formData, res);
        });*/
        this.sdk.get("GetCurrentTime", null, (res) => {
          $.extend(this.formData, res);
        });
        this.sdk.get("GetCurrentLanguage", null, (res) => {
          this.$set(this.formData,"Language",res.Language||"en")
        });
      },
      getCurrentTimeInfo() {
        this.sdk.get("GetCurrentTime", null, (res) => {
          this.formData.CurrTime=res.CurrTime;
          //$.extend(this.formData, res);
        });
      },
      update() {
        /*let sysSettings={
          "NtpServer1":this.formData.NtpServer1,
          "NtpServer2":this.formData.NtpServer2
        };*/
        let timeZone=this.realeTimeZone(sys.TimeZone);
        let currTime={
          "TimeZone":timeZone,
          "ZoneName":this.formData.ZoneName
        };
        let language={
          "Language":this.formData.Language
        };
        /*this.submit("formData", () => {*/
          /*this.sdk.post("SetSystemSettings", sysSettings, (res) => {*/
            /*if (this.requestJsonRpcIsOk(res)) {*/
              this.sdk.post("SetCurrentTime", currTime, (res) => {
                if (this.requestJsonRpcIsOk(res)) {
                  this.sdk.post("SetLanguage", language, (res) => {
                    if (this.requestJsonRpcIsOk(res)) {
                      ElementUI.Message.success(this.vuex.res.ids_success);
                        location.reload()
                    } else {
                      ElementUI.Message.error(this.vuex.res.ids_fail);
                    }
                  });
                } else {
                  ElementUI.Message.error(this.vuex.res.ids_fail);
                }
              });
            /*} else {
              ElementUI.Message.error(this.vuex.res.ids_fail);
            }*/
          /*});*/
        /*});*/
      },
      requestJsonRpcIsOk(result) {
        return result.hasOwnProperty("result") && !result.hasOwnProperty("error");
      },
      refreshCurrentTime(exCurrTime){
        let formatType = 0;
        let smsDay, smsMonth, smsYear, smsHour, smsMinutes, smsSeconds, tmpDate, tmpTime;
        tmpDate = exCurrTime.split(" ")[0];
        tmpTime = exCurrTime.split(" ")[1];
        smsDay = tmpDate.split("-")[0];
        smsMonth = tmpDate.split("-")[1];
        smsYear = tmpDate.split("-")[2];
        smsHour = parseInt(tmpTime.split(":")[0]);
        smsMinutes = parseInt(tmpTime.split(":")[1]);
        smsSeconds = parseInt(tmpTime.split(":")[2])+1;
       
        if(smsSeconds>=60){
          smsMinutes=smsMinutes+1;
          smsSeconds=smsSeconds-60;
          if(smsMinutes>=60){
            smsHour=smsHour+1;
            smsMinutes=smsMinutes-60;
          }
        }

        if(smsSeconds<10){
          smsSeconds="0"+smsSeconds;
        }
        if(smsMinutes<10){
          smsMinutes="0"+smsMinutes;
        }
        if(smsHour<10){
          smsHour="0"+smsHour;
        }
        tmpDate = smsDay + "-" + smsMonth + "-" + smsYear;
        tmpTime = smsHour + ":" + smsMinutes + ":" + smsSeconds;
        exCurrTime = tmpDate + " " + tmpTime;
        this.formData.exCurrTime=exCurrTime;
      },
      realeTimeZone(zoneNameList){
        let timeZone;
        for(let i=0;i<zoneNameList.length;i++){
          if(zoneNameList[i][1]==this.formData.ZoneName){
            return timeZone=zoneNameList[i][0];
          }
          
        }
      }
    }
}
</script>

<style lang="sass" scoped>
</style>