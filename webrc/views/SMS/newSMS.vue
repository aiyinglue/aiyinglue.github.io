<template lang="jade">
  include ../components.jade
  #newSMS
    +sideMenuPage('Services')
      +breadcrumb("ids_newSMS_newMessage")
      sim-state
          #newSMSContent
            el-input(v-model="formData.PhoneNumber" v-on:change="listenPhoneNumber()")
              span(slot="prepend") {{vuex.res.ids_newSMS_to}}:
            div.tips-error(:class="{hidden:page.inputNumberWarn}") {{vuex.res.ids_newSMS_inputNumber}}
            div.tips-error(:class="{hidden:page.phoneNumberRule}") {{vuex.res.ids_newSMS_numberRule}}
            div.tips-error(:class="{hidden:page.multipleRecipinentsRule}") {{vuex.res.ids_newSMS_multipleRecipinentsRule}}
            div.tips-error(:class="{hidden:page.tooManyRcipients}") {{vuex.res.ids_newSMS_tooManyRecipients}}
            p.smsCount(v-bind="listenCharCount()") {{page.length}}
            el-input(v-model="formData.SMSContent" type="textarea",:rows.number=10)
            div.tips-error(:class="{hidden:page.maxContentWarnDisplay}") {{vuex.res.ids_newSMS_contentRule}}
            #btnSMS
              +button("ids_newSMS_send")(type="primary" ,@click="sendSMS" ,:disabled="!page.maxContentWarnDisplay")
              +button("ids_newSMS_save")(type="primary" ,@click="saveSMS" ,:disabled="!page.maxContentWarnDisplay")
              +button("ids_cancel")(type="primary" ,@click="cancel")
          el-dialog(v-model="page.sendPop" size="tiny" ,:show-close="false",:close-on-press-escape="false",:close-on-click-modal="false")
            span {{vuex.res.ids_newSMS_sendingPrompt}}
      
</template>

