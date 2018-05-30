<template lang="jade">
  include ../components.jade
  #dynamicRules
    +form("formData")
      +formItem("ids_routingRules_DynamicRouting:")
        el-switch(v-model="page.Operation" @change="swich()" on-text="" off-text="")
      +formItem("ids_routingRules_rip:")
        el-switch(v-model="page.RipState" @change="swich()" on-text="" off-text="")
      +select("ids_routingRules_verion:","RipVerion")
      +formBtn()
</template>

<script>
import {$, _,_config,vuex} from '../../common.js';
let Config = _config.dynamicRules;
export default {
  created() {
      this.init()
      this.initdata(Config);
    },
    methods: {
      init() {
        this.vuex = vuex;
        this.page={
          Operation:true,
          RipState:true
        }
        this.sdk.get("GetDynamicRouting", null, (res) => {
          this.formData = res;
          this.page.Operation=this.formData.Operation == 1 ? true : false;
          this.page.RipState=this.formData.RipState == 1 ? true : false;
        })
      },
      swich() {
        let results = {
          callback:this.init
        };
        this.formData.Operation = this.page.Operation== true? 1 : 0;
        this.formData.RipState = this.page.RipState== true? 1 : 0;
        this.sdk.post("SetDynamicRouting", this.formData, results)
      },
      update() {
          this.formData.Operation = this.page.Operation== true? 1 : 0;
          this.formData.RipState = this.page.RipState== true? 1 : 0;
          this.sdk.post("SetDynamicRouting", this.formData, {
            callback: this.init
          })
      }
    }
}
</script>

<style lang="sass" scoped>
.el-form {
  width: 721px;
}

span.add {
  float: right;
}
</style>
