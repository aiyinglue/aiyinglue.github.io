import $ from './plugin/jquery-vendor.js';
import _ from 'underscore';
import vuex from './vuex.js';
//import _config from './config.js';
import _config from './config_custom.js';
import G from './config/G.js';
import sys from './config/sys.js';
import {countryCodeALL} from './config/countryCode.js';
import units from './plugin/units.js';

export {
  $,
  vuex,
  _config,
  G,
  _,
  units,
  sys,
  countryCodeALL
}