<template lang="jade">
  include ../components.jade
  #staticRules
    +form("formData")
      +formItem("ids_routingRules_staticRouting:")
        el-switch(v-model="page.state" @change="update()" on-text="" off-text="")
      span.add
        +button("")(icon="plus" size="mini" @click="add" type="primary")
      div.el-table-div
        table.el-table
          tr
            th {{vuex.res.ids_routingRules_index}}
            th {{vuex.res.ids_routingRules_desIp}}
            th {{vuex.res.ids_routingRules_subnetMark}}
            th {{vuex.res.ids_routingRules_rounterIp}}
            th {{vuex.res.ids_routingRules_operation}}
          tr(v-for="(list,index) in page.StaticRoutingList")
            td {{index+1}}
            td {{list.DestNetAddr}}
            td {{list.DestNetmask}}
            td {{list.GateWay}}
            td 
              span
              +button("")(icon="edit" size="mini" @click="editipFilterDialog(index,list)")
              +button("")(icon="delete" size="mini" type="danger" @click="deleteIpFilter(index)")
    el-dialog(:title="page.action=='edit'?vuex.res.ids_routingRules_edit:vuex.res.ids_routingRules_add" v-model="page.dialog")
      +form("formData")
        div(v-if="page.dialog")
          +input("ids_routingRules_desIp:","DestNetAddr")
          +input("ids_routingRules_subnetMark:","DestNetmask")
          +input("ids_routingRules_rounterIp:","GateWay")
          +formItem("")
            +button("ids_apply")(type="primary" @click="ediApply")
            +button("ids_cancel")(@click="reset")
</template>
<script>
import {$,_,_config,vuex} from '../../common.js';
let Config = _config.staticRules;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.initdata(Config);
        this.page = {
          state: "",
          StaticRoutingList: [],
          dialog: false,
          action: "edit",
          indexs: -1
        }
        this.sdk.get("GetStaticRouting", null, (res) => {
          this.page.StaticRoutingList = res.StaticRoutingList;
          this.page.state = res.State == 1 ? true : false;
        })
      },
      editipFilterDialog(index, item) {
        _.extend(this.formData, item);
        this.page.action = 'edit';
        this.page.indexs = index;
        this.page.dialog = true;
      },
      ediApply() {
        let vm = this;
        let sameIpFilter = true;
        let setForm = () => {
          if (this.page.action == 'add') {
            _.each(vm.page.StaticRoutingList, (i, v) => {
              if (vm.formData.DestNetAddr == i.DestNetAddr && vm.formData.DestNetmask == i.DestNetmask && vm.formData.GateWay == i.GateWay) {
                sameIpFilter = false;
                return false;
              }
            })
            if (!sameIpFilter) {
              this.$alert(vuex.res['ids_routingRules_desIpInvalid'], vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
              return false;
            } else {
              vm.page.StaticRoutingList[vm.page.indexs] = {};
              _.extend(vm.page.StaticRoutingList[vm.page.indexs], vm.formData);
            }
          } else {
            _.each(vm.page.StaticRoutingList, (i, v) => {
              if (v != vm.page.indexs && vm.formData.DestNetAddr == i.DestNetAddr && vm.formData.DestNetmask == i.DestNetmask && vm.formData.GateWay == i.GateWay) {
                sameIpFilter = false;
                return false;
              }
            })
            if (!sameIpFilter) {
              this.$alert(vuex.res['ids_routingRules_desIpInvalid'], vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
              return false;
            } else {
              vm.page.StaticRoutingList[vm.page.indexs] = {};
              _.extend(vm.page.StaticRoutingList[vm.page.indexs], vm.formData);
            }
          }
          let params = {
            State: vm.page.state == true ? 1 : 0,
            StaticRoutingList: vm.page.StaticRoutingList
          }
          this.sdk.post("SetStaticRouting", params, {
            callback: this.init
          })
        }

        this.submit("formData", setForm)
      },
      add() {
        this.page.action = 'add';
        this.formData = {
          DestNetAddr: "",
          DestNetmask: "",
          GateWay: ""
        }
        this.page.dialog = true;
        this.page.indexs = this.page.StaticRoutingList.length;
      },
      deleteIpFilter(index) {
        this.$confirm(vuex.res['ids_routingRules_deleteConfirm'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          this.page.StaticRoutingList.splice(index, 1);
          let params = {
            State: this.page.state == true ? 1 : 0,
            StaticRoutingList: this.page.StaticRoutingList
          }
          this.sdk.post("SetStaticRouting", params, {
            callback: this.init
          })
        }).catch(() => {
          /*this.init();*/
        });
      },
      update() {
        let results = {
          callback: this.init
        };
        let params = {
          State: this.page.state == true ? 1 : 0,
          StaticRoutingList: this.page.StaticRoutingList
        }
        this.sdk.post("SetStaticRouting", params, results)
      }
    }
}
</script>
<style lang="sass" scoped>
.el-form {
  width: 721px;
}

span.add {
  float: right;
}
</style>
