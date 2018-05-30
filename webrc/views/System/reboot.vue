<template lang="jade">
  include ../components.jade
  #reboot
    +form("formData")
      div.reboot
      p {{vuex.res.ids_system_restartDevice}}
      +button("ids_system_reboot")(@click="update_reboot" type="primary" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="")
</template>
<script>
import {
  _,
  $,
  vuex,
  G
} from '../../common.js';
export default {
  data() {
      return {
        fullscreenLoading: false
      }
    },
    created() {},
    methods: {
      init() {
        this.vuex = vuex
        this.page = {
          dialogFormVisible: false
        };
      },
      tabs(tabs) {
        this.$router.push(tabs.$el.getAttribute("router"))
      },
      update_reboot() {
        let vm = this
        this.$confirm(this.vuex.res.ids_reboot_factory_settings, this.vuex.res.ids_system_reboot, {
          cancelButtonText: this.vuex.res.ids_cancel,
          confirmButtonText: this.vuex.res.ids_system_reboot,
          type: 'warning'
        }).then(() => {
          this.reboot();
        }).catch(() => {

        });
      },
      reboot() {
        let vm = this
        let results = {
          callback: this.init,
          success: {
            tips: "None",
            callback() {
              vm.fullscreenLoading = true;
              setTimeout(() => {
                vm.fullscreenLoading = false;
                location.href = '#/index';
              }, 3000);
            }
          },
          fail: vuex.res["ids_fail"]
        }
        this.sdk.post("SetDeviceReboot", this.formData, results)
      }   
    }
}
</script>

<style lang="sass" scoped>
.reboot {
  text-align: left;
  font-size: 14px;
  line-height: 1;
  margin-bottom: 40px;
  p {
    padding-bottom: 10px;
  }
}
</style>

