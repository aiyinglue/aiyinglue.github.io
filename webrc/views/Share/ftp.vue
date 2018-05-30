<template lang="jade">
  include ../components.jade
  #ftp
    +form("formData")
      +formItem("ids_ftp_Title:")
        el-switch(v-model="page.ftpStatus" @change="update()" on-text="" off-text="")
      div(v-if="formData.FtpStatus==1")
        +formItem("ids_ftp_storage:")
          | {{vuex.res.ids_ftp_hardDisk}} 
        div(v-if="pageItem.Anonymous")
          +radio("ids_ftp_anonymous:","Anonymous")(@change="update()")   
          div(v-if="formData.Anonymous==1")      
            +subText("","{{vuex.res.ids_ftp_anonymousEnableTips}}")
          div(v-if="formData.Anonymous==0")        
            +subText("","{{vuex.res.ids_ftp_anonymousDisableTips1}}")
            +subText("","{{vuex.res.ids_ftp_anonymousDisableTips2}}")        
            +subText("","{{vuex.res.ids_ftp_anonymousDisableTips3}}")
        +radio("ids_ftp_rights:","AuthType")(@change="update()")
</template>

<script>
import {_,_config,$,vuex,G} from '../../common.js';
let Config = _config.ftp;
export default {
  created() {
      this.init();      
      this.initdata(Config);
    },
    methods: {
      init() {
        this.page = {
          ftpStatus: false
        }
        this.sdk.get("GetFtpSettings", null, (res) => {
          this.formData = res;
          this.page.ftpStatus = this.formData.FtpStatus == 1 ? true : false;
        });
      },
      update() {
        let results = {
          callback:this.init
        };
        this.formData.FtpStatus = this.page.ftpStatus == true ? 1 : 0;
        this.sdk.post("SetFtpSettings", this.formData, results);
      }
    }
}
</script>

<style lang="sass" scoped>
</style>
