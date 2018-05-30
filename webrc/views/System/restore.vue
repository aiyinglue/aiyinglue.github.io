<template lang="jade">
  include ../components.jade
  #restore
    +sideMenuPage('System')
      +breadcrumb("ids_system_backupRestore")
      +form("formData")
        div.backupRestore(style="width: 100%" v-loading.body="page.fullscreenLoading")
          el-row(:gutter="25")
            el-col.textAlignRight(:span="8") {{vuex.res.ids_restore_backup}}:
            el-col(:span="16") 
              div.backupTxt {{vuex.res.ids_restore_backupDescription}}
              +button("ids_restore_backup")(size="small" type="primary" @click="backupFile")
          el-row.restoreArea(:gutter="25")
            el-col.textAlignRight(:span="8") {{vuex.res.ids_restore}}:
            el-col(:span="16")
              div.uploadFile
                input.fileUpload(type="file" id="fileUpload" name="fileUpload" v-on:change = "showUpgradeFileUrl()")
                el-input(size="small" class="inline-input" placeholder="" v-model="page.fileUrlName", :change="changeInput()")
                +button("ids_update_Browse")(size="small" type="primary")
              +button("ids_restore")(size="small" type="primary" @click="restoreDevice", :disabled="page.restoreDisabled")
          el-dialog(v-model="page.deviceRestored" size="tiny" top="50%",:show-close="false",:close-on-press-escape="false",:close-on-click-modal="false")
              span {{vuex.res.ids_restore_evice_restored}}

</template>
<script>
import {
  $,
  vuex
} from '../../common.js'
export default {
  created() {
      this.init();
    },
    methods: {
      init() {
        this.Inter = null;
        this.vuex = vuex
        this.page = {
          fileUrlName: "",
          deviceRestored: false,
          restoreDisabled: false,
          fullscreenLoading: false
        }
      },
      showUpgradeFileUrl() {
        var urlPath = $("#fileUpload").val();
        //var imageUrlArr = urlPath.split("\\");
        //var imageName = imageUrlArr[imageUrlArr.length-1];
        this.page.fileUrlName = urlPath;
      },
      changeInput() {
        if ($.trim(this.page.fileUrlName) != '') {
          this.page.restoreDisabled = false;
        } else {
          this.page.restoreDisabled = true;
        }
      },
      backupFile() {
        var _self = this;
        let setResult = {
          success: {
            tips: "Message",
            msg: vuex.res["ids_success"],
            callback() {
              _self.getBackupSettings();
            }
          },
          fail: vuex.res["ids_fail"]
        }
        this.sdk.post("SetDeviceBackup", this.formData, setResult);
        this.page.fullscreenLoading = true;
      },
      restoreDevice() {
        if (this.page.fileUrlName != "") {
          this.$confirm(vuex.res['ids_restore_factory_settings'], vuex.res['ids_restore'], {
            confirmButtonText: vuex.res['ids_restore'],
            cancelButtonText: vuex.res['ids_cancel'],
            type: 'warning'
          }).then(() => {
            this.ajaxFileUploadEvent();
          }).catch(() => {
            console.log("Cancel Restore");
          });
        }
      },
      getBackupSettings() {
        $("body").append("<iframe src='/cfgbak/configure.bin' style='display: none'></iframe>");
        this.page.fullscreenLoading = false;
      },
      ajaxFileUploadEvent() {
        var _self = this;
        this.page.fullscreenLoading = true;
        $.ajaxFileUpload({
          url: "/goform/uploadBackupSettings",
          secureuri: false,
          fileElementId: ["fileUpload"],
          dataType: "json",
          data: {
            "_TclRequestVerificationToken": ($.cookie("t")||"").slice(32)
          },
          success: function(data, status) {
            _self.page.fullscreenLoading = false
            _self.page.deviceRestored = false;
            if (data.error == 0) {
              _self.$message({
                message: vuex.res["ids_success"],
                duration: 1000,
                type: 'success',
                onClose() {
                  _self.page.deviceRestored = true
                  clearTimeout(_self.Inter)
                  _self.Inter = null
                  _self.Inter = setTimeout(function() {
                    location.reload();
                  }, 40000)
                }
              });
            } else {
              _self.$alert(vuex.res['ids_restore_device_restoration'], vuex.res['ids_restore'], {
                confirmButtonText: vuex.res['ids_ok'],
                type: "error",
                onClose() {
                  location.reload();
                }
              });
            }
          },
          error: function(data, status, e) {
            _self.page.fullscreenLoading = false
            _self.page.deviceRestored = false;
            _self.$alert(vuex.res['ids_restore_device_restoration'], vuex.res['ids_restore'], {
              confirmButtonText: vuex.res['ids_ok'],
              type: "error",
              onClose() {
                location.reload();
              }
            });
          }
        });
      },

    }
}
</script>


<style lang="sass" scoped>
.el-form{
  width:645px;
}
</style>