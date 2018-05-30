<template lang="jade">
  include ../components.jade
  #ipFilter
    +sideMenuPage('Settings')
      +breadcrumb("ids_ipFilter_title")
      +form("formData")
        +select("ids_ipFilter_title:","filter_policy")
        span.add(v-show="(formData.filter_policy==2&&(page.ipFilterAllowlist).length<16)||(formData.filter_policy==1&&(page.ipFilter_list).length<16)")
          +button("")(icon="plus" size="mini" @click="add" type="primary")
        div.el-table-div
          table.el-table(v-show="formData.filter_policy!=0")
            tr
              th {{vuex.res.ids_ipFilter_ipAddress}}
              th {{vuex.res.ids_ipFilter_lanPort}}
              th {{vuex.res.ids_ipFilter_wanIpAddress}}
              th {{vuex.res.ids_ipFilter_wanPort}}
              th {{vuex.res.ids_ipFilter_protocol}}
              th {{vuex.res.ids_ipFilter_operation}}
            tr(v-for="(list,index) in formData.filter_policy==1?page.ipFilter_list:page.ipFilterAllowlist" v-show="formData.filter_policy!=0")
              td {{list.lan_ip}}
              td {{list.lan_port}}
              td {{list.wan_ip}}
              td {{list.wan_port}}
              td 
                span {{list.ip_protocol | valText(formOptions.ip_protocol)}}
              td 
                span
                +button("")(icon="edit" size="mini" @click="editipFilterDialog(index,list)")
                +button("")(icon="delete" size="mini" type="danger" @click="deleteIpFilter(index)")
        +formBtn()
      el-dialog(:title="page.action=='edit'?vuex.res.ids_ipFilter_edit:vuex.res.ids_ipFilter_add" v-model="page.dialog")
        +form("formData")
          div(v-if="page.dialog")
            +input("ids_ipFilter_ipAddress:","lan_ip")
            +input("ids_ipFilter_lanPort:","lan_port")
            +input("ids_ipFilter_wanIpAddress:","wan_ip")
            +input("ids_ipFilter_wanPort:","wan_port")
            +select("ids_ipFilter_protocol:","ip_protocol")
            +formItem("")
              +button("ids_apply")(type="primary" @click="ediApply")
              +button("ids_cancel")(@click="reset")
