<template lang="jade">
  include ../components.jade
  #draft
    +sideMenuPage('Services')
      +breadcrumb("ids_draft_draft")
      sim-state
        #draftList(v-loading="page.loading")
          p.tipsInfo {{vuex.res.ids_draft_storageStatus}}: {{page.usedSMSCount}}/{{page.maxSMSCount}}
          +button("ids_delete")(id="btnDelete" ,@click="deleteSMS",:disabled="page.selectCount==0")
          el-table(class="smsList",:data="page.draftSMSList" stripe style="width: 100%" border @selection-change="handleSelectionChange")
            el-table-column(prop="PhoneNumber" ,:label="vuex.res.ids_draft_phoneNumber" min-width="20%" inline-template)
              span(@click="smsDetails('draft',row)") {{row.PhoneNumber[0]}}
            el-table-column(prop="SMSContent" ,:label="vuex.res.ids_draft_content" show-overflow-tooltip=true min-width="40%" inline-template)
              span(@click="smsDetails('draft',row)") {{row.SMSContent}}
            el-table-column(prop="SMSTime" ,:label="vuex.res.ids_draft_time" min-width="25%" inline-template)
              span(@click="smsDetails('draft',row)") {{row.SMSTime |formatTime}}
            el-table-column(prop="SMSId" type="selection" min-width="15%")
          div.jumper
            +button("ids_inbox_go")(type="primary" size="mini" @click="jumperGo")
            el-input(size="mini" v-model="page.inputPage")
          el-pagination(small layout="prev, pager, next",:current-page="page.currentPage",:page-size="page.PageSize",:page-count="page.totalPageCount",@current-change="handleCurrentChange")
</template>
<script>
import {_config,_,vuex,$} from '../../common.js';
import sms from '../../config/sms.js';
let Config = _config.draft;
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
          draftSMSList: [],
          maxSMSCount: 0,
          usedSMSCount: 0,
          totalPageCount: 0,
          currentPage: 0,
          selectCount: 0,
          select: {},
          PageSize: 10,
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
          "key": "draft"
        };
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.draftSMSList = res.SMSList;
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
        this.$confirm(vuex.res['ids_draft_deleteSmsPrompt'], vuex.res['ids_confirm'], {
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

      smsDetails(type,clickSms) {
        let smsInfo = {
          SMSId: clickSms.SMSId,
          PhoneNumber: clickSms.PhoneNumber[0],
          SMSContent: clickSms.SMSContent,
          SMSTime: clickSms.SMSTime
        };
        sms.doEdit(this.$router,type, smsInfo);
      },

      handleCurrentChange(val) {
        let sendData = {
          "Page": val,
          "key": "draft"
        };
        this.page.inputPage = val;
        this.page.currentPage = val;
        this.sdk.get("GetSMSListByContactNum", sendData, (res) => {
          this.page.totalPageCount = res.TotalPageCount;
          this.page.draftSMSList = res.SMSList;
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

#draftList {
  margin: 20px 10px;
}
.smsList{
  float:left;
}
</style>


