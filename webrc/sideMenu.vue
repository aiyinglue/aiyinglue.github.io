<template lang="jade">
#sideMenu
  el-menu(router=true,unique-opened=true, :default-active="$route.name")
    div(v-for="(val,index) in Config[page.submenu]")
      el-submenu(:index="index.toString()" v-if="val.hasOwnProperty('submenu')")
        template(slot="title") 
          b(v-if="!!val.icon",:class="'icon-style iconfont icon-'+val.icon")
          span(:title="val.text |res") {{val.text |res}}
        el-menu-item(:title="item.text |res",:index="item.router" v-for="item in val.submenu") {{item.text |res}}
      el-menu-item(:index="val.router" v-if="!val.hasOwnProperty('submenu')" class="no-submenu") 
        i(v-if="!!val.icon",:class="'icon-style iconfont icon-'+val.icon")
        span(:title="val.text |res") {{val.text |res }}
</template>
  
<script>
import {
  $,
  _,
  _config,
  vuex
} from './common.js';
var Config = _config.sideMenu
export default {
  data() {
      return {
        Config: Config
      }
    },
    created() {
      this.init();
    },    
    methods: {
      init() {
        let vm = this;
        vm.page = {
          submenu: "Home"
        };
	vuex.currentRouter = vm.$route.name;
        if (vm.$route.name == "home" || vm.$route.name == "" || vm.$route.name == undefined) {
          vuex.currentRouter = 'internetStatus';
        }
        $(".el-menu--horizontal .el-menu-item").removeClass("is-active");
        _.each(Config, function(m, n) {
          let menuLevel1Name = n;
          let menuLevel1 = m;
          _.each(menuLevel1, function(i, v) {
            let menuLevel2 = i;
            if (menuLevel2.hasOwnProperty("submenu")) {
              var test = _.where(menuLevel2.submenu, {"router": vuex.currentRouter});
              if(test.length == 1){
                vm.page.submenu = menuLevel1Name;
                vuex.mainMenu = menuLevel1Name;
              }              
            } else {
              if (menuLevel2.router == vuex.currentRouter) {
                vm.page.submenu = menuLevel1Name;
                vuex.mainMenu = menuLevel1Name;
              }
            }
          })
        });
      }
    }
}
</script>

<style lang="sass" scoped>
</style>