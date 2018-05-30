/**
 * Created by jinhui.lu on 16/11/09.
 */

//DiaUp
import mobileConnection from './views/DialUp/mobileConnection.vue';
import monthlyPlan from './views/DialUp/monthlyPlan.vue';
import networkSettings from './views/DialUp/networkSettings.vue';
import profileManagement from './views/DialUp/profileManagement.vue';
//WAN
import macClone from './views/WAN/macClone.vue';
import wanConfigure from './views/WAN/wanConfigure.vue';
import wanStatus from './views/WAN/wanStatus.vue';

//WLAN
import basic from './views/WLAN/basic.vue';
import advanced from './views/WLAN/advanced.vue';
import wps from './views/WLAN/wps.vue';

//Security
import macFilter from './views/Security/macFilter.vue';
import wanPing from './views/Security/wanPing.vue';
import pinManagement from './views/Security/pinManagement.vue';
import routingRules from './views/Security/routingRules.vue';
import ipFilter from './views/Security/ipFilter.vue';
import urlFilter from './views/Security/urlFilter.vue';
import parentalControl from './views/Security/parentalControl.vue';
import ddns from './views/Security/ddns.vue';

import vpn from './views/Security/vpn.vue';
//LAN
import lanSettings from './views/LAN/lanSettings.vue';

//system
import changePassword from './views/System/changePassword.vue';
import backup from './views/System/backup.vue';
import deviceInfo from './views/System/deviceInfo.vue';
import localUpgrade from './views/System/localUpgrade.vue';
import onlineUpgrade from './views/System/onlineUpgrade.vue';
import reboot from './views/System/reboot.vue';
import reset from './views/System/reset.vue';
import resetReboot from './views/System/resetReboot.vue';
import restore from './views/System/restore.vue';
import systemSettings from './views/System/systemSettings.vue';
import ntpServer from './views/System/ntpServer.vue';
import tr069 from './views/System/tr069.vue';
import activePicopoint from './views/System/activePicopoint.vue';


//NatSettings
import alg from './views/NatSettings/alg.vue';
import dmz from './views/NatSettings/dmz.vue';
import upnp from './views/NatSettings/upnp.vue';
import virtualServer from './views/NatSettings/virtualServer.vue';

import qos from './views/qos.vue';


//Statistics
import internetStatistics from './views/Statistics/internetStatistics.vue';
import diagnostic from './views/Statistics/diagnostic.vue';
import lanStatistics from './views/Statistics/lanStatistics.vue';
import wlanStatistics from './views/Statistics/wlanStatistics.vue';

//Status
import internetStatus from './views/Status/internetStatus.vue';
import lanStatus from './views/Status/lanStatus.vue';
import wlanStatus from './views/Status/wlanStatus.vue';

//setupWizard
import setupWizard from './views/setupWizard.vue';

//Share
import usb from './views/Share/usb.vue';
import storageShare from './views/Share/storageShare.vue';
import dlna from './views/Share/dlna.vue';
import userSettings from './views/Share/userSettings.vue';

//SMS
import draft from './views/SMS/draft.vue';
import inbox from './views/SMS/inbox.vue';
import newSMS from './views/SMS/newSMS.vue';
import outbox from './views/SMS/outbox.vue';
import smsForwarding from './views/SMS/smsForwarding.vue'
import smsSettings from './views/SMS/smsSettings.vue';


import login from './views/login.vue';
import callLogs from './views/callLogs.vue';
import index from './views/index.vue';

