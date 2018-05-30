<template lang="jade">
  include ../components.jade
  #networkSettings
    +sideMenuPage('Settings')
      +breadcrumb("ids_netwrok_Title")
      div(v-loading.body="page.SearchState==1||page.regist_state==1")       
        sim-state
          +form("formData")
            div(v-if="pageItem.IsShowManualSearchMode")
              +radio("ids_networkSearchMode:","NetselectionMode")
            div(v-formLabelIcon="pageItem.NetworkModeHelp")            
              +select("ids_netwrok_netMode:","NetworkMode")
              span(class='iconfont icon-help' v-popover:popover1)
                  el-popover(ref="popover1" placement="bottom" width="200" trigger="click")
                    div {{vuex.res.ids_network_NetworkModeTips}}
            div.btn-wrap
              +button("ids_apply")(type="primary" @click="ConnectedIsDisconnectApply",:disabled="page.SearchState==1||page.regist_state==1")
              +button("ids_netwrok_search")(:disabled="(page.NetworkSettings.NetselectionMode==0||formData.NetselectionMode==0||page.SearchState==1||page.regist_state==1||formData.NetworkMode!=page.NetworkSettings.NetworkMode)" type="primary" @click="ConnectedIsDisconnectRefresh" v-if="pageItem.IsShowManualSearchMode")
              +button("ids_cancel")(@click="init",:disabled="(page.SearchState==1||page.regist_state==1)") 
          div.networkListBox(v-show="page.listNetworkItem!=''")
            table.el-table(cellpadding="0" cellspacing="0")
              tr
                th(width="25%") {{vuex.res.ids_netwrok_networkName}}
                th(width="25%" v-if="pageItem.showListNetType") {{vuex.res.ids_netwrok_networkType}}
                th(width="25%") {{vuex.res.ids_state}}
                th(width="25%")
              tr(v-for="list in page.listNetworkItem" v-show="page.SearchState==2")
                td(width="25%") {{list.FullName}}
                td(width="25%" v-if="pageItem.showListNetType") {{list.Rat | networkRat}}
                td(width="25%") {{list.State | networkState}}
                td(width="25%")
                  +button('ids_netwrok_register')(v-show="list.State==2||list.State==1||pageConfig.supportForbiddenNwRegister" @click="selectEvent(list.NetworkID)")
</template>

<script>
import {
  _,
  _config,
  $,
  vuex,
  G
} from '../../common.js';
var Config = _config.networkSettings
export default {
  created() {
      this.init();
      this.initdata(Config);
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.pageConfig=_config.pageConfig;
        vuex.initSimInfo()
        this.page = {
          actionType: 0, //0:list;1:edit;2:new
          listNetworkItem: [],
          State: "",
          indexs: -1,
          SearchState: '',
          regist_state: 0,
          NetworkSettings: {}
        };
        this.getNetworkSettings();
      },
      getNetworkSettings() {
        this.sdk.get("GetNetworkSettings", null, (res) => {
          $.extend(this.page.NetworkSettings, res)
          this.formData = res;
        });
      },

      initnetlist() {
        let vm = this
        let listStr = "";
        this.sdk.get("SearchNetworkResult", null, (res) => {
          if (vm.pageItem.showListNetType) {
            vm.page.listNetworkItem = res.ListNetworkItem;
          } else {
            vm.page.listNetworkItem = []
            if (res.ListNetworkItem && res.ListNetworkItem.length > 0) {
              _.each(res.ListNetworkItem, function(v, i) {
                if (vm.page.listNetworkItem.length == 0) {
                  vm.page.listNetworkItem.push(v)
                } else {
                  var index = -1;
                  _.each(vm.page.listNetworkItem, function(li, i1) {
                    if (li.mcc === v.mcc && li.mnc === v.mnc) {
                      index = i1
                      return false;
                    }
                  })
                  if (index != -1) {
                    if (v.Rat > vm.page.listNetworkItem[index].Rat && (v.State == 1 || v.State == 2)) {
                      vm.page.listNetworkItem[index] = v
                    }
                  } else {
                    vm.page.listNetworkItem.push(v)
                  }
                }
              })
            }
          }
          this.page.SearchState = res.SearchState;
          if (vm.page.SearchState == G.NETWORK_SEARCH_STATE_SEARCHING) {
            setTimeout(() => {
              vm.initnetlist();
            }, 4000)
          } else {
            this.getNetworkSettings();
          }
        })
      },

      update() {
        let vm = this;
        let params = {
          NetworkMode: this.formData.NetworkMode,
          NetselectionMode: this.formData.NetselectionMode
        }
        this.sdk.post("SetNetworkSettings", params, {
          callback() {
            if (vm.formData.NetselectionMode == 1) {
              vm.refreshEvent()
            } else {
              vm.init()
            }

          }
        })
      },

      refreshEvent() {
        let vm = this
        let results = {
          callback: this.init,
          success: {
            tips: "None",
            callback() {
              vm.initnetlist();
            }
          }
        };
        this.sdk.post("SearchNetwork", "", results);
      },

      getRegisterResult() {
        let vm = this
        this.sdk.get("GetNetworkRegisterState", null, (res) => {
          this.page.regist_state = res.regist_state;
          if (vm.page.regist_state == G.NETWORK_REGISTER_STATE_REGISTERING) {
            setTimeout(() => {
              vm.getRegisterResult();
            }, 4000)
          } else if (vm.page.regist_state == G.NETWORK_REGISTER_STATE_SUCCESSFUL) {
            vm.$message.success(vuex.res.ids_success)
            vm.init()
          } else {
            vm.$message.error(vuex.res.ids_fail)
            vm.init()
          }
        })
      },

      selectEvent(id) {
        let vm = this;
        let params = {
          NetworkID: id
        }
        let results = {
          callback: this.init,
          success: {
            tips: "None",
            callback() {
              vm.page.SearchState = G.NETWORK_SEARCH_STATE_NONE
              vm.page.listNetworkItem = []
              vm.getRegisterResult()
            }
          },
          fail: {
            callback: vm.init
          }
        }
        vm.sdk.post("RegisterNetwork", params, results)
      },

      ConnectedIsDisconnectApply() {
        if (Config.pageItem.ConnectedIsDisconnect) {
          vuex.ConnectionActivePopu(this.update, this.pageConfig.isReconnectFlag);
        } else {
          this.update();
        }
      },

      ConnectedIsDisconnectRefresh() {
        if (Config.pageItem.ConnectedIsDisconnect) {
          vuex.ConnectionActivePopu(this.refreshEvent, this.pageConfig.isReconnectFlag);
        } else {
          this.refreshEvent();
        }
      }
    }
}
</script>

<style lang="sass" scoped>
.btn-wrap {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%
}

.networkListBox {
  margin: 0px auto;
  width: 80%;
  min-height: 250px;
}
</style>
