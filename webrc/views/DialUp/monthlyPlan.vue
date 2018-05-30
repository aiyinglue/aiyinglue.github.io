<template lang="jade">
  include ../components.jade
  #monthlyPlan
    +sideMenuPage('Settings')
      +breadcrumb("ids_monthlyPlan_pageTitle")
      sim-state
        +form("formData")
          +input("ids_monthlyPlan_dataPlan:","MonthlyPlan")
          +select("","Unit")
          +checkbox("ids_monthlyPlan_autoDisconnet:","AutoDisconnFlag")
          +text("ids_dataConsuption:","{{formData.UsedData | covertNum}}")
          +input("ids_monthlyPlan_setTimeLimit:","TimeLimitTimes","ids_mins")(:disabled="formData.TimeLimitFlag==0")
          +checkbox("ids_isTimeLimit:","TimeLimitFlag")
          +text("ids_monthlyPlan_timePass:","{{formData.UsedTimes*60 | UsedTimes}}")
          +formBtn()
</template>

<script>
import {
  _,
  _config,
  $,
  vuex,
  G
} from '../../common.js';
var Config = _config.monthlyPlan
export default {
  created() {
      this.init();
      this.initdata(Config);
      this.Inter = setInterval(() => {
        this.dataRefresh();
      }, 6000);
    },
    destroyed() {
      clearInterval(this.Inter)
      this.Inter = null
    },
    methods: {
      init() {
        let vm = this;
        vm.vuex = vuex
        vm.sdk.get("GetUsageSettings", null, (res) => {
          vm.formData = res;
        })
      },

      dataRefresh() {
        let vm = this;
        vm.sdk.get("GetUsageSettings", null, (res) => {
          vm.formData.UsedData = res.UsedData;
          vm.formData.UsedTimes = res.UsedTimes;
        })
      },

      init_Record() {
        this.initdata(Config)
        this.sdk.get("GetUsageRecord", null, (res) => {
          this.formData = res;
        })
      },
      update() {
        let vm = this;
        let setForm = () => {
          vm.sdk.post("SetUsageSettings", this.formData, {
            callback: vm.init
          })
        }
        vm.submit("formData", setForm);
      }
    }
}
</script>
<style lang="sass" scoped> 
</style>