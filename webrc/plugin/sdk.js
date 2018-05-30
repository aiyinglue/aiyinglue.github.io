import _ from 'underscore';
import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import api from './api/api.js'
import ApiSimulatorData from './api/data.js'
import {_config,vuex} from '../common.js';
import _cookie from '../plugin/jquery.cookie.js'
Vue.use(VueResource)
let apiURI = '/jrd/webapi';
let showResult = (options) => {
  let defaults = {
    duration:1000,
    type: "success",
    msg: vuex.res["ids_success"],
    callback() {}
  };
  _.extend(defaults, options);
  defaults.callback=()=>{}
  ElementUI.Message({
    duration:defaults.duration,
    type: defaults.type,
    message: defaults.msg,
    onClose: defaults.callback
  })
}
export default {
  install(Vue) {
    function initHeaders(type){
      var tk = $.cookie("t")||"";
      Vue.http.headers.common['_TclRequestVerificationKey'] = 'KSDHSDFOGQ5WERYTUIQWERTYUISDFG1HJZXCVCXBN2GDSMNDHKVKFsVBNf';
      if(tk.slice(32)!=""){
        Vue.http.headers.common['_TclRequestVerificationToken'] = tk.slice(32);
      }
    }
    Vue.sdk = {
      get: function(apiName, params, callback) {
        var requestBody = {
          "id": "12",
          "jsonrpc": "2.0",
          "method": apiName,
          "params": params || {}
        };
        if (api.hasOwnProperty(apiName)) {
          if (api[apiName].hasOwnProperty("Request")) {
            requestBody.params = api[apiName].Request(requestBody.params)
          }
        }
        initHeaders();
        Vue.http.post(apiURI, requestBody).then((response) => {
          var res= response.body.result;
          if(!res){
            if(apiName=="HeartBeat"&&(response.body.error.code == "-32698" ||  response.body.error.code == "-32699")){
              Vue.sdk.post("Logout", {},function(res){
                location.reload();
              })
            }
            res = ApiSimulatorData[apiName];
          }
          if (api.hasOwnProperty(apiName)) {
            if (api[apiName].hasOwnProperty("Response")) {
              res = api[apiName].Response(res)
            }
          }
          callback(res);          
        }, (response) => {
          console.error("API no response:",apiName);
          callback(ApiSimulatorData[apiName]);
          //ElementUI.Message.error("error")
        });
      },
      post: function(apiName, params, callback) {
        
        var requestBody = {
          "id": "12",
          "jsonrpc": "2.0",
          "method": apiName,
          "params": params || {}
        };
        if (api.hasOwnProperty(apiName)) {
          if (api[apiName].hasOwnProperty("Request")) {
            requestBody.params = api[apiName].Request(requestBody.params)
          }
        }
        initHeaders();
        Vue.http.post(apiURI, requestBody).then((response) => {
          let result = {};
          let res = response.body;
          if (res.hasOwnProperty("result")) {
            result.error = false;
          } else if (res.hasOwnProperty("error")) {
            if(res.code == "-32698" || res.code == "-32699"){
              Vue.sdk.post("Logout", {},function(res){
                location.reload();
              })
            }
            result.error = true;
            result.errorCode = "e"+res.error.code.substr(res.error.code.length-1);
          } else {
            //ElementUI.Message.error("error");
          }
          /*
          if (api.hasOwnProperty(apiName)) {
            if (api[apiName].hasOwnProperty("Response")) {
              res = api[apiName].Response(res)
            }
          }*/
          if (_.isFunction(callback)) {
            callback(res);
          } else if (_.isObject(callback)||callback==null) {
            callback=callback||{}
            var successCallbackOption = {
              tips:"Message",
              type: "success",
              msg: vuex.res["ids_success"],
              callback() {}
            };
            var failCallbackOption = {
              tips:"Message",
              type: "error",
              msg: vuex.res["ids_fail"],
              callback() {}
            };
            if (callback.hasOwnProperty("callback")&&_.isFunction(callback.callback)) {
              successCallbackOption.callback = callback.callback;
              failCallbackOption.callback = callback.callback;
            }
            if (!result.error) {
              if (callback.hasOwnProperty("success")) {
                if(_.isObject(callback.success)&&!_.isFunction(callback.success)){
                  _.extend(successCallbackOption,callback.success)
                }else if(_.isString(callback.success)){
                  successCallbackOption.msg=callback.success
                }else if(_.isFunction(callback.success)){
                  successCallbackOption.callback=callback.success
                }
                
              }
              if(successCallbackOption.tips=="Message"){
                successCallbackOption.callback(res)
                showResult(successCallbackOption);
              }else if(successCallbackOption.tips=="None"){
                successCallbackOption.callback(res)
              }
            } else {
              if (callback.hasOwnProperty("fail")) {
                if(_.isObject(callback.fail)&&!_.isFunction(callback.fail)){
                  _.extend(failCallbackOption,callback.fail)
                }else if(_.isString(callback.fail)){
                  failCallbackOption.msg=callback.fail
                }else if(_.isFunction(callback.fail)){
                  failCallbackOption.callback=callback.fail
                }
                
              }
              if(callback.hasOwnProperty(result.errorCode)){

                if(_.isObject(callback[result.errorCode])&&!_.isFunction(callback[result.errorCode])){
                    _.extend(failCallbackOption,callback[result.errorCode])
                }else if(_.isString(callback[result.errorCode])){
                  failCallbackOption.msg=callback[result.errorCode]
                }else if(_.isFunction(callback[result.errorCode])){
                  failCallbackOption.callback=callback[result.errorCode]
                }
                
              }
              if(failCallbackOption.tips=="Message"){
                failCallbackOption.callback()
                showResult(failCallbackOption);
              }else if(failCallbackOption.tips=="None"){
                failCallbackOption.callback()
              }
            }
            
          }

        }, (response) => {
          ElementUI.Message.error("error");
        });
      },
    };

    Vue.prototype.sdk = {
      get: Vue.sdk.get,
      post: Vue.sdk.post
    }

  }
}
