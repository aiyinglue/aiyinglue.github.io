<template lang="jade">
  include ./components.jade
  #wanConfigure
    +sideMenuPage('Settings')
      +breadcrumb("ids_qos_titleQos")
      div(v-loading.body="page.loading")      
        +form("formData")
          +formItem("ids_qos_stateControl:")
            el-switch(v-model="page.State" on-text="" off-text="" @change="switchPrefered")
          +input("ids_qos_userUpBand:","UserUpBand", "ids_kbps")(:disabled="page.State==0",:maxlength="7")      
          +input("ids_qos_userDownBand:","UserDownBand", "ids_kbps")(:disabled="page.State==0",:maxlength="8")
          +formItem("")
            +button("ids_apply")(type="primary" @click="update",:disabled="page.State==0")
            +button("ids_cancel")(@click="init",:disabled="page.State==0")
        div
          p {{vuex.res.ids_qos_deviceSpeedLimit}} 
          div.PrioritizeType
            el-radio-group(v-model="page.PrioritizeType" v-if="page.loadok" @change="switchPrefered",:disabled="page.State==0")
              el-radio-button(v-for="val in page.PrioritizeTypeData",:label="val[0]") {{vuex.res[val[1]]}}
        div.deviceInfo    
          p {{vuex.res.ids_qos_deviceSpeedLimit}} 
          table.el-table
            tr
              th {{vuex.res.ids_menu_connectDevice}} 
              th {{vuex.res.ids_system_deviceInfo}}
              th {{vuex.res.ids_qos_priority}}
              
            tr(v-for="(list,index) in page.qosList")
              td {{list.DeviceName}}
              td 
                p {{vuex.res.ids_ipAddress}}: {{list.SrcIPAddress}}
                p {{vuex.res.ids_lan_macAdress}}: {{list.MACAddress}}
              td 
                el-select(v-model="list.Priority" @change="save(index)",:disabled="page.State==0")
                  el-option(v-for="val in page.priorityData",:label="(String(val[1]).indexOf('ids_')==0?vuex.res[val[1]]:val[1])",:value.number="val[0]")
</template>
<script>
import {
  $,
  _,
  _config,
  vuex,
  G,
  units
} from '../common.js';
var Config = _config.qos;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex
        this.initdata(Config);
        this.page = {
          loadok: false,
          qosList: [],
          State: false,
          priorityData: [
            [0, "ids_qos_noLimit"],
            [1, "ids_qos_high"],
            [2, "ids_qos_normal"],
            [3, "ids_qos_low"]
          ],
          PrioritizeType: "",
          PrioritizeTypeData: [
            [0, "ids_auto"],
            [1, "ids_qos_prioritizeType_Webpages"],
            [2, "ids_qos_prioritizeType_Games"],
            [3, "ids_qos_prioritizeType_Video"]
          ],
          listIndex: 0,
          loading: false,
          UserDownBand: '',
          UserUpBand: ''
        };
        this.sdk.get("GetQosSettings", null, (res) => {
          this.formData = res;
          this.formData.qosList = res.QosList;
          this.page.UserUpBand = res.UserUpBand;
          this.page.UserDownBand = res.UserDownBand;
          this.page.State = this.formData.State == 1 ? true : false;
          this.page.PrioritizeType = res.PrioritizeType;
          this.page.qosList = res.QosList;
          this.page.loadok = true;
        })
      },
      switchPrefered() {
        let params = {
          State: this.page.State == true ? 1 : 0,
          UserUpBand: this.page.UserUpBand,
          UserDownBand: this.page.UserDownBand,
          QosList: this.page.qosList[this.page.listIndex],
          PrioritizeType: this.page.PrioritizeType
        }
        this.page.loading = true;
        this.sdk.post("SetQosSettings", params, {
          callback: this.init
        })
      },
      update() {
        let setForm = () => {
          let params = {
            UserUpBand: this.formData.UserUpBand,
            UserDownBand: this.formData.UserDownBand,
            State: this.page.State == true ? 1 : 0,
            QosList: this.page.qosList[this.page.listIndex],
            PrioritizeType: this.page.PrioritizeType
          }
          this.page.loading = true;
          this.sdk.post("SetQosSettings", params, {
            callback: this.init
          })
        }
        this.submit("formData", setForm);
      },
      save(item) {
        this.page.listIndex = item;
        let params = {
            UserUpBand: this.page.UserUpBand,
            UserDownBand: this.page.UserDownBand,
            State: this.page.State == true ? 1 : 0,
            QosList: this.page.qosList[this.page.listIndex],
            PrioritizeType: this.page.PrioritizeType
        }
        this.page.loading = true;
        this.sdk.post("SetQosSettings", params, {
          callback: this.init
        })
      }
    }
}
</script>

<style lang="sass" scoped>
.PrioritizeType {
  margin-bottom: 20px;
}
.deviceInfo {
  margin-bottom: 40px;
}
</style>
