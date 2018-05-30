<template lang="jade">
  include ../components.jade
  #macFilter
    +sideMenuPage('Settings')
      +breadcrumb("ids_macFilter_title")
      +form("formData")
        +select("ids_macFilter_title:","filter_policy")
        span(class="add" v-show="(formData.filter_policy==1&&(formData.MacAllowList).length<10)||(formData.filter_policy==2&&(formData.MacDenyList).length<10)")
          +button("")(icon="plus" size="mini" @click="add" type="primary")
        table.el-table(v-show="formData.filter_policy!=0")
          thead
            tr
              th.firstTh {{vuex.res.ids_macFilter_macAdress}}
              th.sencondTh {{vuex.res.ids_macFilter_operation}}
          tbody(v-for="(MacAddress,index) in formData.filter_policy==1?formData.MacAllowList:formData.MacDenyList")
            tr 
              td(v-html="MacAddress")
              td 
                +button("")(icon="edit" size="mini" @click="editMacFilterDialog(MacAddress,index)")
                +button("")(icon="delete" size="mini" type="danger" @click="deleteMacFilter(index)")

        div(v-show="formData.filter_policy==0||(formData.filter_policy==1&&(formData.MacAllowList).length>0)||(formData.filter_policy==2&&(formData.MacDenyList).length>0)")
          +formBtn()
      el-dialog(:title="page.action=='edit'?vuex.res.ids_macFilter_edit:vuex.res.ids_macFilter_add" v-model="page.dialog")
        +form("formData")
          +input("ids_macFilter_macAdress:","Address")
          +formItem("")
            +button("ids_apply")(type="primary" @click="ediApply")
            +button("ids_cancel")(@click="reset")
</template>
<script>
import {_,_config,$,vuex} from '../../common.js';
var Config = _config.macFilter;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.initdata(Config);
        this.page = {
          dialog: false,
          action: "edit",
          indexs: -1,
          filter_policy: ""
        }
        this.sdk.get("GetMacFilterSettings", null, (res) => {
          _.extend(this.formData, res);
          this.page.filter_policy = res.filter_policy;
        })
      },
      editMacFilterDialog(item, index) {
        this.$refs.formData.resetFields();
        this.page.action = 'edit';
        this.formData.Address = item
        this.page.dialog = true;
        this.page.indexs = index;

      },
      ediApply() {
        let vm = this;
        let setForm = () => {
          let Address = this.formData.Address.toLowerCase()
          if (this.formData.filter_policy == 1) {
            if (this.page.action == 'add') {
              if ($.inArray(Address, this.formData.MacAllowList) != -1) {
                this.$alert(vuex.res['ids_macFilter_macAddrNameWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                this.formData.MacAllowList[this.page.indexs] = this.formData.Address
              }
            } else {
              if (this.formData.MacAllowList[this.page.indexs] == Address) {
                this.formData.MacAllowList[this.page.indexs] = this.formData.Address
              } else {
                if ($.inArray(Address, this.formData.MacAllowList) != -1) {
                  this.$alert(vuex.res['ids_macFilter_macAddrNameWarn'], vuex.res['ids_confirm'], {
                    confirmButtonText: vuex.res['ids_ok'],
                    callback: action => {
                      vm.reset();
                    }
                  });
                  return false;
                } else {
                  this.formData.MacAllowList[this.page.indexs] = this.formData.Address
                }
              }
            }
          } else {
            if (this.page.action == 'add') {
              if ($.inArray(Address, this.formData.MacDenyList) != -1) {
                this.$alert(vuex.res['ids_macFilter_macAddrNameWarn'], vuex.res['ids_confirm'], {
                  confirmButtonText: vuex.res['ids_ok'],
                  callback: action => {
                    vm.reset();
                  }
                });
                return false;
              } else {
                this.formData.MacDenyList[this.page.indexs] = this.formData.Address
              }
            } else {
              if (this.formData.MacDenyList[this.page.indexs] == Address) {
                this.formData.MacDenyList[this.page.indexs] = this.formData.Address
              } else {
                if ($.inArray(Address, this.formData.MacDenyList) != -1) {
                  this.$alert(vuex.res['ids_macFilter_macAddrNameWarn'], vuex.res['ids_confirm'], {
                    confirmButtonText: vuex.res['ids_ok'],
                    callback: action => {
                      vm.reset();
                    }
                  });
                  return false;
                } else {
                  this.formData.MacDenyList[this.page.indexs] = this.formData.Address
                }
              }
            }
          }
          let params = {
            filter_policy: this.formData.filter_policy,
            MacDenyList: this.formData.MacDenyList,
            MacAllowList: this.formData.MacAllowList
          }
          this.sdk.post("SetMacFilterSettings", params, {
            callback: this.init
          })
        }

        this.submit("formData", setForm)
      },

      add() {
        this.page.action = 'add';
        this.formData.Address = ""
        this.page.dialog = true;
        this.$refs.formData.resetFields();
        if (this.formData.filter_policy == 1) {
          this.page.indexs = this.formData.MacAllowList.length;
        } else {
          this.page.indexs = this.formData.MacDenyList.length;
        }

      },
      deleteMacFilter(index) {
        this.$confirm(vuex.res['ids_macFilter_deleteConfirm'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          if (this.formData.filter_policy == 1) {
            this.formData.MacAllowList.splice(index, 1);
          } else {
            this.formData.MacDenyList.splice(index, 1);
          }
          let params = {
            filter_policy: this.page.filter_policy,
            MacAllowList: this.formData.MacAllowList,
            MacDenyList: this.formData.MacDenyList
          }
          this.sdk.post("SetMacFilterSettings", params, {
            callback: this.init
          })
        }).catch(() => {
          /*this.init();*/
        });

      },
      update() {
        let params = {
          filter_policy: this.formData.filter_policy,
          MacAllowList: this.formData.MacAllowList,
          MacDenyList: this.formData.MacDenyList
        }
        this.sdk.post("SetMacFilterSettings", params, {
          callback: this.init
        })
      }

    }
}
</script>
<style lang="sass" scoped>
span {
  float: right;
}
</style>
