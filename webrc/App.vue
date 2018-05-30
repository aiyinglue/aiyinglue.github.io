<template lang="jade">
  include ./views/components.jade
  #app(:class="{index:(vuex.currentRouter=='index'),home:(vuex.currentRouter!='index')}")
    div.header
      logo
      div.float-right
        div.top-menu
          a.float-right(v-if="vuex.currentRouter!='index'" @click='logout()') {{vuex.res.ids_logout}}
          umlink
          el-dropdown.float-right.lang-dropdown(trigger="click" @command="changLang" v-if="langListSupport.length>1")
            span.el-dropdown-link
              | {{vuex.currentLanguage|currentLang}}
              i.el-icon-caret-bottom.el-icon--right
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(:command="val" v-for="val in langListSupport") {{langListAll[val]}}
        status-icon
      sms-report
    div.container
      el-menu.main-menu.el-menu-demo(mode="horizontal" router=true v-if="vuex.currentRouter != 'index'")
        el-menu-item(:index="val.router" v-for="val in nav",:class="{'is-active':val.name==vuex.mainMenu}") 
          span(:title="val.text |res") {{val.text |res}}          
          i(class="main-menu-line")
      router-view.main
     
    .footer 
      img(src="./images/svg/alcatel.svg").svg-logo
      span.copyright {{vuex.res.ids_system_copyright}}
</template>

<script>
import {_config,vuex,sys,$} from './common.js';
import logo from './logo.vue';
import umlink from './views/umlink.vue';
let pageConfig = _config.pageConfig;

export default {
  data () {
    return {
      vuex:vuex,
      nav:_config.nav,
      sys:sys,
      langListSupport:pageConfig.langListSupport,
      langListAll:pageConfig.langListAll,
      titleName:_config.titleName,
      pageConfig:pageConfig
    }
  },

  created() {
    $('title').text(_config.titleName);
    if($.inArray(vuex.currentLanguage,pageConfig.rightDisplayLangConfig) != -1){
        $("html").addClass("ar");
    }else{
        $("html").addClass(vuex.currentLanguage);
    }

    
  },
  methods: {
    logout(){
      this.sdk.post("Logout",this.formData,(res)=>{
        vuex.LoginToRouter = "";
        vuex.heartBeat(false);
        vuex.loginState=false;
        if(this.$route.name!="index"){
          this.$router.push('index')
        }else{   
          location.reload()
        }
      })
    },
    changLang(lang){
      this.sdk.post("SetLanguage", {Language:lang}, (res) => {
        location.reload()
      })
    }
  },
  components: {
    logo,
    umlink
  }
}
</script>

<style lang="sass">
</style>
