<template lang="jade">
  include ../components.jade
  #localUpgrade
    +sideMenuPage('System')
      +breadcrumb("ids_pb_local")
      +form("formData")
        div.el-table-div(v-loading.body="page.loading",:element-loading-text="page.ScannedFile")
          table.el-table
            tr
              th &nbsp;
              th {{vuex.res.ids_localUpgrade_name}}
            tr(v-for="(data,index) in page.dataPackage")
              td
                el-radio(:label="data.usbUpgradeID" v-model="page.checkedVal" @change="page.checkedVal") {{&nbsp;}}
              td {{data.usbUpgradePath}}
        //-el-table(:data="page.dataPackage")(v-loading.body="page.loading",:element-loading-text="page.ScannedFile")
          el-table-column(prop="" inline-template)
            el-radio(:label="row.usbUpgradeID" v-model="page.checkedVal")(@change="page.checkedVal") {{&nbsp;}}
          el-table-column(label="name" prop="usbUpgradePath")
        +button("ids_localUpgrade_search")(size="small" type="primary" @click="searchUpgradePackage", :disabled="page.searchDisabled")
        +button("ids_localUpgrade_StopSearch")(size="small" type="primary" @click="stopSearch", :disabled="page.stopDisabled")
        +button("ids_localUpgrade_update")(size="small" type="primary" @click="startUpgrade", :disabled="page.upgradeDisabled")
        el-dialog(:title="vuex.res.ids_update_Updating" v-model="page.alertUpdating",size="tiny",:close-on-press-escape="false",:close-on-click-modal="false",:show-close="false")
          p {{vuex.res.ids_update_upgradingWarning}}
        //-el-row(:gutter="11")
          el-col.textAlignRight(:span="8") {{vuex.res.ids_update_localUpgrade}}
          el-col(:span="16")
            div.uploadFile
              input.fileUpload(type="file" id="fileUpload" name="fileUpload" v-on:change = "showUpgradeFileUrl()")
              el-input(size="small" class="inline-input" placeholder="Please Choice File" v-model="page.fileUrlName", :change="changeUpload()")
              +button("ids_update_Browse")(size="small" type="primary")
            +button("ids_update_upgrade")(size="small" type="primary" @click="update", :disabled="page.upgradeDisabled")
        //-el-dialog(:title="vuex.res.ids_update_localUpgrade" v-model="page.alertUpdating",:close-on-press-escape="false",:close-on-click-modal="false",:show-close="false")
          el-progress(:text-inside="true", :stroke-width="18", :percentage="page.percentage")
          div.loadingTxt {{vuex.res.ids_update_Updating}}
        div.tips {{vuex.res.ids_note}}:<br />{{vuex.res.ids_update_upgradingWarning}}


      //-div {{$route.name}}

</template>

<script>
import {$,_,vuex,G,_config} from '../../common.js'
import ElementUI from 'element-ui'
import ajaxFileUpload from '../../plugin/ajaxfileupload.js'
var Config = _config.localUpgrade

