<template lang="jade">
  include ../components.jade
  #dlna
    +sideMenuPage('Services')
      +breadcrumb("ids_dlna_menuDlna")
      +form("formData")
        +formItem("ids_dlna_menuDlna:")
          el-switch(v-model="page.dlnaStatus" @change="update()" on-text="" off-text="")
      el-dialog.loginBox(title="" v-model="pageItem.needLoginAgain" size="tiny" @close="closeLogin",:close-on-press-escape="false",:close-on-click-modal="false")
        login(:needLoginAgain="pageItem.needLoginAgain",:loginAgainCallback="loginAgainCallback")
</template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
import login from '../login.vue'
let Config = _config.dlna;
export default {
  created() {
      this.init();      
      this.initdata(Config);
    },
    methods: {
      init() {
        this.page = {
          dlnaStatus: false
        }
        this.vuex = vuex;
        this.vuex.gotoHomeRouter = true;
        this.sdk.get("GetDLNASettings", null, (res) => {
          this.formData = res;
          this.page.dlnaStatus = this.formData.DlnaStatus == 1 ? true : false;
        })
      },
      update() {
        let results = {
          callback:this.init
        };
        this.formData.DlnaStatus = this.page.dlnaStatus == true ? 1 : 0;
        this.sdk.post("SetDLNASettings", this.formData, results);
      },
      loginAgainCallback() {
        this.pageItem.needLoginAgain = false;
      },
      closeLogin() {
        if(this.vuex.gotoHomeRouter){
          this.$router.push({name:'home'})
        }
        
      }
    },
    components: {
      login
    }
}
</script>

<style lang="sass" scoped>
</style>
