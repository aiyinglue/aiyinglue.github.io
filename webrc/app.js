import $ from './plugin/jquery-vendor.js';
import Vue from 'vue'
import VueRouter from 'vue-router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './app.vue'
import Routers from './router'
import sdk from './plugin/sdk'
import {_,_config,vuex} from './common'

import filters from './filters/filters'
import directives from './directives/directives'


import appConfig from './appConfig'
import sideMenu from './sideMenu.vue'
import simState from './views/simState.vue'
import statusIcon from './views/statusIcon.vue'

import smsReport from './views/SMS/smsReport.vue'
import svg from './views/svg.vue'

import locale from 'element-ui/lib/locale/lang/en'

//import "./styles/color.scss";
import "./styles/common.scss"
/** import font file css **/
//import "./styles/fonts.css"
/** import custom style file **/
//import "./styles/common_RSlow.scss"
//import "./styles/common_custom.scss"
//import "./styles/iconfont.css"

Vue.use(sdk)
Vue.use(appConfig)
Vue.component('sideMenu', sideMenu)
Vue.component('simState', simState)
Vue.component('statusIcon', statusIcon)
Vue.component('smsReport',smsReport)
Vue.component('svgImg',svg)

Vue.use(VueRouter)
Vue.use(ElementUI, { locale })

$.each(filters,(name,fn)=>{
  Vue.filter(name,fn)
})

const router = new VueRouter({
  routes: Routers
});
router.beforeEach((to, from, next) => {
vuex.mainMenu = ""
vuex.loginName = to.name;
let pageConfig = _config.pageConfig;
let isneedLoginRoute = _.indexOf(pageConfig.noNeedLoginRoutes, to.name)==-1;
if(to.name!="login"&&to.name!='index'&&to.name!=undefined){
  vuex.LoginToRouter = to.name;
  vuex.LoginToRouterParams = to.params;
}
  vuex.loginDialogFormVisible = false;
  if (isneedLoginRoute) {
    Vue.sdk.get('GetLoginState', null, (res) => {
      if (res.State === 1) {
        vuex.loginState=true;
        if(_config.login.pageItem.fixedChangePassword){
          if(to.name == 'changePassword'){
            next()
          }else{
            Vue.sdk.get("GetPasswordChangeFlag", null, (res) => {
                if(res.change_flag == 0){
                    router.push('changePassword');
                }else {
                    next()
                }
            });
        }
        }else{
          next()
        }
        if(pageConfig.IsSupportTimeOutLogout){
            vuex.listenLogout(_config.login.pageItem.listenLogoutTime);
            vuex.listenObj();
        }
      } else {
        vuex.loginState=false;
        if(to.name!=undefined){
          vuex.loginDialogFormVisible = true;
          vuex.tipsError = ""
        }
        
        vuex.loginName = 'index';
        router.push('index');
      }
    })
  }else{
    next()
  }
})

vuex.initRes(()=>{
  const app = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
})

vuex.initLoginState();
