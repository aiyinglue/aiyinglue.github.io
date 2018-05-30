<template lang="jade">
  include ./components.jade
  #login
    +form("formData")
      div.loginArea
        form(@keyup.enter="update" @submit.prevent)
          div.title {{vuex.res.ids_login_loginPwd}}
          //-+input("username:","UserName")(type="password",;autofocus=true)
          +inputNone("","Password")(type="password",@change="vuex.tipsError=''",:placeholder="vuex.res.ids_login_placeHolder" autofocus=true)
          div.tips-error(v-show="vuex.tipsError!=''") {{vuex.tipsError | res}}
          +formCheckbox("save_flag","ids_login_rememberPassword").paddingVal
          div.btnLogin
            +button("ids_login")(type="primary" @click="update")
          div.forgotPassword(v-if="pageItem.supportForgotPasswordPop" @click="forgotPassEvent") {{vuex.res.ids_login_forgotPassword}}
</template>

<script>
import {
  _,
  $,
  _config,
  vuex,
  units
} from '../common.js'
import _cookie from '../plugin/jquery.cookie.js'
var Config = _config.login;
export default {
  created() {
      this.init()
    },
    props: ['needLoginAgain', 'loginAgainCallback'],
    methods: {
      init() {
        this.vuex = vuex;
        this.pageConfig = _config.pageConfig;
        this.initdata(Config);
        this.number = 7;
        this.initDataEvent();
      },
      update() {
        vuex.gotoHomeRouter = false;
        var vm = this;
        if(this.formData.Password == ""){
          vuex.gotoHomeRouter = true;
          vuex.tipsError = vuex.res.ids_login_requirePassword;
          return false;
        }
        let setLogin = {
          success: {
            tips: "None",
            callback(res) {
              $.cookie("t","1D4B9765B16C3A64AD97489B1610498B"+units.encrypt(String(res.result.token)))
              vuex.initLoginState();
              vm.firstLoginEvent();
              vm.passwordSaveEvent();
            }
          },
          fail: {
            tips: "None",
            callback() {
              vuex.gotoHomeRouter = true;
              vuex.tipsError = vuex.res.ids_required
              vm.getFocus();
            }
          },
          e1: {
            tips: "None",
            callback() {
              vuex.tipsError = vuex.res.ids_login_wrongPwd
              vm.getFocus();
            }
          },
          e2: {
            tips: "None",
            callback() {
              vuex.gotoHomeRouter = true;
              vuex.tipsError = vuex.res.ids_login_otherLogin
              vm.getFocus();
            }
          },
          e3: {
            tips: "None",
            callback() {
              vuex.gotoHomeRouter = true;
              vuex.tipsError = vuex.res.ids_login_timeuseout
              vm.getFocus();
            }
          }
        };
        let loginParams = {
          UserName:vm.formData.UserName,
          Password:vm.formData.Password
        }
        if(_config.pageConfig.IsSupportAuthentication||vuex.PwEncrypt){
          loginParams = {
            UserName:units.encrypt(vm.formData.UserName),
            Password:units.encrypt(vm.formData.Password)
          }
        }
        
        vm.sdk.post("Login", loginParams, setLogin);
      },
      getLoginRouting(){
        let loginRouter = ""
        if(vuex.SimInfo.SIMState == "pinReq" ||vuex.SimInfo.SIMState == "pukReq"){
          loginRouter = this.pageConfig.afterLogInRouting;
        }else{
          loginRouter = vuex.LoginToRouter != "" && vuex.LoginToRouter != null ? vuex.LoginToRouter:"internetStatus";
        }
        return loginRouter
      },
      firstLoginEvent() {
        if (this.needLoginAgain) {
          this.$router.push(this.getLoginRouting())
          this.loginAgainCallback();
        } else {
          this.sdk.get("GetPasswordChangeFlag", null, (res) => {
            if (res.change_flag == 0) {
              this.$confirm(vuex.res['ids_login_changePasswordTips'], vuex.res['ids_login_loginPwd'], {
                confirmButtonText: vuex.res['ids_login_changeNow'],
                cancelButtonText: vuex.res['ids_cancel'],
                showCancelButton: !this.pageItem.ForceChangePassword,
                showClose: !this.pageItem.ForceChangePassword,
                closeOnPressEscape: false,
                closeOnClickModal: false
              }).then(() => {
                this.$router.push('changePassword')
              }).catch(() => {
                //this.$router.push('internetStatus')
                if(vuex.LoginToRouter == "index"){
                  location.reload();
                }else{
                  this.$router.push(this.getLoginRouting())
                }
                
              });
            } else {
              if(vuex.LoginToRouter == "index"){
                location.reload();
              }else{
                let LoginToRouterName = this.getLoginRouting();
                let tempLoginToRouter = {
                  name: LoginToRouterName,
                  params: vuex.LoginToRouterParams
                }
                this.$router.push(tempLoginToRouter)
              }              
            }
          });
        }
      },

      passwordSaveEvent() {
        let obj = {
          _$s_f: this.formData.save_flag,
          _$p: units.uiencrypt(this.formData.Password)
        }
        let str = JSON.stringify(obj);
        $.cookie("obj", str, {
          expires: this.number
        });
      },

      initDataEvent() {
        if (!$.isEmptyObject($.cookie("obj"))) {
          let getObj = {_$s_f:0};
          try{
            getObj= $.parseJSON($.cookie("obj"));
          }catch(err){
            getObj = {_$s_f:0}
          }
          
          if (getObj!=null&getObj._$s_f == 1) {
            this.formData.Password = units.uidecrypt(getObj._$p);
            this.formData.save_flag = getObj._$s_f;
          } else {
            getObj.Password = "";
            this.formData.Password = "";
            this.formData.save_flag = 0;
          }
        }
      },
      getFocus() {
        $("input[type='password']").focus();
        this.formData.Password = "";
      },
      forgotPassEvent() {
        this.$alert(vuex.res['ids_login_forgotPassContentInfo'], ' ', {
          confirmButtonText: vuex.res['ids_ok'],
          callback: action => {
            //vm.reset();
          }
        });
      }
    }
}
</script>

<style lang="sass" scoped>
#login {
  margin: 0 auto;
  max-width: 300px;
}

.el-form {
  width: 895px;
}

</style>
