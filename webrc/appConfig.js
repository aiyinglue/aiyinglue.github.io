import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import { $, _, vuex } from './common.js'
Vue.use(VueResource)
if ($("#ie9").length > 0) {
  $('html').attr("id", 'ie-9')
} else {
  $('html').attr("id", 'no-ie-9')
}

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          vuex: vuex,
          page: {},
          pageItem: {},
          formData: {},
          formOptions: {},
          formRules: {},
          extensionRules: {}
        }
      },
      methods: {
        initdata(Config) {
          this.pageItem = $.extend({}, Config.pageItem);
          this.formRules = $.extend({}, Config.formRules);
          this.formData = $.extend({}, Config.formData);
          this.formOptions = $.extend({}, Config.formOptions);

          let makeRule = (item) => {
            let rule = {}
            rule.trigger = item.trigger
            rule.message = item.message
            rule.validator = Config.validates[item.validator](this)
            return rule;
          }

          if (Config.formRulesExtension) {
            let vm = this;
            $.each(Config.formRulesExtension, (k, v) => {
              if ($.isArray(v)) {
                $.each(v, function(o, i) {
                  let newRule = makeRule(i)
                  _.each(vm.formRules[k], function(val, index) {
                    try {
                      if (val.message == newRule.message || val.message == vm.vuex.res[newRule.message]) {
                        vm.formRules[k].splice(index, 1)
                      }
                    } catch (err) {
                    }
                  })
                  vm.formRules[k].push(newRule)
                })

              } else {

                let newRule = makeRule(v)
                _.each(vm.formRules[k], function(val, index) {
                  try {
                    if (val.message == newRule.message || val.message == vm.vuex.res[newRule.message]) {
                      vm.formRules[k].splice(index, 1)
                    }
                  } catch (err) {
                  }
                })
                vm.formRules[k].push(newRule)
              }
            })
          }
          $.each(this.formRules, (k, v) => {
            $.each(v, (i, h) => {
              if (this.vuex.res[this.formRules[k][i].message]) {
                this.formRules[k][i].message = this.vuex.res[this.formRules[k][i].message]
              }
            })
          })
        },
        init() {},
        reset() {
          this.$refs.formData.resetFields();
          this.init()
        },
        submit(form, callback) {
          this.$refs[form].validate((valid) => {
            if (valid) {
              callback();
              //this.reset()
            } else {
              return false;
            }
          })
        }
      }
    })

  }
}
