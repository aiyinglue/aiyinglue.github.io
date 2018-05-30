import _ from 'underscore';
import G from '../config/G.js';
import { units, vuex, sys } from '../common'

const filters = {
  networkType(value) {
    if (vuex.res[units.networkType(value)]) {
      return vuex.res[units.networkType(value)];
    } else {
      return units.networkType(value);
    }
  },
  networkName(value) {
    if (vuex.res[units.getNetworkNameStr(value)]) {
      return vuex.res[units.getNetworkNameStr(value)];
    } else {
      return units.getNetworkNameStr(value);
    }
  },
  covertNum(value) {
    return units.covertNum(value);
  },
  covertNumKb(value) {
    return units.covertNumKb(value);
  },

  usageVal(value) {
    return units.usageVal(value);
  },
  usagekmgb(value) {
    return units.usagekmgb(value);
  },
  UsedTimes(value) {
    return units.getTimePassed(value);
  },

  networkRat(value) {
    if (vuex.res[units.networkRat(value)]) {
      return vuex.res[units.networkRat(value)];
    } else {
      return units.networkRat(value);
    }
  },
  networkState(value) {
    if (vuex.res[units.networkState(value)]) {
      return vuex.res[units.networkState(value)];
    } else {
      return units.networkState(value);
    }
  },
  res(value) {
    if (vuex.res[value]) {
      return vuex.res[value];
    } else {
      return value;
    }
  },
  byTes(value) {
    return units.bytes(value);
  },
  times(second, type) {
    return units.times(second, type);
  },
  replace(strings, key, replaceKey) {
    return strings.replace(key, replaceKey);
  },
  lanProtState(value) {
    return value == 1 ? vuex.res["ids_connected"] : vuex.res["ids_disconnected"];
  },
  dataDealWith(val){
        if(val == ""){
            val = "----";
        }
        return val;
  },
  usbStateText(value) {
    return vuex.res[units.usbStateText(value)]
  },
  netConnState(value) {
    return vuex.res[units.netConnState(value)]
  },
  currentLang(value) {
    return sys.allLanguage[value]
  },

  valText(value, formOptions) {
    let currentText = _.find(formOptions, (num) => {
      return num[0] == value;
    })
    let textStr = "";
    if (!currentText) {
      textStr = formOptions[0][1]
    } else {
      textStr = currentText[1]
    }

    if (vuex.res[textStr]) {
      return vuex.res[textStr];
    } else {
      return textStr;
    }
  },
  formatTime(smsTime) {
    let formatType = 0;
    let smsDay, smsMonth, smsYear, smsHour, smsMinutes, smsSeconds, tmpDate, tmpTime;
    tmpDate = smsTime.split(" ")[0];
    tmpTime = smsTime.split(" ")[1];
    smsDay = tmpDate.split("-")[0];
    smsMonth = tmpDate.split("-")[1];
    smsYear = tmpDate.split("-")[2];
    smsHour = tmpTime.split(":")[0];
    smsMinutes = tmpTime.split(":")[1];
    smsSeconds = tmpTime.split(":")[2];
    switch (formatType) {
      case 1:
        tmpDate = smsYear + "-" + smsMonth + "-" + smsDay;
        tmpTime = smsHour + ":" + smsMinutes + ":" + smsSeconds;
        smsTime = tmpDate + " " + tmpTime;
        break;
      default:
        tmpDate = smsDay + "-" + smsMonth + "-" + smsYear;
        tmpTime = smsHour + ":" + smsMinutes + ":" + smsSeconds;
        smsTime = tmpDate + " " + tmpTime;
    }
    return smsTime;
  },
  formatBlockTime(smsTime) {
    let formatType = 0;
    let smsDay, smsMonth, smsYear, smsHour, smsMinutes, smsSeconds, tmpDate, tmpTime;
    tmpDate = smsTime.split(" ")[0];
    tmpTime = smsTime.split(" ")[1];
    smsDay = tmpDate.split("-")[2];
    smsMonth = tmpDate.split("-")[1];
    smsYear = tmpDate.split("-")[0];
    smsHour = tmpTime.split(":")[0];
    smsMinutes = tmpTime.split(":")[1];
    smsSeconds = tmpTime.split(":")[2];
    switch (formatType) {
      case 1:
        tmpDate = smsYear + "-" + smsMonth + "-" + smsDay;
        tmpTime = smsHour + ":" + smsMinutes + ":" + smsSeconds;
        smsTime = tmpDate + " " + tmpTime;
        break;
      default:
        tmpDate = smsDay + "-" + smsMonth + "-" + smsYear;
        tmpTime = smsHour + ":" + smsMinutes + ":" + smsSeconds;
        smsTime = tmpDate + " " + tmpTime;
    }
    return smsTime;
  },
  formtDuration(duration){
    let hours, minutes, seconds, callLogDuration;
    hours = Math.floor(duration / 3600);
    minutes = Math.floor((duration - hours * 3600) / 60);
    seconds = duration - hours *3600 - minutes*60;
    if(hours<10){
      hours="0"+hours;
    }
    if(minutes<10){
      minutes="0"+minutes;
    }
    if(seconds<10){
      seconds="0"+seconds;
    }
    return callLogDuration = hours + ":" + minutes +":" +seconds;
  },
  toUpperCase(str) {
    return str.toUpperCase();
  },
  signalStrength(value) {
    return units.SignalStrength(value);
  },
  showEcIoLACSellId(value) {
    return units.showEcIoLACSellId(value);
  },
  showSINR(value) {
    return units.showSINR(value);
  },
  showRSCPRSRP(value) {
    return units.showRSCPRSRP(value);
  },
  showdBm(value) {
    return units.showdBm(value);
  }
}
export default filters
