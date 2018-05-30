import G from '../config/G.js'
import { _, _config, vuex } from '../common'
let units = {}

units.networkType = (type) => {
  let networkTypeMap = _config.pageConfig.networkTypeMap;
  /*for HH40:E4\ER\01 HH41:HB\JO HH70:FL version still use netWorkDisplayType = 1 */
  if (_config.pageConfig.netWorkDisplayType == 1) {
    networkTypeMap = [
      [0, "ids_netwrok_noService"],
      [1, "GPRS"],
      [2, "EDGE"],
      [3, "HSPA"],
      [4, "HSUPA"],
      [5, "UMTS"],
      [6, "HSPA+"],
      [7, "DC-HSPA+"],
      [8, "LTE"],
      [9, "LTE+"],
      [11, "GSM"]
    ];
  }
  let currentType = _.find(networkTypeMap, (num) => {
    return num[0] == type;
  })

  if (!currentType) {
    return networkTypeMap[0][1]
  } else {
    return currentType[1];
  }
}
units.covertNum = (number) => {
  return number >= (1024 * 1024 * 1024) ? (number / (1024 * 1024 * 1024)).toFixed(2) + " " + 'GB' : (number >= (1024 * 1024) ? (number / (1024 * 1024)).toFixed(2) + " " + 'MB' : (number / 1024).toFixed(2) + " " + 'KB');
}

units.usageVal = (number) => {
  return number >= (1024 * 1024 * 1024) ? (number / (1024 * 1024 * 1024)).toFixed(2) : (number >= (1024 * 1024) ? (number / (1024 * 1024)).toFixed(2) : (number / 1024).toFixed(2));
}

units.usagekmgb = (number) => {
  return number >= (1024 * 1024 * 1024) ? 'GB' : (number >= (1024 * 1024) ? 'MB' : 'KB');
}

units.covertNumKb = (number) => {
  let value = (number / (1024 * 1024)).toFixed(2);
  return value == 0.00 ? 0 : value;
}

units.cleartTime = (number) => {
  let clearTime1, clearTime2, clearTime3, clearTime4
  clearTime1 = number.split(" ")[0];
  clearTime2 = clearTime1.split("-");
  clearTime3 = clearTime2.reverse();
  clearTime4 = clearTime3[0] + "/" + clearTime3[1] + "/" + clearTime3[2];
  return clearTime4;
}

units.networkRat = (val) => {
  let networkRatArr = _config.pageConfig.searchNetResultMap;
  /*for HH40:E4\ER\01 HH41:HB\JO HH70:FL version still use netWorkDisplayType = 1 */
  if (_config.pageConfig.netWorkDisplayType == 1) {
    networkRatArr = [
      [1, "GSM"],
      [2, "UMTS"],
      [3, "LTE"],
      [4, "CDMA"],
      [5, "ids_unknown"]
    ];
  }
  let currentRat = _.find(networkRatArr, (num) => {
    return num[0] == val;
  })
  if (!currentRat) {
    return networkRatArr[0][1];
  } else {
    return currentRat[1];
  }
}

units.networkState = (val) => {
  let networkStateArr = [
    [0, "ids_unknown"],
    [1, "ids_netwrok_available"],
    [2, "ids_netwrok_register"],
    [3, "ids_netwrok_forbidden"]
  ];
  let currentState = _.find(networkStateArr, (num) => {
    return num[0] == val;
  })
  if (!currentState) {
    return networkStateArr[0][1]
  } else {
    return currentState[1]
  }
}

