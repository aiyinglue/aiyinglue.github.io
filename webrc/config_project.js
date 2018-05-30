import config from './config.js';
config.urlFilter.formOptions.filter_policy=[
  [0, 'ids_disable'],
  [2, 'ids_blacklist']
],
config.pageConfig.projectName = "HH70"
config.pageConfig.IsSupportAuthentication = true;

export default config;