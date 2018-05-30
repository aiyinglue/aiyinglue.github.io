<template lang="jade">
  include ../components.jade
  #ipFilter
    +sideMenuPage('Settings')
      +breadcrumb("ids_parentalControl_title")
      +form("formData")
        +formItem("ids_parentalControl_deviceUnder:")(label-width="300px")
          el-switch(v-model="page.Control_policy" @change="Switch()" on-text="" off-text="")
        span.add
          +button("")(icon="plus" size="mini" @click="add" type="primary")
        div.el-table-div
          table.el-table
            tr
              th {{vuex.res.ids_parentalControl_id}}
              th {{vuex.res.ids_parentalControl_devicename}}
              th {{vuex.res.ids_parentalControl_macaddress}}
              th {{vuex.res.ids_parentalControl_url}}
              th {{vuex.res.ids_parentalControl_time}}
              th {{vuex.res.ids_parentalControl_status}}
              th {{vuex.res.ids_parentalControl_operation}}
            tr(v-for="(val,row) in page.ParentalControl_list")
              td(v-html="row+1")
              td(v-html="val.device_name")
              td(v-html="val.mac_address")
              td(v-html="val.url")
              td {{val.forbidden_Starttime}}-{{val.forbidden_Endtime}}
              td(:label="val.exControl_status") 
                el-switch(v-model="val.exControl_status" @change="SwitchDevice(row,val)" on-text="" off-text="")
              td 
                +button("")(icon="edit" size="mini" @click="edit(row,val)")
                +button("")(icon="delete" size="mini" type="danger" @click="deleted(row)")
        div.tips {{vuex.res.ids_note}}:<br />{{vuex.res.ids_parentalControl_notetips1}}<br />{{vuex.res.ids_parentalControl_notetips2}}
      el-dialog(:title="page.action=='edit'?vuex.res.ids_parentalControl_edit:vuex.res.ids_parentalControl_add" v-model="page.dialog")
        +form("formData")
          div(v-if="page.dialog")
            +formItem("ids_parentalControl_devicelist:")(v-show="page.action=='add'")
              el-select(v-model.mumber="page.currentlistId" ,:placeholder="vuex.res.ids_parentalControl_select" @change="changeConnectedDevice()")
                el-option(v-for="val in page.ConnectedDeviceList", :label="val.DeviceName" v-show="val.DeviceName!=''",:value.number="val.id")
                el-option(:label="vuex.res.ids_parentalControl_other",:value.number="page.ConnectedDeviceListlength+1")
            +input("ids_parentalControl_devicename:","device_name")(:disabled="page.currentlistId!=page.ConnectedDeviceListlength+1&&page.action!='edit'")
            +input("ids_parentalControl_macaddress:","mac_address")(:disabled="page.currentlistId!=page.ConnectedDeviceListlength+1&&page.action!='edit'")
            +input("ids_parentalControl_url:","url")
            p 
              span {{vuex.res.ids_parentalControl_URLaddressNote}}
            +select("ids_parentalControl_status:","Control_status")
            div.forbiddenTime 
              .el-form-item__label {{vuex.res.ids_parentalControl_time}}:
              el-time-select(class="el-time-select",:placeholder="vuex.res.ids_parentalControl_startime" v-model="formData.forbidden_Starttime" ,:editable="false",:picker-options="{start: '00:00',step: '0:30',end: '23:30'}")
              el-time-select(class="el-time-select",:placeholder="vuex.res.ids_parentalControl_endtime" v-model="formData.forbidden_Endtime" ,:editable="false",:picker-options="{start: '00:00',step: '0:30',end: '24:00',minTime: formData.forbidden_Starttime}")
            +formBtn()
