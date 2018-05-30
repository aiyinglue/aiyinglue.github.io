<template lang="jade">
  include ../components.jade
  #outbox
    +sideMenuPage('Services')
      +breadcrumb("ids_outbox_outbox")
      sim-state
        #outboxList(v-loading="page.loading",:class="{hidden:page.outboxListDisplay}")
          p.tipsInfo {{vuex.res.ids_outbox_storageStatus}}: {{page.usedSMSCount}}/{{page.maxSMSCount}}
          +button("ids_delete")(id="btnDelete" ,@click="deleteSMS",:disabled="page.selectCount==0")
          el-table(class="smsList",:data="page.outboxSMSList" stripe style="width: 100%" border @selection-change="handleSelectionChange")
            el-table-column(prop="PhoneNumber" ,:label="vuex.res.ids_outbox_phoneNumber" min-width="20%" inline-template)
              span(@click="smsDetails(row)") {{row.PhoneNumber[0]}}
            el-table-column(prop="SMSContent" ,:label="vuex.res.ids_outbox_content" min-width="40%" show-overflow-tooltip=true inline-template)
              span(@click="smsDetails(row)") {{row.SMSContent}}
            el-table-column(prop="SMSTime" ,:label="vuex.res.ids_outbox_time" min-width="25%" inline-template)
              span(@click="smsDetails(row)") {{row.SMSTime |formatTime}}
            el-table-column(prop="SMSId" type="selection" min-width="15%")
          div.jumper
            +button("ids_inbox_go")(type="primary" size="mini" @click="jumperGo")
            el-input(size="mini" v-model="page.inputPage")
          el-pagination(small layout="prev, pager, next",:current-page="page.currentPage",:page-size="page.PageSize",:page-count="page.totalPageCount",@current-change="handleCurrentChange")
        #outboxDetail(:class="{hidden:page.outboxDetailDisplay}")
          el-input(v-model="page.selectSMSNumber" readonly="readonly")
            span(slot="prepend") {{vuex.res.ids_outbox_from}}:
          el-input(type="textarea",:rows.number=10 ,v-model="page.selectSMSContent" readonly="readonly")
          #btnList
            #btnLeft
              +button("ids_back")(type="primary" ,@click="back")
            #btnRight
              //-+button("ids_outbox_reply")(type="primary" ,@click="replySMS(page.selectSMS)")
              +button("ids_outbox_forward")(type="primary" ,@click="forwardSMS('forward',page.selectSMS)")
              +button("ids_delete")(type="primary" ,@click="deleteSingleSMS(page.selectSMSId)")
