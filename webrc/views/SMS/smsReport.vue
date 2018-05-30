<template lang="jade">
  #smsReport
</template>

<script>
import {_config,vuex,$} from '../../common.js';
let Config = _config.smsReport;
export default {
  created() {
      this.init();
      if(vuex.loginState){
        this.Inter = setInterval(() => {
          this.displaySMSReport();
        }, 5000);
      }
    },
    methods: {
      init() {
        this.initdata(Config);
        this.page = {
          smsReport: []
        };
      },
      displaySMSReport() {
        let sendData = {
          "Page": 0,
          "key": "inbox"
        };
        if(vuex.loginState){
          this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
            if (res != undefined && res.SMSList.length > 0) {
              this.page.smsReport = [];
              for (let i = 0; i < res.SMSList.length; i++) {
                if (res.SMSList[i].SMSType == 4) {
                  this.page.smsReport.push(res.SMSList[i]);
                }
              }
              if (this.page.smsReport.length > 0) {
                this.$notify.info({
                  title: this.vuex.res.ids_smsReport_deliveryReport,
                  message: this.vuex.res.ids_smsReport_successfullyDeliveredReport + " " + this.page.smsReport[0].PhoneNumber,
                  offset: 100,
                  onClose: this.deleteReport()
                });
              }
            }
          });
        }
      },
      deleteReport(){
        let deletReportId=[];
        deletReportId[0]=this.page.smsReport[0].SMSId;
        let deleteInfo = {
            "DelFlag": 3,
            "SMSArray": deletReportId
          };
         this.sdk.post("DeleteSMS", deleteInfo, (res) => {
          deletReportId.splice(0,1);
        });
      },
      read() {
        this.sdk.get("GetSingleSMS", {
          SMSId: this.page.smsReport[0].SMSId
        }, (res) => {
        });
      }
    }
}
</script>

<style lang="sass">
.el-notification__content{
  text-align: left!important;
}
</style>