</template>
<script>
import {_config,_,$,vuex} from '../../common.js';
let Config = _config.parentalControl;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.initdata(Config);
        this.page = {
          Control_policy: "",
          ParentalControl_list: [],
          dialog: false,
          action: "",
          indexs: -1,
          ConnectedDeviceList: [],
          currentlistId: "",
          ConnectedDeviceListlength: ""

        }
        this.sdk.get("GetParentalSettings", null, (res) => {
          $.each(res.ParentalControl_list, function(i, v) {
            $.extend(res.ParentalControl_list[i], {
              "exControl_status": v.Control_status == 1 ? true : false
            });
          });
          this.page.ParentalControl_list = res.ParentalControl_list;
          this.page.Control_policy = res.Control_policy == 1 ? true : false;
        });
        this.sdk.get("GetConnectedDeviceList", null, (res) => {
          this.page.ConnectedDeviceList = res.ConnectedList
          this.page.ConnectedDeviceListlength = res.ConnectedList.length;
        });
      },
      changeConnectedDevice() {
        let vm = this;
        vm.$refs.formData.resetFields()
        let ConnectedDeviceList = $.grep(vm.page.ConnectedDeviceList, function(n, i) {
          return n.id === vm.page.currentlistId;
        })[0];
        if (ConnectedDeviceList != undefined) {
          vm.formData.device_name = ConnectedDeviceList.DeviceName;
          vm.formData.mac_address = ConnectedDeviceList.MacAddress;
        }

      },
      edit(index, item) {
        this.$refs.formData.resetFields();
        _.extend(this.formData, item);
        this.page.action = 'edit';
        this.page.indexs = index;
        this.page.dialog = true;
      },
      update() {
        let params = {};
        let vm = this;
        let sameMacAddress = true;
        let setForm = () => {
          if (this.page.action == 'add') {
            _.each(vm.page.ParentalControl_list, (i, v) => {
              if (vm.formData.mac_address == i.mac_address && vm.formData.url == i.url) {
                sameMacAddress = false;
                return false;
              }
            })
            if (!sameMacAddress) {
              this.$alert(vuex.res['ids_parentalControl_macWarn'], vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
              return false;
            } else {
              vm.page.ParentalControl_list[vm.page.indexs] = {};
              _.extend(vm.page.ParentalControl_list[vm.page.indexs], vm.formData);

              if (vm.formData.forbidden_Starttime == undefined || vm.formData.forbidden_Starttime == '') {
                vm.page.ParentalControl_list[vm.page.indexs].forbidden_Starttime = "00:00";
              }
              if (vm.formData.forbidden_Endtime == undefined || vm.formData.forbidden_Endtime == '') {
                vm.page.ParentalControl_list[vm.page.indexs].forbidden_Endtime = "00:00";
              }
            }
          } else {
            $.each(vm.page.ParentalControl_list, function(i, v) {
              if (i != vm.page.indexs && vm.formData.mac_address == v.mac_address && vm.formData.url == v.url) {
                sameMacAddress = false;
                return false;
              }
            })
            if (!sameMacAddress) {
              this.$alert(vuex.res['ids_parentalControl_macWarn'], vuex.res['ids_confirm'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  vm.reset();
                }
              });
              return false;
            } else {
              vm.page.ParentalControl_list[vm.page.indexs] = {};
              _.extend(vm.page.ParentalControl_list[vm.page.indexs], vm.formData);
              if (vm.formData.forbidden_Starttime == undefined || vm.formData.forbidden_Starttime == '') {
                vm.page.ParentalControl_list[vm.page.indexs].forbidden_Starttime = "00:00";
              }
              if (vm.formData.forbidden_Endtime == undefined || vm.formData.forbidden_Endtime == '') {
                vm.page.ParentalControl_list[vm.page.indexs].forbidden_Endtime = "00:00";
              }
            }
          }
          let params1 = {
            Control_policy: this.page.Control_policy == true ? 1 : 0,
            ParentalControl_list: vm.page.ParentalControl_list
          }
          _.extend(params, params1);
          this.sdk.post("SetParentalSettings", params, {
            callback: this.init
          })
        }
        vm.submit("formData", setForm)
      },
      add() {
        this.formData = {
          url: "",
          forbidden_Starttime: "",
          forbidden_Endtime: "",
          device_name: "",
          mac_address: "",
          Control_status: 0
        }
        this.page.currentlistId = '';
        this.page.action = 'add';
        this.page.dialog = true;
        this.$refs.formData.resetFields();
        this.page.indexs = this.page.ParentalControl_list.length;
      },
      deleted(index) {
        let vm = this;
        let params = {};
        vm.$confirm(vuex.res['ids_parentalControl_deleteConfirm'], vuex.res['ids_confirm'], {
          confirmButtonText: vuex.res['ids_delete'],
          cancelButtonText: vuex.res['ids_cancel'],
          type: 'warning'
        }).then(() => {
          vm.page.ParentalControl_list.splice(index, 1);
          let params1 = {
            Control_policy: vm.page.Control_policy == true ? 1 : 0,
            ParentalControl_list: vm.page.ParentalControl_list
          }
          _.extend(params, params1);

          this.sdk.post("SetParentalSettings", params, {
            callback: this.init
          })
        }).catch(() => {

        });
      },
      Switch() {
        let results = {
          callback: this.init
        };
        let params = {
          Control_policy: this.page.Control_policy == true ? 1 : 0,
          ParentalControl_list: this.page.ParentalControl_list
        }
        this.sdk.post("SetParentalSettings", params, results)
      },
      SwitchDevice(indexs, item) {
        let vm = this
        let params1 = {
          "Control_status": item.exControl_status == true ? 1 : 0,
        }
        _.extend(vm.page.ParentalControl_list[indexs], params1);
        _.extend(vm.page.ParentalControl_list, vm.page.ParentalControl_list[indexs]);
        let params = {
          Control_policy: vm.page.Control_policy == true ? 1 : 0,
          ParentalControl_list: vm.page.ParentalControl_list
        }
        let results = {
          callback: this.init
        };
        this.sdk.post("SetParentalSettings", params, results);

      },
    }
}
</script>
<style lang="sass" scoped>
.el-form {
  width: 721px;
}
div.forbiddenTime{
  margin:0 0 22px 26px;
}
div .el-time-select{
  position: relative;
  width: 123px;
  display: inline-block;
}
p{
  width: 280px;
  margin: -16px 0 22px 200px;
}
span.add {
  float: right;
}
</style>

