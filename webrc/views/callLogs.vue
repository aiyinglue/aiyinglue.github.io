<template lang="jade">
  include ./components.jade
  #callLogs
    +sideMenuPage('Services')
      +breadcrumb("{{page.pageName}}")
      p.tipsInfo {{vuex.res.ids_callLogs_storageStatus}}: {{vuex.callLogCount.TotalUsedCount}}/{{vuex.callLogCount.MaxCallLogCount}}
      +button("ids_delete")(id="deleteBtn" ,@click="deleteCallLogs",:disabled="page.select.length==0")
      el-table(class="callLogsList" ,:data="page.callLogList" stripe style="width: 100%" border @selection-change="handleSelectionChange")
        el-table-column(prop="TelNumber" ,:label="vuex.res.ids_callLogs_number" style="width: 30%" align="center")
        el-table-column(prop="Date" ,:label="vuex.res.ids_callLogs_time" style="width: 30%" align="center")
        el-table-column(prop="Duration" ,:label="vuex.res.ids_callLogs_duration" style="width: 25%" align="center"  inline-template)
          span {{row.Duration |formtDuration}}
        el-table-column(prop="Id" type="selection" style="width: 15%" align="center")
      div.jumper
        +button("ids_inbox_go")(type="primary" size="mini" @click="jumperGo")
        el-input(size="mini" v-model="page.inputPage")
      el-pagination(small layout="prev, pager, next",:current-page="page.currentPage",:page-size="page.PageSize",:page-count="page.totalPageCount",@current-change="handleCurrentChange")
        
</template>

<script>
import {_config,_,vuex} from '../common.js';
let Config = _config.callLogs;
export default {
  created() {
      this.init();
      this.Inter = setInterval(() => {
        vuex.refreshCallLogCountInfo();
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
      '$route' (to, from) {
        this.init()
      },
      'vuex.callLogCount.TotalUsedCount' (newValue, oldValue) {
        this.getCallLogList();
      }
    },
    methods: {
      init() {
        this.initdata(Config);
        this.page = {
          pageName: " ",
          callLogList: [],
          totalPageCount: 0,
          currentPage: 0,
          select: [],
          inputPage: 1,
          totalUsedCount:0
        };
        this.getCallLogList();
      },

      getCallLogList(){
        if (this.$route.name == "outgoingCall") {
          this.page.pageName = this.vuex.res.ids_callLogs_Outgoing;
          this.formData.Page = 1;
          this.formData.ListType = 2;
        } else if (this.$route.name == "missedCall") {
          this.page.pageName = this.vuex.res.ids_callLogs_Missed;
          this.formData.Page = 1;
          this.formData.ListType = 3;
        } else {
          this.page.pageName = this.vuex.res.ids_callLogs_Incoming;
          this.formData.Page = 1;
          this.formData.ListType = 1;
        }
        this.sdk.get("GetCallLogList", this.formData, (res) => {
          this.page.callLogList = res.CallLogList;
          this.page.totalPageCount = res.TotalPageCount;
        })
      },

      deleteCallLogs() {
        let selectId = [];
        _.each(this.page.select, (k, v) => {
          selectId[v] = k.Id;
        });
        let results = {
          callback: this.init
        };
        this.$confirm(vuex.res['ids_callLogs_deleteCallRecord'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          let deleteInfo = {
            "Id": _.uniq(selectId),
            "ListType":this.formData.ListType
          };
          this.sdk.post("DeleteCallLog", deleteInfo, results);
        }).catch(() => {

        });
      },

      handleSelectionChange(val) {
        this.page.select = val;
      },

      handleCurrentChange(val) {
        let sendData = {
          "Page": val,
          "ListType": this.formData.ListType
        };
        this.page.inputPage = val;
        this.page.currentPage = val;
        this.sdk.get("GetCallLogList", sendData, (res) => {
          this.page.callLogList = res.CallLogList;
          this.page.totalPageCount = res.TotalPageCount;
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
p {
  float: left;
  font-size: 12px;
}
#deleteBtn {
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
.callLogsList{
  float:left;
}
</style>
