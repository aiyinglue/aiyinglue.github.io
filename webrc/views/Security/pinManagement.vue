<template lang="jade">
  include ../components.jade
  #pinManagement
    +sideMenuPage('Settings')
      +breadcrumb("ids_pinManagement_pinManagement")
      sim-state
        //-div(style="width: 100%" v-loading.body="page.fullscreenLoading" element-loading-text="")
        div(v-if="vuex.SimInfo.PinState==2&&page.GetSimStatusOK")
          +form("formData")(v-loading.body="page.fullscreenLoading")
            form(@keyup.enter="ChangePinState" @submit.prevent)
              +formItem("ids_pinManagement_pinStatus:")(v-if="!pageItem.isShowPinStatus")
                el-switch(v-model="page.PinState" @change="disconnectDialingToOperationSwitch()" on-text="" off-text="")
              +formItem("ids_sim_pinDeactivated")(v-if="pageItem.isShowPinStatus")
                el-switch(v-model="page.PinState" @change="disconnectDialingToOperationSwitch()" on-text="" off-text="")
                span.right-switch-text {{vuex.res.ids_sim_pinActivated}}
              +formItem("")(v-if="page.PinState")
                +button("ids_pinManagement_changePin")(type="primary" @click="disconnectDialingToChangePinPop()")
              div(v-if="page.enablepin==1&&!page.PinState")
                +input("ids_pinManagement_pinCode:","DisPin")(type="password")
                +text("ids_pinManagement_remaining:","{{vuex.SimInfo.PinRemainingTimes}}")
                +formItem("")
                  +button("ids_apply")(type="primary" @click="ChangePinState",:disabled="page.btn")
                  +button("ids_cancel")(@click="reset")
          el-dialog(:title="vuex.res.ids_pinManagement_changePin" v-model="page.ChangePinState")
            +form("formData")(ref="formData2")
              div(v-if="page.ChangePinState")
                +input("ids_pinManagement_oldPinCode:","CurrentPin")(type="password")
                +input("ids_pinManagement_newPinCode :","NewPin")(type="password")
                +input("ids_pinManagement_confirmPINCode :","ConfirmPin")(type="password")
                +text("ids_pinManagement_remaining:","{{vuex.SimInfo.PinRemainingTimes}}")
                +formItem("")
                  +button("ids_apply")(type="primary" @click="ChangePinCode('formData2')")
                  +button("ids_cancel")(@click="reset")
        div(v-if="vuex.SimInfo.PinState==3&&page.GetSimStatusOK")
          +form("formData")(v-loading.body="page.fullscreenLoading1")
            form(@keyup.enter="ChangePinState" @submit.prevent)
              +formItem("ids_pinManagement_pinStatus:")(v-if="!pageItem.isShowPinStatus")
                el-switch(v-model="page.PinState" @change="disconnectDialingToOperationSwitch()" on-text="" off-text="")
              +formItem("ids_sim_pinDeactivated")(v-if="pageItem.isShowPinStatus")
                el-switch(v-model="page.PinState" @change="disconnectDialingToOperationSwitch()" on-text="" off-text="")
                span.right-switch-text {{vuex.res.ids_sim_pinActivated}}
              div(v-if="page.disablepin==1&&page.PinState")
                +input("ids_pinManagement_pinCode:","Pin")(type="password")
                +checkbox("","AutoValidatePinState","ids_pinManagement_autoValidation")
                +text("ids_pinManagement_remaining:","{{vuex.SimInfo.PinRemainingTimes}}")
                +formItem("")
                  +button("ids_apply")(type="primary" @click="ChangePinState",:disabled="page.btn")
                  +button("ids_cancel")(@click="reset")