let routers = [
  //other
  { path: '/', component: internetStatus },
  { name: 'home', path: '/home', component: internetStatus },

  //Statistics
  { name: 'internetStatistics', path: '/internetStatistics', component: internetStatistics },
  { name: 'diagnostic', path: '/diagnostic', component: diagnostic },
  { name: 'lanStatistics', path: '/lanStatistics', component: lanStatistics },
  { name: 'wlanStatistics', path: '/wlanStatistics', component: wlanStatistics },
  //Status
  { name: 'internetStatus', path: '/internetStatus', component: internetStatus },
  { name: 'lanStatus', path: '/lanStatus', component: lanStatus },
  { name: 'wlanStatus', path: '/wlanStatus', component: wlanStatus },

  //setupWizard
  { name: 'setupWizard', path: '/setupWizard', component: setupWizard },

  //DiaUp
  { name: 'mobileConnection', path: '/mobileConnection', component: mobileConnection },
  { name: 'monthlyPlan', path: '/monthlyPlan', component: monthlyPlan },
  { name: 'networkSettings', path: '/networkSettings', component: networkSettings },
  { name: 'profileManagement', path: '/profileManagement', component: profileManagement },

  //WLAN
  { name: 'basic', path: '/basic', component: basic },
  { name: 'advanced', path: '/advanced', component: advanced },
  { name: 'wps', path: '/wps', component: wps },


  //WAN
  { name: 'macClone', path: '/macClone', component: macClone },
  { name: 'wanConfigure', path: '/wanConfigure', component: wanConfigure },
  { name: 'wanStatus', path: '/wanStatus', component: wanStatus },


  //Security
  { name: 'macFilter', path: '/macFilter', component: macFilter },
  { name: 'wanPing', path: '/wanPing', component: wanPing },
  { name: 'pinManagement', path: '/pinManagement', component: pinManagement },
  { name: 'routingRules', path: '/routingRules', component: routingRules },
  { name: 'ipFilter', path: '/ipFilter', component: ipFilter },
  { name: 'urlFilter', path: '/urlFilter', component: urlFilter },
  { name: 'parentalControl', path: '/parentalControl', component: parentalControl },
  { name: 'vpn', path: '/vpn', component: vpn },
  { name: 'ddns', path: '/ddns', component: ddns },


  //lan
  { name: 'lanSettings', path: '/lanSettings', component: lanSettings },

  //system
  { name: 'changePassword', path: '/changePassword', component: changePassword },
  { name: 'backup', path: '/backup', component: backup },
  { name: 'deviceInfo', path: '/deviceInfo', component: deviceInfo },
  { name: 'localUpgrade', path: '/localUpgrade', component: localUpgrade },
  { name: 'onlineUpgrade', path: '/onlineUpgrade', component: onlineUpgrade },
  { name: 'reboot', path: '/reboot', component: reboot },
  { name: 'reset', path: '/reset', component: reset },
  { name: 'resetReboot', path: '/resetReboot', component: resetReboot },
  { name: 'restore', path: '/restore', component: restore },
  { name: 'systemSettings', path: '/systemSettings', component: systemSettings },
  { name: 'ntpServer', path: '/ntpServer', component: ntpServer },
  { name: 'tr069', path: '/tr069', component: tr069 },
  { name: 'activePicopoint', path: '/activePicopoint', component: activePicopoint },

  //NatSettings
  { name: 'alg', path: '/alg', component: alg },
  { name: 'upnp', path: '/upnp', component: upnp },
  { name: 'dmz', path: '/dmz', component: dmz },
  { name: 'virtualServer', path: '/virtualServer', component: virtualServer },

  //Share
  { name: 'usb', path: '/usb', component: usb },
  { name: 'storageShare', path: '/storageShare', component: storageShare },
  { name: 'dlna', path: '/dlna', component: dlna },
  { name: 'userSettings', path: '/userSettings', component: userSettings },

  { name: 'qos', path: '/qos', component: qos },


  //SMS
  { name: 'draft', path: '/draft', component: draft },
  { name: 'inbox', path: '/inbox', component: inbox },
  { name: 'newSMS', path: '/newSMS', component: newSMS },
  { name: 'outbox', path: '/outbox', component: outbox },
  { name: 'smsForwarding', path: '/smsForwarding', component: smsForwarding },
  { name: 'smsSettings', path: '/smsSettings', component: smsSettings },

  { name: 'login', path: '/login', component: login },
  { name: 'incomingCall', path: '/incomingCall', component: callLogs },
  { name: 'outgoingCall', path: '/outgoingCall', component: callLogs },
  { name: 'missedCall', path: '/missedCall', component: callLogs },
  { name: 'index', path: '/index', component: index }

];

export default routers;
