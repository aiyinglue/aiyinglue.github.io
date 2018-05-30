<template lang="jade">
  include ../components.jade
  #inbox
    +sideMenuPage('Services')
      +breadcrumb("ids_inbox_inbox")
      sim-state
        #inboxList(v-loading="page.loading",:class="{hidden:page.inboxListDisplay}")
          p.tipsInfo {{vuex.res.ids_inbox_storageStatus}}: {{page.usedSMSCount}}/{{page.maxSMSCount}}
          +button("ids_delete")(id="btnDelete" ,@click="deleteSMS",:disabled="page.selectCount==0")
          el-table(class="smsList",:data="page.inboxSMSList" stripe style="width: 100%" border @selection-change="handleSelectionChange")
            el-table-column(prop="SMSType" ,:label="vuex.res.ids_inbox_state" min-width="10%" inline-template)
              span.iconfont(@click="smsDetails(row)" ,:class="{'icon-ic_message':row.SMSType==1,'icon-ic_message_allread':row.SMSType!=1}")
            el-table-column(prop="PhoneNumber" ,:label="vuex.res.ids_inbox_phoneNumber" min-width="20%" inline-template)
              span(@click="smsDetails(row)") {{row.PhoneNumber[0]}}
            el-table-column(prop="SMSContent" ,:label="vuex.res.ids_inbox_content" min-width="38%" show-overflow-tooltip=true inline-template)
              span(@click="smsDetails(row)") {{row.SMSContent}}
            el-table-column(prop="SMSTime" ,:label="vuex.res.ids_inbox_time" min-width="22%" inline-template)
              span(@click="smsDetails(row)") {{row.SMSTime |formatTime}}
            el-table-column(prop="SMSId" type="selection" min-width="10%")
          div.jumper
            +button("ids_inbox_go")(type="primary" size="mini" @click="jumperGo")
            el-input(size="mini" v-model="page.inputPage")
          el-pagination(small layout="prev, pager, next",:current-page="page.currentPage",:page-size="page.PageSize",:page-count="page.totalPageCount",@current-change="handleCurrentChange")
        #inboxDetail(:class="{hidden:page.inboxDetailDisplay}")
          el-input(v-model="page.selectSMSNumber" readonly="readonly")
            span(slot="prepend") {{vuex.res.ids_inbox_from}}:
          el-input(type="textarea",:rows.number=10 ,v-model="page.selectSMSContent" readonly="readonly")
          #btnList
            #btnLeft
              +button("ids_back")(type="primary" ,@click="back")
            #btnRight
              +button("ids_inbox_reply")(type="primary" ,@click="replySMS('reply',page.selectSMS)")
              +button("ids_inbox_forward")(type="primary" ,@click="forwardSMS('forword',page.selectSMS)")
              +button("ids_delete")(type="primary" ,@click="deleteSingleSMS(page.selectSMSId)")
</template>

<script>
import {_config,_,vuex,$} from '../../common.js';
import sms from '../../config/sms.js';
let Config = _config.inbox;
export default {
  created() {
      this.init();
      //setInterval(vuex.refreshSMSStorageState, 5000);
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
          inboxSMSList: [],
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
          inboxListDisplay: false,
          inboxDetailDisplay: true,
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
          "key": "inbox"
        };
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.inboxSMSList = res.SMSList;
          for (let i = 0; i < this.page.inboxSMSList.length; i++) {
            if (this.page.inboxSMSList[i].SMSType == 4) {
              this.page.inboxSMSList.splice(i, 1);
            }
          }
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
        this.$confirm(vuex.res['ids_inbox_deleteSmsPrompt'], vuex.res['ids_confirm'], {
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
        this.page.inboxListDisplay = true;
        this.page.inboxDetailDisplay = false;
        if (clickSms.SMSType == 1) {
          this.sdk.get("GetSingleSMS", {
            SMSId: clickSms.SMSId
          }, (res) => {
            //console.log("read"+clickSms.SMSId);
          });
        }
      },

      back() {
        this.initSmsState();
        this.page.inboxListDisplay = false;
        this.page.inboxDetailDisplay = true;
      },

      replySMS(type,replySms) {
        let replyData = {
          PhoneNumber: replySms.PhoneNumber[0],
          SMSContent: "",
        };
        sms.doReply(this.$router, type, replyData);
      },

      forwardSMS(type,forwardSms) {
        let forwardData = {
          PhoneNumber: "",
          SMSContent: forwardSms.SMSContent
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
        this.$confirm(vuex.res['ids_inbox_deleteSmsPrompt'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          this.sdk.post("DeleteSMS", deleteInfo, results);
          this.page.inboxListDisplay = false;
          this.page.inboxDetailDisplay = true;
        }).catch(() => {
          this.page.inboxListDisplay = true;
          this.page.inboxDetailDisplay = false;
        });
      },

      handleCurrentChange(val) {
        let sendData = {
          "Page": val,
          "key": "inbox"
        };
        this.page.inputPage = val;
        this.page.currentPage = val;
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.inboxSMSList = res.SMSList;
          for (let i = 0; i < this.page.inboxSMSList.length; i++) {
            if (this.page.inboxSMSList[i].SMSType == 4) {
              this.page.inboxSMSList.splice(i, 1);
            }
          }
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

#inboxList,
#inboxDetail {
  margin: 20px 10px;
}

#inboxDetail .el-textarea {
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

