<template lang="jade">
  .svg
</template>
<script>
import {
  $,
  vuex
} from '../common.js'
export default {
  created() {
      if(this.svgUrl && this.svgUrl.indexOf("undefined")<0){        
        this.init(this.svgUrl);
      }
    },
    props: ['svgUrl'],
    watch: {
      'svgUrl' (newValue, oldValue) {
        this.init()
      }
    },
    methods: {
      init() {
        let vm = this;
        this.vuex = vuex;
        $.ajax({
          url: "dist/images/svg/" + this.svgUrl + "?rand=" + Math.random(),
          type: "get",
          dataType: "html",
          success: function(data) {
            $(vm.$el).html(data);
          }
        });
      }
    }
}
</script>
<style lang="sass" scoped>
@import "~@scss/color.scss";
$iconDirectory:"../images/icon/";
</style>

