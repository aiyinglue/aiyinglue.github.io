<template lang="jade">
  include ../components.jade
  #userSettings
    +sideMenuPage('Services')    
      +breadcrumb("ids_user_deviceAccess")
      h4 {{vuex.res.ids_user_defaultForNew}}
      +form("page.defaultRight")
        +formItem("ids_user_accessInternet:")
          el-switch(v-model="page.accessInternetRight" @change="setDefaultRight(page.accessInternetRight)" on-text="" off-text="")
        +formItem("ids_user_accessStorage:")(v-show="supportUSBStatus")
          el-switch(v-model="page.accessStorageRight" @change="setDefaultRight(page.accessStorageRight)" on-text="" off-text="")
      h4 {{vuex.res.ids_user_connectDevice}} ({{page.connectedListData.length}})
      div.el-table-div
        table.el-table
          tr
            th {{vuex.res.ids_user_device}}
            th {{vuex.res.ids_user_IP}}
            th {{vuex.res.ids_user_macAdress}}
            th {{vuex.res.ids_user_duration}}
            th {{vuex.res.ids_user_accessInternet}}
            th(v-show="supportUSBStatus") {{vuex.res.ids_user_accessStorage}}
            th {{vuex.res.ids_user_operation}}
          tr(v-for="(list,index) in page.connectedListData")
            td 
              div.device-name
                span {{list.DeviceName}}
                +button("")(icon="edit" size="mini" @click="editDeviceNameDialog(list)")
            td {{list.IPAddress}}
            td {{list.MacAddress}}
            td {{list.AssociationTime | times('2')}}
            td 
              el-switch(v-model="list.exAccessInternetRight" @change="SetConnectedDeviceRight(list,list.exAccessInternetRight)" on-text="" off-text="")
            td(v-show="supportUSBStatus") 
              el-switch(v-model="list.exAccessStorageRight" @change="SetConnectedDeviceRight(list,list.exAccessStorageRight)" on-text="" off-text="")       
            td 
              +button("ids_user_btnBlock")(:disabled="!list.exAllowBlock" size="mini" type="danger" @click="blockEvent(list)")
      h4 {{vuex.res.ids_user_blockedDevice}} ({{page.blockedListData.length}})
      div.el-table-div(v-if="isShowBlockedTable")
        table.el-table
          tr
            th {{vuex.res.ids_user_device}}
            th {{vuex.res.ids_user_macAdress}}
            th {{vuex.res.ids_user_operation}}
          tr(v-for="(list,index) in page.blockedListData")
            td {{list.DeviceName}}
            td {{list.MacAddress}}    
            td 
              +button("ids_user_btnUnblock")(size="mini" @click="unblockEvent(list)")
      el-dialog(:title="vuex.res.ids_user_edit" v-model="page.dialogFormVisible")
        +form("formData")
          +input("ids_user_deviceName:","DeviceName")(:maxlength="32")
          +formBtn()