</template>
<script>
import {_config,_,vuex,$} from '../../common.js';
import sms from '../../config/sms.js';
let Config = _config.outbox;
export default {
  created() {
      this.init();
      this.Inter = setInterval(() => {
        vuex.refreshSMSStorageState();
      }, 5000);
    },
    destroyed() {
      let vm = this;
      clearInterval(this.Inter)
      this.Inter = null
      clearTimeout(vm.page.t)
      vm.page.t = null
    },
    watch: {
      'vuex.smsCount.LeftCount' (newValue, oldValue) {
        this.initSmsState();
      }
    },
    methods: {
      init() {
        this.initdata(Config);
        vuex.initSimInfo();
        this.page = {
          pageName: " ",
          outboxSMSList: [],
          maxSMSCount: 0,
          usedSMSCount: 0,
          totalPageCount: 0,
          currentPage: 0,
          selectCount: 0,
          select: {},
          selectSMS: {},
          selectSMSId: 0,
          selectSMSNumber: "",
          selectSMSContent: "",
          PageSize: 10,
          outboxListDisplay: false,
          outboxDetailDisplay: true,
          loading: false,
          smsInitState: 1,
          t: null,
          inputPage: 1
        };
        this.initSmsState();
      },

      initSmsState() {
        let vm = this;
        this.sdk.get("getSmsInitState", null, (res) => {
          vm.page.smsInitState = res.state;
          if (vuex.SimInfo.SIMState == 'ready' || vuex.SimInfo.SIMState == 'initializing') {
            if (res.state != 0) {
              vm.page.loading = true;
              vm.page.t = setTimeout(() => {
                vm.initSmsState();
              }, 5000)
            } else {
              vm.page.loading = false;
              vm.getSmsStorageState();
              vm.getSmsList();
            }
          }
        });
      },

      getSmsStorageState() {
        this.sdk.get("GetSMSStorageState", null, (res) => {
          this.page.maxSMSCount = res.MaxCount;
          this.page.usedSMSCount = res.MaxCount - res.LeftCount;
        });
      },

      getSmsList() {
        let sendData = {
          "Page": 1,
          "key": "send"
        };
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.outboxSMSList = res.SMSList;
        });
      },

      deleteSMS() {
        let selectId = [];
        let results = {
          callback: this.init
        };
        _.each(this.page.select, (k, v) => {
          selectId[v] = k.SMSId;
        });
        this.$confirm(vuex.res['ids_outbox_deleteSmsPrompt'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          let deleteInfo = {
            "DelFlag": 3,
            "SMSArray": _.uniq(selectId)
          };
          this.sdk.post("DeleteSMS", deleteInfo, results);
        }).catch(() => {

        });
      },

      handleSelectionChange(val) {
        this.page.selectCount = val.length;
        this.page.select = val;
      },

      smsDetails(clickSms) {
        this.page.selectSMS = clickSms;
        this.page.selectSMSId = clickSms.SMSId;
        this.page.selectSMSNumber = clickSms.PhoneNumber[0];
        this.page.selectSMSContent = clickSms.SMSContent;
        this.page.outboxListDisplay = true;
        this.page.outboxDetailDisplay = false;
        if (clickSms.SMSType == 1) {
          this.sdk.get("GetSingleSMS", {
            SMSId: clickSms.SMSId
          }, (res) => {
            //console.log("read"+clickSms.SMSId);
          });
        }
      },

      back() {
        //sms.smsGoBack("outbox");
        this.page.outboxListDisplay = false;
        this.page.outboxDetailDisplay = true;
      },

      /*replySMS() {
        let replyData = {
          PhoneNumber: this.page.selectSMSNumber,
          SMSContent: "",
        };
        sms.doReply(this.$router, replyData);
      },*/

      forwardSMS(type,forwardSms) {
        let forwardData = {
          PhoneNumber: "",
          SMSContent: forwardSms.SMSContent,
        };
        sms.doForward(this.$router, type, forwardData);
      },

      deleteSingleSMS(selectSMSId) {
        let selectId = [];
        selectId[0] = selectSMSId;
        let deleteInfo = {
          "DelFlag": 3,
          "SMSArray": selectId
        };
        let results = {
          callback: this.init
        };
        this.$confirm(vuex.res['ids_outbox_deleteSmsPrompt'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          this.sdk.post("DeleteSMS", deleteInfo, results);
          this.page.outboxListDisplay = false;
          this.page.outboxDetailDisplay = true;
        }).catch(() => {
          this.page.outboxListDisplay = true;
          this.page.outboxDetailDisplay = false;
        });
      },

      handleCurrentChange(val) {
        let sendData = {
          "Page": val,
          "key": "send"
        };
        this.page.inputPage = val;
        this.page.currentPage = val;
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.outboxSMSList = res.SMSList;
        });
      },
      jumperGo() {
        let page = parseInt(this.page.inputPage);
        if (page > 0 && page <= this.page.totalPageCount) {
          this.page.currentPage = page;
          this.handleCurrentChange(page);
        }
      }
    }
}
</script>


<style lang="sass" scoped>
#btnDelete {
  float: right;
  margin: 10px 0 10px 0;
  padding: 7px 9px;
  font-size: 12px;
}

.el-pagination {
  float: right;
  padding: 0 5px;
  margin-right:10px;
}

p {
  float: left;
  font-size: 12px;
}

.hidden {
  display: none;
}

#outboxList,
#outboxDetail {
  margin: 20px 10px;
}

#outboxDetail .el-textarea {
  margin-top: 50px;
}

#btnList {
  margin-top: 20px;
}

#btnList #btnLeft {
  float: left;
}

#btnList #btnRight {
  float: right;
}
.smsList{
  float:left;
}
</style>

