<template lang="jade">
  a.logo(v-if="!pageConfig.isSuportLogoUrl")
    img(v-bind:src="page.logoAddress").svg-logo
    //-span.title-name {{titleName}}
  a.logo(:href="pageConfig.LogoUrl" target="_blank" v-else="pageConfig.isSuportLogoUrl")
    img(v-bind:src="page.logoAddress").svg-logo
</template>

<script>
import {_config,vuex,sys,$,_} from './common.js';
export default {
  created() {
    this.init();
  },
  watch: {
    'vuex.SimInfo.PLMN' (newValue, oldValue) {
      this.init();
    }
  },
  methods: {
    init() {
      this.pageConfig = _config.pageConfig;
      this.page = {
        logoAddress:"",
        logoBaseUrl:"/dist/images/svg/",
        logoName:""
      };
      this.sdk.get("GetSimStatus", null, (res) => {
        this.getLogoName(res.PLMN,res.SPN);
      });
    },
    getLogoName(plmn,spn){
      let currentLogo = _.filter(_config.logoList,function(v){
        return plmn==v.plmn&&spn==v.spn
      })
      if(currentLogo.length!=0){
        this.page.logoName=currentLogo[0].logoName;
      }else{
        this.page.logoName="logo.svg"
      }
      this.page.logoAddress = this.page.logoBaseUrl + this.page.logoName;
    }
  }
}
</script>

<style lang="sass">
</style>