<script>
import {_config,_,vuex,$} from '../../common.js';
import sms from '../../config/sms.js'
let Config = _config.newSMS;
export default {
  created() {
      this.init();
    },
    methods: {
      init() {
        this.initdata(Config);
        this.vuex = vuex;
        this.page = {
          length: 0,
          currentSmsCount: 0,
          maxSMSCount: 0,
          usedSMSCount: 0,
          smsCounts: 0,
          inputNumberWarn: true,
          maxContentWarnDisplay: true,
          phoneNumberRule: true,
          tooManyRcipients: true,
          smsFullFlag: 0,
          smsStatus: 0,
          sendPop: false,
          multipleRecipinents: [],
          sendSuccessCount: 0,
          sendFailedCount: 0,
          multipleRecipinentsRule: true,
          sendComplete: false,
          i: 0
        };
        if (this.$route.params.pageType == "" || this.$route.params.pageType == null || this.$route.params.pageType == undefined) {
          this.formData.PhoneNumber = "";
          this.formData.SMSContent = "";
        } else {
          this.formData.PhoneNumber = sms.phoneNumber;
          this.formData.SMSContent = sms.smsContent;
        }
        this.sdk.get("GetSMSStorageState", null, (res) => {
          this.page.maxSMSCount = res.MaxCount;
          //this.page.usedSMSCount = res.TUseCount;
          this.page.usedSMSCount = res.MaxCount - res.LeftCount;

          if (this.page.smsFullFlag == 0) {
            this.page.smsFullFlag = 1;
            if (this.page.usedSMSCount == this.page.maxSMSCount && this.page.usedSMSCount != 0) {
              this.$alert(vuex.res['ids_newSMS_boxFullPrompt'], vuex.res['ids_newSMS_message'], {
                confirmButtonText: vuex.res['ids_ok']
              });
            }
          }
        });
      },
      saveSMS() {
        if (this.formData.PhoneNumber != "") {
          this.page.inputNumberWarn = true;
          if (Config.pageItem.SupportMultipleRecipients) {
            this.saveMultipleSMS();
          } else {
            this.saveSingleSMS();
          }
        } else {
          this.page.inputNumberWarn = false;
        }
      },
      saveSingleSMS() {
        if(Config.pageItem.isSupportLatamSMS){
          this.formData.SMSContent = sms.to7BITStr(this.formData.SMSContent);
        }
        let saveData = {
          SMSId: this.formData.SMSId,
          SMSTime: sms.getSystemTime(),
          SMSContent: this.formData.SMSContent,
          PhoneNumber: this.formData.PhoneNumber
        };
        let results = {
          callback: this.init
        };
        let realCount = this.page.usedSMSCount + this.page.smsCounts;
        if (sms.phoneNumberRule(this.formData.PhoneNumber)) {
          if (realCount <= this.page.maxSMSCount) {
            if (this.formData.Flag == 1) {
              let selectId = [];
              selectId[0] = sms.smsId;
              let deleteInfo = {
                "DelFlag": 3,
                "SMSArray": selectId
              };
              this.sdk.post("DeleteSMS", deleteInfo, results);
            }
            this.sdk.post("SaveSMS", saveData, results);
            this.$router.push('draft')
          } else {
            this.$alert(vuex.res['ids_newSMS_boxFullPrompt'], vuex.res['ids_newSMS_message'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {}
            });
          }
        } else {
          this.page.phoneNumberRule = false;
        }
      },
      saveMultipleSMS() {
        this.page.multipleRecipinents = _.compact(this.formData.PhoneNumber.split(";"));
        let phoneNumberMatchesCount = 0;
        if (sms.multipleRecipinentsRule(this.formData.PhoneNumber) && this.page.multipleRecipinents.length > 0) {
          this.page.multipleRecipinentsRule = true;
          for (let i = 0; i < this.page.multipleRecipinents.length; i++) {
            if (sms.phoneNumberRule(this.page.multipleRecipinents[i])) {
              phoneNumberMatchesCount = phoneNumberMatchesCount + 1;
            }
          }
          if (phoneNumberMatchesCount == this.page.multipleRecipinents.length) {
            this.page.phoneNumberRule = true;
            let inputCount = this.page.smsCounts * this.page.multipleRecipinents.length;
            let realCount = this.page.usedSMSCount + this.page.smsCounts * this.page.multipleRecipinents.length;
            if (inputCount >30&&this.page.multipleRecipinents.length>3) {
              this.page.tooManyRcipients = false;
            } else {
              this.page.tooManyRcipients = true;
              if (realCount <= this.page.maxSMSCount) {
                if (this.formData.Flag == 1) {
                  let selectId = [];
                  selectId[0] = sms.smsId;
                  let deleteInfo = {
                    "DelFlag": 3,
                    "SMSArray": selectId
                  };
                  this.sdk.post("DeleteSMS", deleteInfo, results);
                }
                let results = {
                  callback: this.init
                };
                for (let i = 0; i < this.page.multipleRecipinents.length; i++) {
                  if(Config.pageItem.isSupportLatamSMS){
                    this.formData.SMSContent = sms.to7BITStr(this.formData.SMSContent);
                  }
                  let saveData = {
                    SMSId: this.formData.SMSId,
                    SMSTime: sms.getSystemTime(),
                    SMSContent: this.formData.SMSContent,
                    PhoneNumber: this.page.multipleRecipinents[i]
                  };
                  this.sdk.post("SaveSMS", saveData, results);
                  this.$router.push('draft')
                }
              } else {
                this.$alert(vuex.res['ids_newSMS_boxFullPrompt'], vuex.res['ids_newSMS_message'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {}
                });
              }
            }
          } else {
            this.page.phoneNumberRule = false;
            this.page.multipleRecipinentsRule = true;
            this.page.tooManyRcipients = true;
          }
        } else {
          this.page.phoneNumberRule = true;
          this.page.multipleRecipinentsRule = false;
          this.page.tooManyRcipients = true;
        }
      },
      sendSMS() {
        if (this.formData.PhoneNumber != "") {
          this.page.inputNumberWarn = true;
          if (Config.pageItem.SupportMultipleRecipients) {
            this.sendMultipleSMS();
          } else {
            this.sendSingleSMS();
          }
        } else {
          this.page.inputNumberWarn = false;
          //this.page.phoneNumberRule = true;
        }
      },
      sendSingleSMS() {
        if(Config.pageItem.isSupportLatamSMS){
          this.formData.SMSContent = sms.to7BITStr(this.formData.SMSContent);
        }
        let sendData = {
          SMSId: this.formData.SMSId,
          SMSContent: this.formData.SMSContent,
          PhoneNumber: this.formData.PhoneNumber,
          SMSTime: sms.getSystemTime()
        };
        let realCount = this.page.usedSMSCount + this.page.smsCounts;
        if (sms.phoneNumberRule(this.formData.PhoneNumber)) {
          this.page.inputNumberWarn = true;
          this.page.phoneNumberRule = true;
          if (realCount <= this.page.maxSMSCount) {
            this.sdk.post("SendSMS", sendData, (res) => {
              this.page.sendPop = true;
              let vm = this;
              this.Inter = setInterval(() => {
                vm.showResult()
              }, 3000);
            });
          } else {
            this.$alert(vuex.res['ids_newSMS_boxFullPrompt'], vuex.res['ids_newSMS_message'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {}
            });
          }
        } else {
          this.page.inputNumberWarn = true;
          this.page.phoneNumberRule = false;
        }
      },
      sendMultipleSMS() {
        this.page.multipleRecipinents = _.compact(this.formData.PhoneNumber.split(";"));
        let phoneNumberMatchesCount = 0;
        if (sms.multipleRecipinentsRule(this.formData.PhoneNumber) && this.page.multipleRecipinents.length > 0) {
          this.page.multipleRecipinentsRule = true;

          for (let i = 0; i < this.page.multipleRecipinents.length; i++) {
            if (sms.phoneNumberRule(this.page.multipleRecipinents[i])) {
              phoneNumberMatchesCount = phoneNumberMatchesCount + 1;
            }
          }
          if (phoneNumberMatchesCount == this.page.multipleRecipinents.length) {
            this.page.phoneNumberRule = true;
            let inputCount = this.page.smsCounts * this.page.multipleRecipinents.length;
            let realCount = this.page.usedSMSCount + inputCount;
            if(inputCount > 30&&this.page.multipleRecipinents.length>3){
              this.page.tooManyRcipients = false;
            }else{
              this.page.tooManyRcipients = true;
              if (realCount <= this.page.maxSMSCount) {
                if(Config.pageItem.isSupportLatamSMS){
                  this.formData.SMSContent = sms.to7BITStr(this.formData.SMSContent);
                }
              let sendData = {
                  SMSId: this.formData.SMSId,
                  SMSContent: this.formData.SMSContent,
                  PhoneNumber: this.page.multipleRecipinents[this.page.i],
                  SMSTime: sms.getSystemTime()
                }
              this.sdk.post("SendSMS", sendData, (res) => {
                this.page.sendPop = true;
                let vm = this;
                this.Inter = setInterval(() => {
                  vm.sendMultipleSmsResult()
                }, 3000);
              });
            } else {
              this.$alert(vuex.res['ids_newSMS_boxFullPrompt'], vuex.res['ids_newSMS_message'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {}
              });
            }
            }
            
          }else{
            this.page.phoneNumberRule = false;
            this.page.multipleRecipinentsRule = true;
            this.page.tooManyRcipients =true;
          }

        } else {
          this.page.phoneNumberRule = true;
          this.page.multipleRecipinentsRule = false;
          this.page.tooManyRcipients =true;
        }
      },
      sendMultipleSmsResult() {
        this.sdk.get("GetSendSMSResult", null, (res) => {
          let status = res.SendStatus;
          if (status == 1 || status == 3) {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.stopListenLogoutTime);
            }
            this.page.sendPop = true;
            this.page.sendComplete = false;
          } else if (status == 2) {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.listenLogoutTime)
            }
            this.page.sendSuccessCount = this.page.sendSuccessCount + 1;
            this.page.sendComplete = true;

            let sendCounts = this.page.sendSuccessCount + this.page.sendFailedCount;
            if (sendCounts == this.page.multipleRecipinents.length) {
              this.page.sendPop = false;
              if (this.page.sendSuccessCount == this.page.multipleRecipinents.length) {
                this.$router.push('inbox');
                this.page.sendPop = false;
                this.$message({
                  message: vuex.res['ids_success'],
                  type: 'success'
                });
              } else {
                this.$router.push('draft');
                this.$alert(vuex.res['ids_newSMS_sendResult'].replace("33",this.page.sendSuccessCount).replace("44",this.page.sendFailedCount),{
                  showConfirmButton: false
                });
              }
            } else {
              this.page.i++;
              this.page.sendComplete = true;
              this.continueSendMultipleSms();
            }
            clearInterval(this.Inter);
            this.Inter = null;
          } else {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.listenLogoutTime)
            }
            this.page.sendFailedCount = this.page.sendFailedCount + 1;
            this.page.sendComplete = true;
            let sendCounts = this.page.sendSuccessCount + this.page.sendFailedCount;
            if (sendCounts == this.page.multipleRecipinents.length) {
              this.page.sendPop = false;
              this.$router.push('draft');
              if (this.page.sendFailedCount == this.page.multipleRecipinents.length) {
                //this.$message.error(vuex.res['ids_fail']);
                this.$alert(vuex.res['ids_newSMS_notDelivered'],{
                  showConfirmButton: false
                });
              } else {
                this.$alert(vuex.res['ids_newSMS_sendResult'].replace("33",this.page.sendSuccessCount).replace("44",this.page.sendFailedCount),{
                  showConfirmButton: false
                });
              }
            } else {
              this.page.i++;
              this.page.sendComplete = true;
              this.continueSendMultipleSms();
            }
            clearInterval(this.Inter)
            this.Inter = null
          }
        });
      },
      continueSendMultipleSms() {
        if (this.page.i < this.page.multipleRecipinents.length && this.page.sendComplete) {
          let sendData = {
            SMSId: this.formData.SMSId,
            SMSContent: this.formData.SMSContent,
            PhoneNumber: this.page.multipleRecipinents[this.page.i],
            SMSTime: sms.getSystemTime()
          }
          this.sdk.post("SendSMS", sendData, (res) => {
            this.page.sendPop = true;
            let vm = this;
            this.Inter = setInterval(() => {
              vm.sendMultipleSmsResult()
            }, 3000);
          });
        }
      },
      cancel() {
        this.formData.PhoneNumber = "";
        this.formData.SMSContent = "";
      },
      showResult() {
        this.sdk.get("GetSendSMSResult", null, (res) => {
          let status = res.SendStatus;
          if (status == 1 || status == 3) {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.stopListenLogoutTime);
            }
            this.page.sendPop = true;
          } else if (status == 2) {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.listenLogoutTime)
            }
            this.page.sendPop = false;
            this.$message({
              message: vuex.res['ids_success'],
              type: 'success'
            });
            this.$router.push('inbox');
            clearInterval(this.Inter)
            this.Inter = null
          } else {
            if (_config.pageConfig.IsSupportTimeOutLogout) {
              vuex.listenLogout(_config.login.pageItem.listenLogoutTime)
            }
            this.page.sendPop = false;
              //this.$message.error(vuex.res['ids_fail']);
              this.$alert(vuex.res['ids_newSMS_notDelivered'],{
                showConfirmButton: false
              });
            this.$router.push('draft');
            clearInterval(this.Inter)
            this.Inter = null
          }
        });
      },
      prompt(strId, time) {
        var resMsg = resourceInfo[strId];
        popUp.prompt(time == null ? (resMsg != undefined ? resMsg : strId) : resMsg != undefined ? resMsg : strId, time)
      },
      getRes(strId) {
        return resourceInfo[strId];
      },
      listenPhoneNumber() {
        if (this.formData.PhoneNumber != "") {
          this.page.inputNumberWarn = true;
          if (Config.pageItem.SupportMultipleRecipients) {
            if (sms.multipleRecipinentsRule(this.formData.PhoneNumber)) {
              this.page.multipleRecipinentsRule = true;
              let multipleRecipinents = _.compact(this.formData.PhoneNumber.split(";"));
              let phoneNumberMatchesCount = 0;
              for (let i = 0; i < multipleRecipinents.length; i++) {
                if (sms.phoneNumberRule(multipleRecipinents[i])) {
                  phoneNumberMatchesCount++;
                }
              }
              if (phoneNumberMatchesCount == multipleRecipinents.length) {
                this.page.phoneNumberRule = true;
                let inputCount = this.page.smsCounts * multipleRecipinents.length;
                let realCount = this.page.usedSMSCount + inputCount;
                if(inputCount>30&&multipleRecipinents.length>3){
                  this.page.tooManyRcipients = false;
                }else{
                  this.page.tooManyRcipients = true;
                }
              } else {
                this.page.tooManyRcipients = true;
                this.page.phoneNumberRule = false;
              }
            } else {
              this.page.multipleRecipinentsRule = false;
              this.page.tooManyRcipients = true;
              this.page.phoneNumberRule = true;
            }
          } else {
            if (!sms.phoneNumberRule(this.formData.PhoneNumber)) {
              this.page.inputNumberWarn = true;
              this.page.phoneNumberRule = false;
            } else {
              this.page.inputNumberWarn = true;
              this.page.phoneNumberRule = true;
            }
          }
        } else {
          this.page.inputNumberWarn = false;
          this.page.phoneNumberRule = true;
          this.page.multipleRecipinentsRule = true;
          this.page.tooManyRcipients = true;
        }
      },
      listenCharCount() {
        let content = this.formData.SMSContent;
        let contentLength = content.length;
        let contentNum = 0;
        let MaxLength = sms.SMS_7BIT_MAX_SIZE;
        if (sms.isUcs2(content)) {
          MaxLength = sms.SMS_UCS2_MAX_SIZE;
          contentNum = contentLength;
          this.page.smsCounts = sms.getSmsCountStr(contentLength, "ucs2");
        } else {
          contentNum = parseInt(contentLength + sms.get7ExtNum(content));
          this.page.smsCounts = sms.getSmsCountStr(contentNum, "7bit");

        }
        if (contentNum > MaxLength) {
          this.page.maxContentWarnDisplay = false;
        } else {
          this.page.maxContentWarnDisplay = true;
        }
        this.page.length = contentNum + "/" + MaxLength + "(" + this.page.smsCounts + ")";
      }

    }
}
</script>


<!--<style lang="sass">
.sendPop .el-dialog__close.el-icon.el-icon-close {
  display: none;
}
</style>-->
<style lang="sass" scoped>
.el-input,
.el-textarea textarea {
  width: 100%;
}

p {
  float: right;
}

#btnSMS {
  text-align: center;
  margin-top: 20px;
}

.hidden {
  display: none;
}

#newSMSContent {
  margin: 20px 10px;
}

.el-form {
  width: 95%;
  margin: 0 10px;
}
</style>