</template>
<script>
import { $, vuex, _, _config } from '../../common.js';
let Config = _config.pinManagement
export default {
  created() {
    this.init()
    //this.initdata(Config)
  },
  methods: {
    init() {
      this.vuex = vuex
      this.initdata(Config)
      vuex.initSimInfo()
      this.page = {
        GetSimStatusOK: false,
        PinState: true,
        ChangePinState: false,
        enablepin: "",
        disablepin: "",
        btn: false,
        fullscreenLoading: false,
        fullscreenLoading1: false
        //AutoValidatePinStates: {},
        //AutoValidatePinStatesstr: false,
      }
      this.sdk.get("GetAutoValidatePinState", null, (res) => {
        this.formData.AutoValidatePinState = res.State;
      })
      this.sdk.get("GetSimStatus", null, (res) => {
        if (res.PinState == 2) {
          this.page.PinState = true;
        }
        if (res.PinState == 3) {
          this.page.PinState = false;
        }
        this.page.GetSimStatusOK = true;
      })

    },
    switchpinstate() {
      if (this.page.PinState) {
        this.page.disablepin = 1;
        this.formData.State = 1;
      } else {
        this.page.enablepin = 1;
        this.formData.State = 0;
      }
    },
    ChangePinState() {
      let vm = this;
      vm.page.btn = true;
      setTimeout(function () {
        vm.page.btn = false;
      }, 200)
      if (vuex.SimInfo.PinState == 2) {
        vm.page.fullscreenLoading1 = false;
        vm.page.fullscreenLoading = true;
        let postData = {
          Pin: this.formData.DisPin,
          State: this.formData.State,
        }
        this.submit("formData", () => {
          var vm = this;
          let result = {
            success: {
              tips: "Message",
              callback() {
                vm.$refs.formData.resetFields()
                vm.init();
                vm.initdata(Config);
                vm.$refs["formData"].resetFields()
                setTimeout(function () {
                  vm.page.fullscreenLoading = false;
                  //vm.init();
                  //vm.initdata(Config);
                }, 3000) 
              }
            },
            fail: {
              callback() {
                vm.page.fullscreenLoading = true;
                vm.failReset();
              }
            }

          }
          this.sdk.post("ChangePinState", postData, result)
        })
      } else if (vuex.SimInfo.PinState == 3) {
        vm.page.fullscreenLoading = false;
        vm.page.fullscreenLoading1 = true;
        let postData = {
          Pin: this.formData.Pin,
          State: this.formData.State,
        }
        let postData1 = {
          Pin: this.formData.Pin,
          State: this.formData.AutoValidatePinState
        }
        this.submit("formData", () => {
          var vm = this;
          let result = {
            success: {
              tips: "None",
              callback() {
                vm.sdk.post("SetAutoValidatePinState", postData1, {
                  callback() {
                    vm.init();
                    vm.initdata(Config);
                    vm.$refs["formData"].resetFields()
                    setTimeout(function () {
                      vm.page.fullscreenLoading1 = false;
                      //vm.init();
                      // vm.initdata(Config);
                    }, 3000) 
                  }
                })
              }
            },
            fail: {
              callback() {
                vm.page.fullscreenLoading1 = true;
                vm.failReset();
              }
            }
          }
          this.sdk.post("ChangePinState", postData, result)
        })
      }
    },
    ChangePinCode(formName) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = {
            //State: vm.formData.Operation,
            NewPin: vm.formData.NewPin,
            CurrentPin: vm.formData.CurrentPin
          }
          vm.sdk.post("ChangePinCode", postData, {
            callback() {
              vm.init();
              vm.initdata(Config)
              vm.$refs[formName].resetFields()
            }
          })
        } else {
          return false;
        }
      });

    },
    failReset() {
      var vm = this;
      vm.init();
      vm.$refs["formData"].resetFields();
    },
    changePinPop() {
      this.page.ChangePinState = true
    },
    cancelEvent() {
      location.reload();
    },
    disconnectDialingToChangePinPop() {
      if (Config.pageItem.disconnectDialing) {
        vuex.ConnectionActivePopu(this.changePinPop);
      } else {
        this.changePinPop();
      }
    },
    disconnectDialingToOperationSwitch() {
      if (Config.pageItem.disconnectDialing) {
        vuex.ConnectionActivePopu(this.switchpinstate, false, this.cancelEvent);
      } else {
        this.switchpinstate();
      }
    }

  }
}
</script>

<style lang="sass" scoped>
</style>