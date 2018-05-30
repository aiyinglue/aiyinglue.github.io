<template lang="jade">
  a.float-right(v-if="umUrl!=''" target="_blank",:href="umUrl+vuex.currentLanguage") {{vuex.res.ids_help}}
</template>

<script>
import {_config,vuex} from '../common.js';
let pageConfig = _config.pageConfig;
export default {
  data() {
      return {
        vuex:vuex,
        umUrl: ""
      }
    },
  created() {
    let vm = this;
    vm.sdk.get("GetSystemInfo", null, (res) => {
      let swInfo = res.SwVersion.split("_")
      let project = swInfo[0].substring(0,4)
      vm.umUrl = `${pageConfig.umOnlineUrl}?project=${project}&custom=${swInfo[1]}&version=${res.SwVersion}&lang=`
    });
  }
}
</script>