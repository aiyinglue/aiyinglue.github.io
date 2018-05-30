<template lang="jade">
  include ../components.jade
  #filter
    +sideMenuPage('Settings')
      +breadcrumb("Filter")
      +form("formData")
        
        +formBtn()
</template>

<script>
import Config from '../../config.js'
export default {
  data () {
    return {
      config:Config.mobileConnection,
      formData: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    init (){
      this.sdk.get("GetConnectionSettings",null,(res)=>{
        this.formData = res;
      })
    },
    update (){
      this.sdk.post("SetConnectionSettings",this.formData,(res)=>{
        console.log(res)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>