</template>
<script>
import {_config,_,$,vuex} from '../../common.js';
let Config = _config.ipFilter;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.initdata(Config);
        this.page = {
          ipFilter_list: [],
          ipFilterAllowlist: [],
          dialog: false,
          action: "edit",
          indexs: -1,
          filter_policy: "",
          ip_status: ""

        }
        this.sdk.get("getIPFilterList", null, (res) => {
          this.formData.filter_policy = res.filter_policy;
          this.page.ipFilter_list = res.ipFilter_list;
          this.page.ipFilterAllowlist = res.ipFilterAllowlist;
          this.page.filter_policy = res.filter_policy;
        });
        this.sdk.get("GetLanSettings", null, (res) => {
          _.extend(this.formData, res);
        })
      },
      editipFilterDialog(index, item) {
        //this.$refs.formData.resetFields();
        _.extend(this.formData, item);
        this.page.ip_status = item.ip_status;
        this.page.action = 'edit';
        this.page.indexs = index;
        this.page.dialog = true;
      },
      ediApply() {
        let params = {};
        let vm = this;
        let sameIpFilter = true;
        let setForm = () => {
          if (this.formData.filter_policy == 1) {
            if (this.page.action == 'add') {
              _.each(vm.page.ipFilter_list, (i, v) => {
                if (vm.formData.lan_ip == i.lan_ip && vm.formData.lan_port == i.lan_port && vm.formData.wan_ip == i.wan_ip && vm.formData.wan_port == i.wan_port && (vm.formData.ip_protocol == i.ip_protocol || 3 * vm.formData.ip_protocol < i.ip_protocol)) {
                  sameIpFilter = false;
                  return false;
                }
              })
              if (!sameIpFilter) {
                this.$alert(vuex.res['ids_ipFilter_confirmWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                vm.page.ipFilter_list[vm.page.indexs] = {};
                _.extend(vm.page.ipFilter_list[vm.page.indexs], vm.formData);
              }
            } else {

              $.each(vm.page.ipFilter_list, function(i, v) {
                if (i != vm.page.indexs && vm.formData.lan_ip == v.lan_ip && vm.formData.lan_port == v.lan_port && vm.formData.wan_ip == v.wan_ip && vm.formData.wan_port == v.wan_port && (vm.formData.ip_protocol == v.ip_protocol || 3 * vm.formData.ip_protocol < v.ip_protocol)) {
                  sameIpFilter = false;
                  return false;
                }
              })
              if (!sameIpFilter) {
                this.$alert(vuex.res['ids_ipFilter_confirmWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                vm.page.ipFilter_list[vm.page.indexs] = {};
                _.extend(vm.page.ipFilter_list[vm.page.indexs], vm.formData);
              }
            }
            let params1 = {
              filter_policy: vm.formData.filter_policy,
              ipFilter_list: vm.page.ipFilter_list
            }
            _.extend(params, params1);
          } else {
            if (this.page.action == 'add') {
              _.each(vm.page.ipFilterAllowlist, (i, v) => {
                if (vm.formData.lan_ip == i.lan_ip && vm.formData.lan_port == i.lan_port && vm.formData.wan_ip == i.wan_ip && vm.formData.wan_port == i.wan_port && (vm.formData.ip_protocol == i.ip_protocol || 3 * vm.formData.ip_protocol < i.ip_protocol)) {
                  sameIpFilter = false;
                  return false;
                }
              })
              if (!sameIpFilter) {
                this.$alert(vuex.res['ids_ipFilter_confirmWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                vm.page.ipFilterAllowlist[vm.page.indexs] = {};
                _.extend(vm.page.ipFilterAllowlist[vm.page.indexs], vm.formData);
              }
            } else {
              $.each(vm.page.ipFilterAllowlist, function(i, v) {
                if (i != vm.page.indexs && vm.formData.lan_ip == v.lan_ip && vm.formData.lan_port == v.lan_port && vm.formData.wan_ip == v.wan_ip && vm.formData.wan_port == v.wan_port && (vm.formData.ip_protocol == v.ip_protocol || 3 * vm.formData.ip_protocol < v.ip_protocol)) {
                  sameIpFilter = false;
                  return false;
                }
              })
              if (!sameIpFilter) {
                this.$alert(vuex.res['ids_ipFilter_confirmWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                vm.page.ipFilterAllowlist[vm.page.indexs] = {};
                _.extend(vm.page.ipFilterAllowlist[vm.page.indexs], vm.formData);
              }

            }
            let params1 = {
              filter_policy: vm.formData.filter_policy,
              ipFilter_list: vm.page.ipFilterAllowlist
            }
            _.extend(params, params1);
          }
          this.sdk.post("SetIPFilter", params, {
            callback: this.init
          })
        }

        vm.submit("formData", setForm)
      },
      add() {
        this.page.action = 'add';
        this.formData.lan_ip = "";
        this.formData.lan_port = "";
        this.formData.wan_ip = "";
        this.formData.wan_port = "";
        this.formData.ip_protocol = 6;
        this.formData.ip_status = 1;
        this.page.dialog = true;
        //this.$refs.formData.resetFields();
        if (this.formData.filter_policy == 1) {
          this.page.indexs = this.page.ipFilter_list.length;
        } else {
          this.page.indexs = this.page.ipFilterAllowlist.length;
        }
      },
      deleteIpFilter(index) {
        let vm = this;
        let params = {};
        vm.$confirm(vuex.res['ids_ipFilter_deleteConfirm'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          if (vm.formData.filter_policy == 1) {
            vm.page.ipFilter_list.splice(index, 1);
            let params1 = {
              filter_policy: vm.formData.filter_policy,
              ipFilter_list: vm.page.ipFilter_list
            }
            _.extend(params, params1);
          } else {
            vm.page.ipFilterAllowlist.splice(index, 1);
            let params1 = {
              filter_policy: vm.formData.filter_policy,
              ipFilter_list: vm.page.ipFilterAllowlist
            }
            _.extend(params, params1);
          }
          this.sdk.post("SetIPFilter", params, {
            callback: this.init
          })
        }).catch(() => {
          /*this.init();*/
        });
      },
      update() {
        let vm = this;
        let params = {}
        if (vm.formData.filter_policy == 2) {
          if (vm.page.ipFilterAllowlist.length == 0) {
              vm.$alert(vuex.res['ids_ipFilter_listLengthRule'], vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
            return false;
          }
          let params1 = {
            filter_policy: vm.formData.filter_policy,
            ipFilter_list: vm.page.ipFilterAllowlist
          }
          _.extend(params, params1);

        }
        if (vm.formData.filter_policy == 1) {
          if (vm.page.ipFilter_list.length == 0) {
            vm.$alert(vuex.res['ids_ipFilter_listLengthRule'], vuex.res['ids_confirm'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {
                vm.reset();
              }
            });
            return false;
          }
          let params1 = {
            filter_policy: vm.formData.filter_policy,
            ipFilter_list: vm.page.ipFilter_list
          }
          _.extend(params, params1);
        } else {
          let params1 = {
            filter_policy: vm.formData.filter_policy,
            ipFilter_list: vm.page.ipFilterAllowlist
          }
          _.extend(params, params1);
        }

        this.sdk.post("SetIPFilter", params, {
          callback: this.init
        })
      }
    }
}
</script>
<style lang="sass" scoped>
.el-form{
  width: 721px;
}
.el-form-item{
  width: 550px;
}
span.add {
  float: right;
}
</style>