</template>
<script>
import {_,_config,$,vuex,G} from '../../common.js';
let Config = _config.userSettings;
export default {
  created() {
      this.init();
      this.initdata(Config);
    },
    watch: {
      'vuex.SystemStatus.TotalConnNum' (newValue, oldValue) {
        this.init()
      }
    },
    methods: {
      init() {
        this.supportUSBStatus = _config.homeInternetStatus.pageItem.supportUSBStatus;
        this.isShowBlockedTable = true;
        this.page = {
          accessInternetRight: false,
          accessStorageRight: false,
          dialogFormVisible: false,
          connectedListData: [],
          blockedListData: [],
          defaultRight: {}
        };
        this.sdk.get("GetDeviceDefaultRight", null, (res) => {
          this.page.defaultRight = res;
          this.page.accessInternetRight = this.page.defaultRight.InternetRight == 1 ? true : false;
          this.page.accessStorageRight = this.page.defaultRight.StorageRight == 1 ? true : false;
        });
        this.sdk.get("GetConnectedDeviceList", null, (res) => {
          $.each(res.ConnectedList, function(i, v) {
            $.extend(res.ConnectedList[i], {
              "exAllowBlock": true,
              "exAccessInternetRight": v.InternetRight == 1 ? true : false,
              "exAccessStorageRight": v.StorageRight == 1 ? true : false
            });
            if (v.ConnectMode == G.CONNDEVICE_USB_DEVICE || v.DeviceType == G.CONNDEVICE_LOGINED_DEVICE) {
              $.extend(res.ConnectedList[i], {
                "exAllowBlock": false
              });
            };
          });
          this.page.connectedListData = res.ConnectedList;
        });
        this.sdk.get("GetBlockDeviceList", null, (res) => {
          this.page.blockedListData = res.BlockList;
          if(this.pageItem.hideBlockTableWhenNoData && this.page.blockedListData.length==0){
            this.isShowBlockedTable = false;
          }
        });
      },
      setDefaultRight(currentStatus) {
        let vm = this;
        var _setDefaultRight = function() {
          let results = {
            callback: vm.init
          };
          vm.page.defaultRight.InternetRight = vm.page.accessInternetRight == true ? 1 : 0;
          vm.page.defaultRight.StorageRight = vm.page.accessStorageRight == true ? 1 : 0;
          vm.sdk.post("SetDeviceDefaultRight", vm.page.defaultRight, results);
        }
        if (this.pageItem.AccessDenyWarning && !currentStatus) {
          this.$alert(vuex.res['ids_user_AllAccessDenyWarning'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              if(action=="confirm"){
                _setDefaultRight()
              }else{
                vm.init()
              }
            }
          })
        } else {
          _setDefaultRight()
        }
      },
      SetConnectedDeviceRight(item, currentStatus) {
        let vm = this;
        var _SetConnectedDeviceRight = function() {
          let params = {
            "DeviceName": item.DeviceName,
            "MacAddress": item.MacAddress,
            "InternetRight": item.exAccessInternetRight == true ? 1 : 0,
            "StorageRight": item.exAccessStorageRight == true ? 1 : 0
          }
          let results = {
            callback: vm.init
          };
          vm.sdk.post("SetConnectedDeviceRight", params, results);
        }
        if (this.pageItem.AccessDenyWarning && !currentStatus) {
          this.$alert(vuex.res['ids_user_SingleAccessDenyWarning'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              if(action=="confirm"){
                _SetConnectedDeviceRight()
              }else{
                vm.init()
              }
              
            }
          })
        } else {
          _SetConnectedDeviceRight()
        }
      },
      blockEvent(item) {
        let vm = this;
        var _blockDevice = function() {
          let params = {
            DeviceName: item.DeviceName,
            MacAddress: item.MacAddress
          }
          let results = {
            callback: vm.init
          };
          vm.sdk.post("SetConnectedDeviceBlock", params, results);
        };
        if (this.pageItem.UserBlockWarning) {
          this.$alert(vuex.res['ids_user_BlockWarning'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
              if(action=="confirm"){
                _blockDevice();
              }else{
                vm.init()
              }
            }
          })
        } else {
          _blockDevice();
        }
      },
      unblockEvent(item) {
        let params = {
          DeviceName: item.DeviceName,
          MacAddress: item.MacAddress
        }
        let results = {
          callback: this.init
        };
        this.sdk.post("SetDeviceUnblock", params, results);
      },
      editDeviceNameDialog(item) {
        this.formData = {
          "DeviceName": item.DeviceName,
          "MacAddress": item.MacAddress
        }
        this.page.dialogFormVisible = true;
      },
      update() {
        let results = {
          callback: this.init
        };
        this.sdk.post("SetDeviceName", this.formData, results);
      }
    }
}
</script>


<style lang="sass" scoped>
.device-name{
  span{
    margin-right: 5px;
  }
}
</style>
