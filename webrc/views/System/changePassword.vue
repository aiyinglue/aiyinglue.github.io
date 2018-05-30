<template lang="jade">
  include ../components.jade
  #changePassword
    +sideMenuPage('System')
      +breadcrumb("ids_changePassword_loginPwd")
      +form("formData")
        //-+input("ids_changePassword_userName:","UserName")(disabled)
        +input("ids_changePassword_currPwd:","CurrPassword")(type="password")
        +input("ids_changePassword_newPwd:","NewPassword")(type="password")
        +input("ids_changePassword_confPwd:","ConfirmPassword")(type="password")
        div(v-if="pageItem.changePasswordNote")
          p.tips
            | {{vuex.res.ids_note}}:<br/>        
            | {{vuex.res.ids_changePassword_note1}} {{vuex.res.ids_changePassword_note2}}
        +formBtn()

</template>
<script>
import { _config, vuex, units } from '../../common.js';
//import ElementUI from 'element-ui';
let Config = _config.changePassword;
export default {
  created() {
    this.init();
    this.initdata(Config);
  },
  methods: {
    init() {
      this.page = {
        changeFlag: 0
      }
      this.sdk.get("GetPasswordChangeFlag", null, (res) => {
        this.page.changeFlag = res.change_flag;
      })
    },
    update() {
      let vm = this
      this.submit("formData", () => {
        let results = {
          callback: this.init,
          //success:this.vuex.res.ids_success,
          success: {
            tips: "Message",
            msg: this.vuex.res.ids_success,
            callback() {
              //vm.setPassChangeFlag();
              if (vm.page.changeFlag == 0) {
                vm.$router.push('internetStatus');
              } else {
                vm.reset();
              }

            }
          },
          fail: this.vuex.res.ids_fail,
          e2: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_changePassword_inputCurrPwd'], vuex.res['ids_error'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  //this.init();
                }
              });
            }
          },
          e3: {
            tips: "None",
            callback() {
              vm.$alert(vuex.res['ids_changePassword_changeDefaultPass'], vuex.res['ids_error'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  //this.init();
                }
              });
            }
          }
        };
        let sendPassword = {
          "UserName": this.formData.UserName,
          "CurrPassword": this.formData.CurrPassword,
          "NewPassword": this.formData.NewPassword
        }
        if (_config.pageConfig.IsSupportAuthentication||vuex.PwEncrypt) {
          sendPassword = {
            UserName: units.encrypt(vm.formData.UserName),
            CurrPassword: units.encrypt(vm.formData.CurrPassword),
            NewPassword: units.encrypt(vm.formData.NewPassword)
          }
        }

        this.sdk.post("ChangePassword", sendPassword, results);
        /*this.sdk.post("ChangePassword", sendPassword, (res) => {
          if (this.requestJsonRpcIsOk(res)) {
            ElementUI.Message.success(this.vuex.res.ids_success);
            this.setPassChangeFlag();
          } else {
            if (res.error.code == "010402") {

              this.$alert(vuex.res['ids_changePassword_inputCurrPwd'],vuex.res['ids_error'], {
                confirmButtonText: vuex.res['ids_ok'],
                callback: action => {
                  this.reset();
                }
              });
            }else if(res.error.code=="010401"){
              ElementUI.Message.error("Failed!");
            }else {
              ElementUI.Message.error(this.vuex.res.ids_fail);
            }
          }
        });*/
      })
    },
    /* requestJsonRpcIsOk(result) {
       return result.hasOwnProperty("result") && !result.hasOwnProperty("error");
     },*/
    setPassChangeFlag() {
      let paramt = {
        "change_flag": 1
      }
      this.sdk.post("SetPasswordChangeFlag", paramt, (res) => { })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>