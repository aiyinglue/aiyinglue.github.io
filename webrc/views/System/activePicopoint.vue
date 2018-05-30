<template lang="jade">
  include ../components.jade
  #ActivePicopoint
    +sideMenuPage('System')
      +breadcrumb("Activate Picopoint")
      +form("formData")(v-loading.body="page.loading")
        div.uploadFile
          input.fileUpload(type="file" id="fileUpload" name="fileUpload" @change = "showUpgradeFileUrl()")
          el-input(size="small" class="inline-input" placeholder="Select File" v-model="page.fileUrlName")
          +button("ids_update_Browse")(size="small" type="primary")
        +button("Activate Picopoint")(size="small" type="primary" @click="activatePicopoint", :disabled="page.fileUrlName==''")
</template>

<script>
import {
  _,
  _config,
  $,
  vuex
} from '../../common.js';
var Config = _config.activePicopoint
export default {
  created() {
      this.init()
      this.initdata(Config)
    },
    methods: {
      init() {
        this.Inter = null;
        this.page = {
          fileUrlName: "",
          loading: false
        };
        this.vuex = vuex;
      },
      showUpgradeFileUrl() {
        var urlPath = $("#fileUpload").val();
        this.page.fileUrlName = urlPath;
      },
      
      activatePicopoint() {
        if (this.page.fileUrlName != "") {
          this.$confirm('Are you sure you want to Activate Picopoint?', "Confirm").then(() => {
            this.ajaxFileUploadEvent();
          }).catch(() => {});
        }
      },

      ajaxFileUploadEvent() {
        var vm = this;
        vm.page.loading = true;
        $.ajaxFileUpload({
          url: "/goform/activatePicopoint",
          secureuri: false,
          fileElementId: ["fileUpload"],
          dataType : 'json',
          data: {
            "_TclRequestVerificationToken": ($.cookie("t")||"").slice(32)
          },
          success: function(data, status) {
            if(data.error==0){
              vm.$message({
                message: vuex.res["ids_success"],
                duration: 1000,
                type: 'success',
                onClose() {
                  clearTimeout(vm.Inter)
                  vm.Inter = null
                  vm.Inter = setTimeout(function() {
                    location.reload();
                  }, 5000)
                }
              });
            }else{
              vm.$message.error(vuex.res["ids_fail"]);
              setTimeout(function() {
                location.reload();
              }, 1500)
            }
            
          },
          error: function(data, status, e) {
            vm.$message.error(vuex.res["ids_fail"]);
            setTimeout(function() {
              location.reload();
            }, 1500)
            
          }
        });
      }

    }
}
</script>


<style lang="sass" scoped>
</style>