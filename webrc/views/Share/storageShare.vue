<template lang="jade">
  include ../components.jade
  #storageShare
    +sideMenuPage('Services')
      +breadcrumb("ids_storageShare_Title")
      samba
      ftp
      el-dialog.loginBox(title="" v-model="pageItem.needLoginAgain" size="tiny" @close="closeLogin",:close-on-press-escape="false",:close-on-click-modal="false")
        login(:needLoginAgain="pageItem.needLoginAgain",:loginAgainCallback="loginAgainCallback")
</template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
import login from '../login.vue'
import samba from './samba.vue'
import ftp from './ftp.vue'
let Config = _config.storageShare;
export default {
  created() {
      this.init();      
      this.initdata(Config);
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.vuex.gotoHomeRouter = true;
      },
      update() {
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
      samba,
      ftp,
      login
    }
}
</script>

<style lang="sass" scoped>
</style>
