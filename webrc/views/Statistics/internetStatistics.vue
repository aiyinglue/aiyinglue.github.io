<template lang="jade">
  include ../components.jade
  #internetStatistics
    +sideMenuPage('Home')
      +breadcrumb("ids_internet")
      div.internet
        +button("ids_network_resetStatistics")(type="primary" @click="resetStatistics")
      div
        table.el-table
          tbody
            tr
              th {{vuex.res.ids_type}}
              th {{vuex.res.ids_netwrok_currentVolume}}
              th {{vuex.res.ids_netwrok_totalVolumeMonthly}}
            tr
              td {{vuex.res.ids_download}}
              td {{page.connectionInfo.DlBytes | covertNum}}
              td {{page.UsageRecord.HCurrUseDL+page.UsageRecord.RCurrUseDL | covertNum}} 
            tr
              td {{vuex.res.ids_upload}}
              td {{page.connectionInfo.UlBytes | covertNum}}
              td {{page.UsageRecord.HCurrUseUL+page.UsageRecord.RCurrUseUL | covertNum}}  
              
            tr
              td {{vuex.res.ids_total}}
              td {{page.connectionInfo.DlBytes+page.connectionInfo.UlBytes | covertNum}}
              td {{page.UsageRecord.HCurrUseDL+page.UsageRecord.RCurrUseDL+page.UsageRecord.HCurrUseUL+page.UsageRecord.RCurrUseUL | covertNum}} 
               
            tr
              td {{vuex.res.ids_statistics_duration}}
              td {{page.connectionInfo.ConnectionTime | times('2')}}
              td {{page.UsageRecord.TConnTimes | times('2')}}  
        el-form(label-width="320px" v-if="pageItem.BillingDay")
          +formItem("ids_billingDay_label:")(v-if="!!page.UsageSettings.BillingDay")
            el-select(v-model="page.UsageSettings.BillingDay" @change="setUsageSettings")
              el-option(v-for="val in page.monthlyData",:label="val[1]",:value.number="val[0]")

        div.tips {{vuex.res.ids_note}}:<br /> {{vuex.res.ids_netwrok_statisticsDescription}}
</template>
<script>
import {
  _,
  _config,
  $,
  vuex,
  G,
  units
} from '../../common.js';
var Config = _config.internetStatistics;
export default {
  created() {
      this.init()
      this.Inter = setInterval(() => {
        this.getData()
      }, 6000);
    },
    destroyed() {
      clearInterval(this.Inter)
      this.Inter = null
    },
    methods: {
      init() {
        this.vuex = vuex
        this.units = units
        this.initdata(Config);
        this.page = {
          monthlyData: [
            [1, "1st"],
            [2, "2nd"],
            [3, "3rd"],
            [4, "4th"],
            [5, "5th"],
            [6, "6th"],
            [7, "7th"],
            [8, "8th"],
            [9, "9th"],
            [10, "10th"],
            [11, "11th"],
            [12, "12th"],
            [13, "13th"],
            [14, "14th"],
            [15, "15th"],
            [16, "16th"],
            [17, "17th"],
            [18, "18th"],
            [19, "19th"],
            [20, "20th"],
            [21, "21st"],
            [22, "22nd"],
            [23, "23rd"],
            [24, "24th"],
            [25, "25th"],
            [26, "26th"],
            [27, "27th"],
            [28, "28th"],
            [29, "29th"],
            [30, "30th"],
            [31, "31st"]
          ],
          UsageRecord: {},
          connectionInfo: {},
          UsageSettings: {}
        };
        this.getData()
        this.sdk.get("GetUsageSettings", null, (res) => {
          this.page.UsageSettings = res;
        });
      },
      getData() {
        this.sdk.get("GetUsageRecord", null, (res) => {
          this.page.UsageRecord = res
        });
        this.sdk.get("GetConnectionState", null, (res) => {
          if (res.ConnectionStatus == "2") {
            this.page.connectionInfo = res;
          } else {           
            this.page.connectionInfo = {
               DlBytes : 0,
               UlBytes : 0,
               ConnectionTime: 0
            }          
          }
        });
      },
      resetStatistics() {
        let vm = this
        let params = {
          clear_time: units.getSystemTime()
        }
        vm.sdk.post("SetUsageRecordClear", params, {
          callback: vm.init
        })
      },
      setUsageSettings() {
        let vm = this
        vm.sdk.post("SetUsageSettings", this.page.UsageSettings, {
        });
      }
    }
}
</script>


<style lang="sass" scoped>
.internet {
  float: right;
  margin-right: 78px;
  margin-top: 8px;
  margin-bottom: 20px;
}

.tips {
  width: 90%;
  margin: 30px auto;
}

.el-table{
  width: 80%;
  margin-top: 50px;
}
</style>