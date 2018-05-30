<template lang="jade">
  include ../components.jade
  #resetreboot
    +sideMenuPage('System')
      +breadcrumb("ids_system_rebootReset")
      reboot
      reset
</template>

<script>
import reboot from './reboot.vue'
import reset from './reset.vue'
export default {
    components: {
      reboot,
      reset
    }
}
</script>

<style lang="sass" scoped>
</style>