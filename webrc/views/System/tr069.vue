<template lang="jade">
  include ../components.jade
  #TR069
    +sideMenuPage('System')
      +breadcrumb("ids_title_tr069")
      +form("formData")
        +formItem("ids_tr069_stateSwich:")
          el-switch(v-model="page.State" @change="changeState()" on-text="" off-text="")
        +formItem("ids_tr069_inform:")
          el-switch(v-model="page.Inform" @change="changeInform()" on-text="" off-text="",:disabled="formData.State==0")
        +input("ids_tr069_informInterval:","InformInterval")(:disabled="formData.Inform==0||formData.State==0")
        +input("ids_tr069_acsUrl:","AcsUrl")(:disabled="formData.State==0")
        +input("ids_tr069_acsUsername:","AcsUserName")(:disabled="formData.State==0")
        +input("ids_tr069_acsPw:","AcsUserPassword")(:disabled="formData.State==0" type="password")
        +checkbox("","ConReqAuthent","ids_tr069_connRqAuth")(:disabled="formData.State==0")
        div(v-if="formData.ConReqAuthent==1")
          +input("ids_tr069_connRqUsername:","ConReqUserName")(:disabled="formData.State==0")
          +input("ids_tr069_connRqPw:","ConReqUserPassword")(:disabled="formData.State==0")
        +formBtn()
</template>
<script>
import {_,_config,$,vuex} from '../../common.js';
var Config = _config.tr069
export default {
  created() {
      this.init()
      this.initdata(Config)
    },
    methods: {
      init() {
        this.vuex = vuex
        this.page = {
          clientConfiguration: [],
          InformInterval: "",
          Inform: false,
          State: false
        }
        this.sdk.get("GetClientConfiguration", null, (res) => {
          _.extend(this.formData, res);
          this.page.clientConfiguration = res;
          this.page.Inform = this.formData.Inform == 1 ? true : false;
          this.page.State = this.formData.State == 1 ? true : false;
        })
      },
      changeInform() {
        this.formData.Inform = this.page.Inform == true ? 1 : 0;
      },
      changeState() {
        this.formData.State = this.page.State == true ? 1 : 0;
      },
      update() {
        let params = {}
        let setForm = () => {
          let params1 = {
            AcsUrl: this.formData.AcsUrl,
            AcsUserName: this.formData.AcsUserName,
            AcsUserPassword: this.formData.AcsUserPassword,
            ConReqAuthent: this.formData.ConReqAuthent,
            Inform: this.formData.Inform,
            State: this.formData.State,
            InformInterval: this.formData.InformInterval,
            ConReqUserName: this.formData.ConReqUserName,
            ConReqUserPassword: this.formData.ConReqUserPassword
          }
          _.extend(params, params1);

          this.sdk.post("SetClientConfiguration", params, {
            callback: this.init
          })
        }

        if (this.formData.State == 0) {
          setForm()
        } else {
          this.submit("formData", setForm)
        }
      }
    }
}
</script>
<style lang="sass" scoped>
</style>