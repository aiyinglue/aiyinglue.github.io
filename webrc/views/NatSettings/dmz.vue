<template lang="jade">
  include ../components.jade
  #dmzSettings
    +sideMenuPage('Settings')
      +breadcrumb("ids_dmz_dmzTitle")
      +form("formData")
        //-+radio("ids_dmz_dmzTitle:","dmz_status")
        +switch("ids_dmz_dmzTitle","page.dmz_status")(@change="changedmzStatus")
        div(v-if="page.dmz_status")
          +input("ids_dmz_dmzHostIP:","dmz_ip")
          +formBtn()
        p.tips {{vuex.res.ids_note}}:<br/>{{vuex.res.ids_dmz_dmzNote}}
</template>

<script>
import {_,_config} from '../../common.js';
var Config = _config.dmzSettings;
export default {
  created() {
      this.initdata(Config);
      this.init()
    },
    methods: {
      init() {
        this.page = {
          dmz_status:false
        };
        this.sdk.get("getDMZInfo", null, (res) => {
          _.extend(this.formData,res)
          this.page.dmz_status = res.dmz_status==1?true:false
        })
      },

      changedmzStatus(){
        this.formData.dmz_status = this.page.dmz_status===true?1:0
        if(!this.formData.dmz_status){
          this.update()
        }
      },
      update() {
        let setForm = () => {
          this.sdk.post("setDMZInfo", this.formData, {
            callback: this.init
          })
        }
        if(!this.formData.dmz_status){
          setForm()
        }else{
          this.submit("formData", setForm)
        }
        
      }
    }
}
</script>

<style lang="sass" scoped>
</style>