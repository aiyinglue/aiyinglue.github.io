<template lang="jade">
  include ../components.jade
  #virtualServer
    +sideMenuPage('Settings')
      +breadcrumb("ids_vtServer_titleVirtualServer")
      span.add
        +button("").add-btn(@click="add" type="primary" icon="plus" size="mini")
      div.el-table-div
        table.el-table
          tr
            th {{vuex.res.ids_vtServer_name}}
            th {{vuex.res.ids_vtServer_wanPort}}
            th {{vuex.res.ids_vtServer_lanIp}}
            th {{vuex.res.ids_vtServer_lanPort}}
            th {{vuex.res.ids_vtServer_protocol}}
            th {{vuex.res.ids_vtServer_status}}
            th {{vuex.res.ids_vtServer_operation}}
          tr(v-for="(list,index) in page.portfwd_list")
            td {{list.portfwd_name}}
            td {{list.private_port}}
            td {{list.private_ip}}
            td {{list.global_port}}
            td {{list.fwding_protocol |valText(formOptions.fwding_protocol)}}
            td {{list.fwding_status|valText(formOptions.fwding_status)}}
            td 
              +button("")(icon="edit" size="mini" @click="edit(index)")
              +button("")(icon="delete" size="mini" type="danger" @click="del(index)")
      p.tips {{vuex.res.ids_note}}:<br/>{{vuex.res.ids_vtServer_Note}}
      el-dialog(:title="page.actionType==1?'Edit':'Add'" v-model="page.dialogFormVisible")
        +form("formData")(v-if="page.dialogFormVisible")
          +input("ids_vtServer_name:","portfwd_name")
          +input("ids_vtServer_lanIp:","private_ip")
          +input("ids_vtServer_lanPort:","global_port")
          +input("ids_vtServer_wanPort:","private_port")
          +select("ids_vtServer_protocol:","fwding_protocol")
          +select("ids_vtServer_status:","fwding_status")
          +formBtn()

</template>

<script>
import {
  _,
  _config,
  vuex
} from '../../common.js';
var Config = _config.virtualServer;
export default {
  created() {
      this.init()
    },
    methods: {
      init() {
        this.initdata(Config);
        this.vuex=vuex;
        this.page = {
          actionType: 0, //0:list;1:edit;2:new
          dialogFormVisible: false,
          portfwd_list: [],
          listIndex: 0
        }
        this.sdk.get("getPortFwding", null, (res) => {
          this.page.portfwd_list = res.portfwd_list
        })
      },

      del(item) {
        this.$confirm(this.vuex.res.ids_vtServer_deleteConfirm, this.vuex.res.ids_confirm, {
          confirmButtonText: this.vuex.res.ids_confirm,
          cancelButtonText: this.vuex.res.ids_cancel,
          type: 'warning'
        }).then(() => {
          this.page.portfwd_list.splice(item,1)
          this.save()
        }).catch(() => {

        });
      },

      save() {
        let params = {
          total_num: this.page.portfwd_list.length,
          portfwd_list: this.page.portfwd_list
        }
        this.sdk.post("SetPortFwding", params, {
          callback: this.init
        })
      },

      add() {
        this.page.actionType = 2;//new
        this.page.dialogFormVisible = true;
        this.formData = {
          portfwd_name: "",
          private_ip: "",
          private_port: "",
          global_port: "",
          fwding_protocol: 6,
          fwding_status: 1
        }
      },

      edit(item) {
        this.page.actionType = 1;//edit
        this.page.dialogFormVisible = true;
        this.page.listIndex = item;
        this.formData = Object.assign({},this.formData,this.page.portfwd_list[item])
      },

      update() {
        let setForm = () => {
          if (this.page.actionType == 1) {//edit
            this.page.portfwd_list[this.page.listIndex] = this.formData
          } else if (this.page.actionType == 2) {
            if(!this.page.portfwd_list){
              this.page.portfwd_list=[]
            }
            this.page.portfwd_list.push(this.formData)
          }
          this.save()
        }
        this.submit("formData", setForm)
      }
    }
}
</script>

<style lang="sass" scoped>
</style>