export default {
  created () {
    this.init();
    this.initdata(Config);
  },
  methods: {
    init (){
      this.vuex = vuex
      this.page = {
        fileUrlName:"",
        percentage:50,
        alertUpdating:false,
        upgradeDisabled:true,
        searchDisabled:false,
        stopDisabled:true,
        loading:false,
        dataPackage:[],
        checkedVal:1,
        Inter:null,
        ScannedFile:""
      }
    },/*
    showUpgradeFileUrl(){
      var urlPath = $("#fileUpload").val();
      //var imageUrlArr = urlPath.split("\\");
      //var imageName = imageUrlArr[imageUrlArr.length-1];
      this.page.fileUrlName = urlPath;
    },*/
    /*changeUpload(){
      if($.trim(this.page.fileUrlName) != ''){
        this.page.upgradeDisabled = false;
      }else{
        this.page.upgradeDisabled = true;
      }
    },*/
    searchUpgradePackage(){
      this.sdk.post("SetSearchUSBLocalUpdate",null,(res) =>{
        this.getLocalUpdateListState();
      });
      this.page.stopDisabled = false;
      this.page.loading = true;
    },
    getLocalUpdateListState(){
      this.sdk.get("GetUSBLocalUpdateList",null,(res) => {
        this.page.ScannedFile = "Scanning files " + res.Scanned;
        switch(res.Status){
          case 0:
          this.destroyedTimers();
          break;
          case 1:
          this.openTimers();
          break;
          case 2:
          this.destroyedTimers();
          if(res.List.length != 0){
            this.page.dataPackage = _.sortBy(res.List, 'usbUpgradeID');
            this.page.upgradeDisabled = false;
          }else{
            this.alertTips(vuex.res.ids_localUpgrade_NoUpdatableFile)
          }
          this.page.stopDisabled = true;
          this.page.loading = false;
          break;
          case 3:
          this.destroyedTimers();
          break;
          case 4:
          this.destroyedTimers();
          break;
          default:
          break;
        }
      })
    },
    stopSearch(){
      /*let results = {
        callback:this.init
      };*/
      this.sdk.post("SetStopSearchUSBLocalUpdate",null,(res) => {
      })
      this.page.loading = false;
      this.page.stopDisabled = true;
    },
    startUpgrade(){
      var vm = this;
      let param = {
        "usbUpgradeID":this.page.checkedVal
      }
      let result = {
          success: {
            tips: "None",
            callback() {
              vm.page.alertUpdating = true;
            }
          },
          fail: {
            tips: "None",
            callback() {
              vm.alertTips(vuex.res.ids_fail);
            }
          },
          e1: {
            tips: "None",
            callback() {
              vm.alertTips(vuex.res.ids_localUpgrade_packageError);
            }
          },
          e2: {
            tips: "None",
            callback() {
              vm.alertTips(vuex.res.ids_localUpgrade_packageLower);
            }
          },
          e3: {
            tips: "None",
            callback() {
              vm.alertTips(vuex.res.ids_localUpgrade_versionLatest);
            }
          }
      }
      vm.sdk.post("SetStartUSBLocalUpdate",param,result);
      this.page.stopDisabled = true;
    },
    openTimers(){
      if(this.Inter != null){
        clearInterval(this.Inter)
        this.Inter = null
      }
      this.Inter = setInterval(() => {
        this.getLocalUpdateListState();
      }, 1000);
    },
    destroyedTimers(){
        clearInterval(this.Inter)
        this.Inter = null
    },
    alertTips(content){
      var vm = this;
        this.$alert(content, vuex.res['ids_confirm'], {
            confirmButtonText: vuex.res['ids_ok'],
            callback: action => {
            vm.page.searchDisabled = false;
            }
        });
    }
    /*
    update (){
      if(this.page.fileUrlName!= ""){
        this.page.alertUpdating = true;
        $.ajaxFileUpload({
            url: "/goform/uploadLocalUpdateSettings",
            secureuri: false,
            fileElementId: "fileUpload",
            dataType: "json",
            complete: function() {
                //page.stopLoading();
                console.log("complete"); 
            },
            success: function(data, status) {
                if (data.error == 0) {
                    //sys.alert("ids_success");
                    console.log("Device restored.Now restarting");
                } else {
                  console.log("fail");
                }
            },
            error: function(data, status, e) {
              console.log("error");
            }
        });
        this.page.percentage = 70;
      }
      /*this.sdk.post("SetDeviceStartUpdate",this.formData,(res)=>{

      });
      
    },*/

  }
}
</script>

<style lang="sass" scoped>
.noteTips {
  padding: 101px 0 5px 0;
  font-size: 12px;
}

.loadingTxt {
  padding: 20px 0;
  text-align: center;
}
</style>