units.getTimePassed = (time) => {
  var day = Math.floor(time / (3600 * 24));
  var hours = Math.floor((time - day * 3600 * 24) / 3600);
  var minutes = Math.floor((time - day * 3600 * 24 - hours * 3600) / 60);
  return day + " " + vuex.res["ids_days"] + " " + hours + " " + vuex.res["ids_hours_lowcase"] + " " + minutes + " " + vuex.res["ids_minutes"];
}
units.bytes = (bytes) => {
  if (bytes === 0) return '0';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
units.times = (second, type) => {
  var formatStr;
  var hours = parseInt(second / 60 / 60);
  var min = parseInt(second / 60 % 60);
  var sec = second % 60;

  switch (type) {
    case "1": //format:HH:mm:ss or mm:ss 
      if (hours > 0) {
        formatStr = [hours, min, sec].join(":").replace(/\b(\d)\b/g, "0$1");
      } else {
        formatStr = [min, sec].join(":").replace(/\b(\d)\b/g, "0$1");
      }
      break;
    case "2": //format:HH:mm:ss 
      formatStr = [hours, min, sec].join(":").replace(/\b(\d)\b/g, "0$1");
      break;
  }
  return formatStr;
}

units.usbStateText = (val) => {
  let Arr = [
    [0, "ids_usb_notInsert"],
    [1, "ids_usb_storage"],
    [2, "ids_usb_print"]
  ];
  let current = _.find(Arr, (num) => {
    return num[0] == val;
  })
  if (!current) {
    return Arr[0][1]
  } else {
    return current[1]
  }
}

units.netConnState = (val) => {
  let Arr = [
    [0, "ids_disconnected"],
    [1, "ids_connecting"],
    [2, "ids_connected"],
    [3, "ids_disconnecting"]
  ];
  let current = _.find(Arr, (num) => {
    return num[0] == val;
  })
  if (!current) {
    return Arr[0][1]
  } else {
    return current[1]
  }
}

units.getSystemTime = () => {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth() + 1;
  var currentDay = currentDate.getDate();
  var currentHours = currentDate.getHours();
  var currentMinutes = currentDate.getMinutes();
  var currentSecs = currentDate.getSeconds();
  var currentTime = "";
  currentTime += currentYear + "-";
  currentTime += ((currentMonth < 10) ? "0" : "") + currentMonth + "-";
  currentTime += ((currentDay < 10) ? "0" : "") + currentDay + " ";
  currentTime += ((currentHours < 10) ? "0" : "") + currentHours + ":";
  currentTime += ((currentMinutes < 10) ? "0" : "") + currentMinutes + ":";
  currentTime += ((currentSecs < 10) ? "0" : "") + currentSecs;
  return currentTime
}

units.getNetworkNameStr = (networkName) => {
  let wanNetworkNameStr = "";
  switch (networkName) {
    case "":
    case "N/A":
    case "NA":
      wanNetworkNameStr = "ids_netwrok_noService";
      break;
    default:
      wanNetworkNameStr = networkName;
  }
  return wanNetworkNameStr;
}

units.encrypt = function(str) {
  if (str == "" || str == undefined) {
    return "";
  }
  var key = "e5dl12XYVggihggafXWf0f2YSf2Xngd1";
  var str1 = [];
  var encryStr = "";
  for (var i = 0; i < str.length; i++) {
    var char_i = str.charAt(i);
    var num_char_i = char_i.charCodeAt();
    str1[2 * i] = (key[i % key.length].charCodeAt() & 0xf0) | ((num_char_i & 0xf) ^ (key[i % key.length].charCodeAt() & 0xf));
    str1[2 * i + 1] = (key[i % key.length].charCodeAt() & 0xf0) | ((num_char_i >> 4) ^ (key[i % key.length].charCodeAt() & 0xf));
  }
  for (var i = 0; i < str1.length; i++) {
    encryStr += String.fromCharCode(str1[i]);
  }
  return encryStr;
}
var uiencryptkey = "AKFKHH45665sdafa456465adsfdsafdsadfasfdsfaf456465gasdgdsageagdsagdsJHGje";

units.uiencrypt = function(str) {
  if (str == "" || str == undefined) {
    return "";
  }
  var key = uiencryptkey;
  var str1 = [];
  var encryStr = "";
  for (var i = 0; i < str.length; i++) {
    var char_i = str.charAt(i);
    var num_char_i = char_i.charCodeAt();
    str1[2 * i] = (key[i % key.length].charCodeAt() & 0xf0) | ((num_char_i & 0xf) ^ (key[i % key.length].charCodeAt() & 0xf));
    str1[2 * i + 1] = (key[i % key.length].charCodeAt() & 0xf0) | ((num_char_i >> 4) ^ (key[i % key.length].charCodeAt() & 0xf));
  }
  for (var i = 0; i < str1.length; i++) {
    encryStr += String.fromCharCode(str1[i]);
  }
  return encryStr;
}

units.uidecrypt = function(str) {
  if (str == "" || str == undefined) {
    return "";
  }
  var jrd_key = uiencryptkey;
  var key_len = jrd_key.length;
  var tmp_str = [];
  var new_i;
  for (i = 0; i < str.length; i++) {
    if (i == 0) {
      new_i = 0;
    } else {
      new_i = i / 2;
    }
    tmp_str[new_i] = ((str[i + 1].charCodeAt() ^ jrd_key[new_i % key_len].charCodeAt()) << 4) | ((str[i].charCodeAt() ^ jrd_key[new_i % key_len].charCodeAt()) & 0xf);
    i++;
  }
  var dencryStr = "";
  for (var i = 0; i < tmp_str.length; i++) {
    dencryStr += String.fromCharCode(tmp_str[i]);
  }
  return dencryStr;
}

units.SignalStrength = function(value) {
  var range = /^[0,1,2,3,4,5]$/;
  value = parseInt(value);
  /*if (value > 4) {
    value = 4;
  }*/
  value = range.test(value) ? value : 0;
  return value;
}
units.showEcIoLACSellId = function(val) {
  if (val == '0') {
    return '- -'
  } else {
    return val
  }
}
units.showSINR = function(val) {
  if (val == 'FF') {
    return '- -'
  } else {
    return this.showdBm(val)
  }
  // body...
}
units.showRSCPRSRP = function(val) {
  if (val == -1) {
    return '- -'
  } else {
    return this.showdBm(val)
  }
}
units.showdBm = function(val) {
  val = val || "0";
  return val + "dBm"
}

export default units;