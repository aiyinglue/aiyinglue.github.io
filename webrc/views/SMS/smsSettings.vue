<template lang="jade">
  include ../components.jade
  #smsSettings
    +sideMenuPage('Services')
      +breadcrumb("ids_smsSettings_smsSettings")
      sim-state
        +form("formData")
          +radio("ids_smsSettings_storagePath:","StoreFlag")
          +formItem("ids_smsSettings_settingSmsReport:")
            el-switch(v-model="page.smsReportFlag" on-text="" off-text="")
          +input("ids_smsSettings_centerNum:","SMSCenter")(disabled)
          +formBtn()

</template>

<script>
import {_config,_ ,vuex} from '../../common.js';
let Config = _config.smsSettings;
export default {
  created () {
    this.init()
  },
  methods: {
    init (){
      this.initdata(Config);
      this.page={
        smsReportFlag:true
      };
      this.sdk.get("GetSMSSettings",null,(res)=>{
        this.formData = res;
        this.page.smsReportFlag=this.formData.SMSReportFlag==1?true:false;
      });
    },
    update (){
      let results = {
        callback:this.init
      };
      this.formData.SMSReportFlag=this.page.smsReportFlag==true?1:0;
      this.sdk.post("SetSMSSettings",this.formData,results);
    }
  }
}
</script>

<style lang="sass" scoped>
</style>