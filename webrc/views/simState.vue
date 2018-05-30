<template lang="jade">
  include ./components.jade
  #simState
    //-div(v-loading.body="page.fullscreenLoading" element-loading-text="")
    div.sim-state(v-if="vuex.SimInfo.SIMState=='pinReq'")
      h2.center {{vuex.SimInfo.SIMStateStr|res}}
      +form("formData")(v-loading.body="page.fullscreenLoading")
        form(@keyup.enter="UnlockPin" @submit.prevent)
          +input('ids_sim_pinCode:','Pin')(type="password")
          +checkbox("","AutoValidatePinState","ids_pinManagement_autoValidation")
          +formItem("")
            div.el-text  {{vuex.res.ids_sim_remainTime}}: {{vuex.SimInfo.PinRemainingTimes}}
          +formItem("")
            +button("ids_apply")(type="primary" @click="UnlockPin")
            +button("ids_cancel")(@click="$refs.formData.resetFields()")

    div.sim-state(v-if="vuex.SimInfo.SIMState=='pukReq'")
      h2.center {{vuex.SimInfo.SIMStateStr|res}}
      +form("formData")(v-loading.body="page.fullscreenLoading")
        form(@keyup.enter="UnlockPuk" @submit.prevent)
          +input("ids_sim_pukCode:","Puk")(type="password")
          +input('ids_sim_newPinCode:','NewPin')(type="password")
          +input('ids_sim_confirmPINCode:','ConfirmPin')(type="password")
          +formItem("")
            div.el-text  {{vuex.res.ids_sim_remainTime}}: {{vuex.SimInfo.PukRemainingTimes}}
          +formItem("")
            +button("ids_apply")(type="primary" @click="UnlockPuk")
            +button("ids_cancel")(@click="$refs.formData.resetFields()")

    div.sim-state(v-if="vuex.SimInfo.SIMState=='simLock'")
      h2.center {{vuex.SimInfo.SIMStateStr |res}}
      +form("formData")(v-loading.body="page.fullscreenLoading")
        form(@keyup.enter="UnlockSimLock" @submit.prevent)
          +input('ids_sim_simlockCode:','SIMLockCode')(type="password",:maxlength="10")
          +formItem("")
            div.el-text  {{vuex.res.ids_sim_remainTime}}: {{vuex.SimInfo.SIMLockRemainingTimes}}
          +formItem("")
            +button("ids_apply")(type="primary" @click="UnlockSimLock")
            +button("ids_cancel")(@click="$refs.formData.resetFields()")

    slot(v-if="vuex.SimInfo.SIMState=='ready'")

    div(v-if="vuex.SimInfo.SIMState!='pinReq'&vuex.SimInfo.SIMState!='pukReq'&vuex.SimInfo.SIMState!='simLock'&vuex.SimInfo.SIMState!='ready'")
      h2.center {{vuex.SimInfo.SIMStateStr|res}}

    
</template>
<script>
import _config from '../config.js'
import vuex from '../vuex.js';
let Config = _config.simState;
export default {
  created() {
      this.initdata(Config);
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.page = {
          fullscreenLoading: false
        }
        vuex.initSimInfo();
        this.sdk.get("GetAutoValidatePinState", null, (res) => {
          this.formData.AutoValidatePinState = res.State;
        })
      },
      failReset(){
        var vm = this;
        vm.init();
        vm.$refs["formData"].resetFields();
      },
      UnlockPin() {
        let postData = {
          Pin: this.formData.Pin,
          State: this.formData.AutoValidatePinState
        }
        this.submit("formData", () => {
          var vm = this;
          let result = {
            success: {
              tips: "Message",
              callback() {
                vm.page.fullscreenLoading = true;
                vm.$refs.formData.resetFields()
                setTimeout(function() {
                  vm.page.fullscreenLoading = false;
                  vm.successCallback();
                }, 3000)
              }
            },
            fail:{
              callback() {
                vm.page.fullscreenLoading = true;
                vm.sdk.get("GetSimStatus", null, (res) => {
                  if(res.SIMState!=="pinReq"){
                    setTimeout(function(){
                      location.reload()
                    },500)
                  }else{
                    vm.failReset();
                  }
                  
                })
                
              }
            }
            
          }
          this.sdk.post("SetAutoValidatePinState", postData, result)
        })
      },
      UnlockPuk() {
        let postData = {
          Pin: this.formData.NewPin,
          Puk: this.formData.Puk
        }
        this.submit("formData", () => {
          var vm = this;
          let result = {
            callback() {
              vm.page.fullscreenLoading = true;
              vm.$refs.formData.resetFields()
              setTimeout(function() {
                vm.page.fullscreenLoading = false;
                vm.successCallback()
              }, 3000)
            },
            fail:{
              callback() {
                vm.failReset();
              }
            }
          }
          this.sdk.post("UnlockPuk", postData, result)
        })
      },
      UnlockSimLock() {
        this.formData.SIMLockState = vuex.SimInfo.SIMLockState;
        this.submit("formData", () => {
          var vm = this;
          let result = {
            callback() {
              vm.page.fullscreenLoading = true;
              vm.$refs.formData.resetFields()
              setTimeout(function() {
                vm.page.fullscreenLoading = false;
                vm.successCallback()
              }, 3000)
            },
            fail:{
              callback() {
                vm.failReset();
              }
            }
          }
          this.sdk.post("UnlockSimlock", vm.formData, result)
        })
      },
      successCallback() {
        let vm = this;
        if(vm.$route.params.callbackRoute && Config.pageItem.isCallbackRouter){
          vm.$router.push(vm.$route.params.callbackRoute);
        }else{
          vm.init();
        }    
      }
    }
}
</script>
<style lang="sass" scoped>
</style>