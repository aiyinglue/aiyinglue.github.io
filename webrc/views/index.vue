<template lang="jade">
  include ./components.jade
  #index
    +form("formData")
      el-row(:gutter="0")
        el-col(:span="12" v-if="pageConfig.IsShowQRcode")
          div.title {{vuex.res.ids_managerAPP}}
          el-row(:gutter="0")
            el-col.qcode-box(:span="11")
              img(src="../images/Android&IOS.png")
              div.imgTextAlign
                img(src="../images/AndroidApp.png" width="40" height="40")
                img(src="../images/appleApp.png" width="30" height="30")
            //-el-col(:span="11") 
              img(src="../images/Android&IOS.png")
              div.imgTextAlign
                img(src="../images/appleApp.png" width="30" height="30")
        el-col.cutLine(:span="11")
          login
</template>

<script>
import {$,_config,vuex} from '../common.js'
import login from './login.vue'
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.pageConfig=_config.pageConfig;
        vuex.currentRouter = this.$route.name;
      },
      update() {
      }
    },
    components: {
      login
    }
}
</script>

<style lang="sass" scoped>
@import "~@scss/color.scss";
#index {
  padding: 30px 0;
  .title {
    padding: 0 0 36px 0;
  }
  .imgTextAlign {
    text-align: center;
    padding: 21px 0 0 0;
    img{
      margin-right:10px;
    }
  }
  .qcode-box{
    margin-left:100px;
  }
  .cutLine {
    border-left: 1px solid $color_main_level_1;
    min-height: 379px;
  }
}

.el-form {
  width: 895px;
}
</style>
