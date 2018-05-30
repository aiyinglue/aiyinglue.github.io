<template lang="jade">
  include ../components.jade
  #profileManagement
    +sideMenuPage('Settings')
      +breadcrumb("ids_profile_pageTitle")
      +form("formData")
        +formItem("ids_profile_profileManagement:")
          el-select(v-model.number="page.currentProfileId" @change="changeProfile()")
            el-option(v-for="val in profileList",:label="val.Default==1?val.ProfileName+' '+'('+vuex.res.ids_profile_default+')':val.ProfileName",:value.number="val.ProfileID")
        +input("ids_profile_name:","ProfileName")(:disabled="page.actionType==0",:maxlength="31")
        +input("ids_profile_dialNumber:","DailNumber")(:disabled="page.actionType==0",:maxlength="31")
        +input("ids_profile_apn:","APN")(:disabled="page.actionType==0",:maxlength="32")
        +input("ids_profile_userName:","UserName")(:disabled="page.actionType==0",:maxlength="31")
        +input("ids_profile_password:","Password")(type="password",:disabled="page.actionType==0",:maxlength="31")
        +select("ids_protocol:","AuthType")(:disabled="page.actionType==0")
        div.center {{vuex.res.ids_profile_numRule}}
        div.center
          +button("ids_new")(@click="newProfile",:disabled="page.actionType==2||page.actionType==1||page.maxProfileLength==15")
          +button("ids_edit")(@click="editProfile",:disabled="page.actionType==2||page.actionType==1||page.currentProfileId==''||currentProfileValue.IsPredefine==0||defaultProfile.ProfileID==page.currentProfileId")
          +button("ids_save")(@click="saveProfile",:disabled="page.actionType==0")
          +button("ids_delete")(@click="delProfile()",:disabled="defaultProfile.ProfileID==page.currentProfileId||page.actionType!=0||page.currentProfileId==''||currentProfileValue.IsPredefine==0")
          +button("ids_profile_setDefault")(@click="ConnectedIsDisconnectSetDefaultProfile",:disabled="defaultProfile.ProfileID==page.currentProfileId||page.actionType!=0||page.currentProfileId==''")
          +button("ids_cancel")(@click="init",:disabled="page.actionType==0")
</template>

<script>
import {
  _,
  _config,
  $,
  vuex,
  G
} from '../../common.js';
var Config = _config.profileManagement;
export default {
  created() {
      this.init();
      this.initdata(Config)
    },
    methods: {
      init() {
        this.G = G;
        this.vuex = vuex;
        this.page = {
          currentProfileId: 1,
          actionType: 0,
          //0:list;1:edit;2:new
          indexs: -1,
          ConnectionStatus: "",
          maxProfileLength: ''
        };
        this.userDefineProfileName = [];
        this.profileList = {};
        this.defaultProfile = {};
        this.currentProfileValue = {
          IsPredefine: 0
        };
        this.sdk.get("GetProfileList", null, (res) => {
          this.profileList = res.ProfileList;
          this.page.maxProfileLength = $.grep(res.ProfileList, function(n, i) {
            return n.IsPredefine == 1;
          }).length;
          let defaultProfile = $.grep(res.ProfileList, function(n, i) {
            return n.Default === 1;
          })[0];
          this.formData = $.extend({}, defaultProfile);
          this.defaultProfile = $.extend({}, defaultProfile);
          if (defaultProfile != undefined) {
            this.page.currentProfileId = defaultProfile.ProfileID;
          } else {
            this.page.currentProfileId = "";
          }
        })
        this.sdk.get("GetConnectionState", null, (res) => {
          this.page.ConnectionStatus = res.ConnectionStatus;
        })
      },

      changeProfile() {
        let vm = this;
        vm.$refs.formData.resetFields()
        vm.page.actionType = 0;
        let currentProfile = $.grep(vm.profileList, function(n, i) {
          return n.ProfileID === vm.page.currentProfileId;
        })[0];
        _.extend(this.currentProfileValue, currentProfile);
        vm.formData = $.extend({}, currentProfile);
      },

      newProfile() {
        let userDefineProfileNameArray = [];
        let vm = this;
        this.formData = $.extend({}, Config.initNewData)
        vm.$refs.formData.resetFields();
        $.each(this.profileList, function(i, v) {
          userDefineProfileNameArray.push(v.ProfileName)
        })
        this.userDefineProfileName = userDefineProfileNameArray
        this.page.actionType = 2;
      },
      editProfile() {
        let userDefineProfileNameArray = [];
        let vm = this;
        this.page.actionType = 1;
        let currentProfile = $.grep(vm.profileList, function(n, i) {
          return n.ProfileID === vm.page.currentProfileId;
        })[0];
        $.each(this.profileList, function(i, v) {
          if (v.ProfileName != currentProfile.ProfileName) {
            userDefineProfileNameArray.push(v.ProfileName);
          }
        })
        this.userDefineProfileName = userDefineProfileNameArray;
      },
      saveProfile() {
        let vm = this;
        let results = {
          callback: this.init,
        }
        let setForm = () => {
          if ($.inArray(vm.formData.ProfileName, this.userDefineProfileName) != -1) {
            this.$alert(vuex.res['ids_profile_nameWarn'], vuex.res['ids_confirm'], {
              confirmButtonText: vuex.res['ids_ok'],
              callback: action => {
                vm.reset();
              }
            });
            return false;
          } else {
           this.userDefineProfileName.push(vm.formData.ProfileName)
          }
          if (this.page.actionType == 2) {
            this.submit("formData", () => {
              this.sdk.post("AddNewProfile", this.formData, results)
            })
          } else if (this.page.actionType == 1) {
            this.submit("formData", () => {
              this.sdk.post("EditProfile", this.formData, results)
            })
          } else {
            console.log(res)
          }
        }
        this.submit("formData", setForm)
      },
      delProfile() {
        let vm = this;
        this.page.actionType = 0;
        vm.$refs.formData.resetFields()
        let params = {
          ProfileID: vm.formData.ProfileID
        }
        let results = {
          callback: this.init,
        }
        this.sdk.post("DeleteProfile", params, results)
      },
      setDefaultProfile() {
        let vm = this
        this.page.actionType = 0;
        let params = {
          ProfileID: vm.formData.ProfileID
        }
        let results = {
          callback() {
            location.reload()
          }
        }
        this.sdk.post("SetDefaultProfile", params, results)
      },
      ConnectedIsDisconnectSetDefaultProfile() {
        if (Config.pageItem.ConnectedIsDisconnect) {
          vuex.ConnectionActivePopu(this.setDefaultProfile);
        } else {
          this.setDefaultProfile();
        }
      }
    }
}
</script>

<style lang="sass" scoped>
.center{
  margin-bottom: 20px;
  font-size: 14px;
  color: #5e6d82;
}
</style>
