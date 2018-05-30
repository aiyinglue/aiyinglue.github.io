<template lang="jade">
  include ../components.jade
  #ddns
    +sideMenuPage('Settings')
      +breadcrumb("ids_ddns_title")
      +form("formData")(label-width="0px")
        span.add(v-show="page.Ddns_list.length<10")
          +button("")(icon="plus" size="mini" @click="add" type="primary")
        div.el-table-div
          table.el-table
            tr
              th {{vuex.res.ids_ddns_connectionstatus}}
              th {{vuex.res.ids_ddns_serviceProvider}}
              th {{vuex.res.ids_ddns_status}}
              th {{vuex.res.ids_ddns_domainName}}
              th {{vuex.res.ids_ddns_username}}
              th {{vuex.res.ids_ddns_password}}
              th {{vuex.res.ids_ddns_Operation}}
            tr(v-for="(val,row) in page.Ddns_list")
              td {{vuex.res.ids_ddns_title}}
              td {{val.service_Provider}}
              td {{val.status|valText(formOptions.status)}}
              td {{val.domain_name}}
              td {{val.user_name}}
              td
                input(:type="formData.showPassword==1?'text':'password'" class="showPassword",:value="val.password" ,:maxlength="30" disabled="disabled")
              td 
                +button("")(icon="edit" size="mini" @click="edit(row,val)")
                +button("")(icon="delete" size="mini" type="danger" @click="deleted(row)")
          +checkbox("","showPassword","ids_ddns_showpassword")
        div.tips {{vuex.res.ids_note}}:<br />{{vuex.res.ids_ddns_note}}
      el-dialog(:title="page.action=='edit'?vuex.res.ids_ddns_edit:vuex.res.ids_ddns_add" v-model="page.dialog")
        +form("formData")
          div(v-if="page.dialog")
            +text("ids_ddns_connectionstatus:","{{vuex.res.ids_ddns_title}}")
            +select("ids_ddns_serviceProvider:","service_Provider")
            +select("ids_ddns_status:","status")
            +input("ids_ddns_domainName:","domain_name")(:maxlength="30")
            +input("ids_ddns_username:","user_name")(:maxlength="30")
            +input("ids_ddns_password:","password")(:type="formData.showPassword==1?'text':'password'",:maxlength="30")
            +formBtn()
</template>
<script>
import { _config, _, $, vuex } from '../../common.js';
let Config = _config.ddns;
export default {
  created() {
    this.init()
  },
  methods: {
    init() {
      this.vuex = vuex;
      this.initdata(Config);
      this.page = {
        Ddns_list: [],
        dialog: false,
        action: "",
        indexs: -1

      }
      this.sdk.get("GetDdnsSettings", null, (res) => {
        this.page.Ddns_list = res.Ddns_list;
      });
    },
    edit(index, item) {
      //this.$refs.formData.resetFields();
      _.extend(this.formData, item);
      this.page.action = 'edit';
      this.page.indexs = index;
      this.page.dialog = true;
    },
    update() {
      let params = {};
      let vm = this;
      let sameDomainname = true;
      let setForm = () => {
        if (this.page.action == 'add') {
          _.each(vm.page.Ddns_list, (i, v) => {
            if (vm.formData.domain_name == i.domain_name) {
              sameDomainname = false;
              return false;
            }
          })
          if (!sameDomainname) {
            this.$alert(vuex.res['ids_ddns_exists'], vuex.res['ids_confirm'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {
                vm.reset();
              }
            });
            return false;
          } else {
            vm.page.Ddns_list[vm.page.indexs] = {};
            _.extend(vm.page.Ddns_list[vm.page.indexs], vm.formData);
            
          }
        } else {
          $.each(vm.page.Ddns_list, function(i, v) {
            if (i != vm.page.indexs && vm.formData.domain_name == v.domain_name) {
              sameDomainname = false;
              return false;
            }
          })
          if (!sameDomainname) {
            this.$alert(vuex.res['ids_ddns_exists'], vuex.res['ids_confirm'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {
                vm.reset();
              }
            });
            return false;
          } else {
            vm.page.Ddns_list[vm.page.indexs] = {};
            _.extend(vm.page.Ddns_list[vm.page.indexs], vm.formData);
          }
        }
        let params1 = {
          Ddns_list: vm.page.Ddns_list
        }
        _.extend(params, params1);
        this.sdk.post("SetDdnsSettings", params, {
          callback: this.init
        })
      }
      vm.submit("formData", setForm)
    },
    add() {
      this.formData = {
        showPassword:"",
        connection_status: "DDNS",
        service_Provider: "dtdns.com",
        status: 1,
        domain_name: "",
        user_name: "",
        password: ""
      }
      this.page.action = 'add';
      this.page.dialog = true;
      //this.$refs.formData.resetFields();
      this.page.indexs = this.page.Ddns_list.length;
    },
    deleted(index) {
      let vm = this;
      let params = {};
      vm.$confirm(vuex.res['ids_ddns_delete'], vuex.res['ids_confirm'], {
        confirmButtonText: vuex.res['ids_delete'],
        cancelButtonText: vuex.res['ids_cancel'],
        type: 'warning'
      }).then(() => {
        vm.page.Ddns_list.splice(index, 1);
        let params1 = {
          Ddns_list: vm.page.Ddns_list
        }
        _.extend(params, params1);

        this.sdk.post("SetDdnsSettings", params, {
          callback: this.init
        })
      }).catch(() => {

      });
    }
  }
}
</script>
<style lang="sass" scoped>
.el-form {
  width: 721px;
}
div.forbiddenTime{
  margin:0 0 22px 26px;
}
.showPassword{
    text-align: center;
    border: none;
    height: 24px;
    line-height: 22px;
    background: #f2f2f2;
    width: 120px;
}
span.add {
  float: right;
}
</style>

