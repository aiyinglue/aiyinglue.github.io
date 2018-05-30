<template lang="jade">
  include ../components.jade
  #smsForwarding
    +sideMenuPage('Services')
      +breadcrumb("ids_smsForwarding_smsForwarding")
      sim-state
        +form("formData")
          +formItem("ids_smsForwarding_autoForward:")
            el-switch(v-model="page.redirectFlag" on-text="" off-text="")
          +input("ids_smsForwarding_recipient:","redirect_number")(:disabled="!page.redirectFlag")
            div.tips-error(:class="{hidden:page.redirectNumberRuleHidden}") {{vuex.res.ids_smsForwarding_redirectNumberRule}}
          //-+formBtn()
          +formItem("")
            +button("ids_apply")(type="primary" @click="update" )
            +button("ids_cancel")(type="primary" @click="reset")
</template>

<script>
import {_config,$,vuex,units} from '../../common.js';
import sms from '../../config/sms.js';
let Config = _config.smsForwarding;
export default {
  created() {
      this.init();
    },
    methods: {
      init() {
        this.initdata(Config);
        this.page = {
          redirectFlag: true,
          redirectNumberRuleHidden: true,
          apiData: {}
        };
        this.sdk.get("getSMSAutoRedirectSetting", null, (res) => {
          $.extend(this.formData, res);
          this.page.apiData = res;
          this.page.redirectFlag = this.formData.redirect_flag == 1 ? true : false;
        });
      },
      update() {
        let vm=this;
        vm.formData.redirect_flag = vm.page.redirectFlag == true ? 1 : 0;
        vm.formData.SMSTime = units.getSystemTime();
        let results = {
          callback: vm.init
        };
        if (vm.pageItem.smsForwardingOpen) {
          if (vm.formData.redirect_flag == 1) {
            if (sms.recipientNumberRule(vm.formData.redirect_number)) {
              if(Config.pageItem.eeCustom){
                vm.$alert(vuex.res['ids_smsForwarding_openPropt'].replace("000", vm.formData.redirect_number), {
                  showConfirmButton: false
                });
              }
              vm.sdk.post("setSMSAutoRedirectSetting", vm.formData, results);
              if(this.$route.name=="index"){
                vuex.displayRedirect=false;
              }
            } else {
              vm.page.redirectNumberRuleHidden = false;
            }
          } else {
            vm.page.redirectNumberRuleHidden = true;
            vm.formData.redirect_number = vm.page.apiData.redirect_number;
            vm.sdk.post("setSMSAutoRedirectSetting", vm.formData, results);
            if(this.$route.name=="index"){
              vuex.displayRedirect=false;
            }
          }

        }
      }
    }
}
</script>

<style lang="sass" scoped>
.hidden {
  display: none;
}
</style>