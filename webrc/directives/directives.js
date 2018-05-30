import Vue from 'vue'
import $ from 'jquery'

Vue.directive('formLabelIcon', {
  inserted: function (el,binding) {    
    let $el = $(el);
    let iconTemplate = $el.find(".iconfont");
    if(binding.value){
      $el.find(".el-form-item__label").append(iconTemplate);
    }else{
      iconTemplate.remove()
    }    
  }
})
