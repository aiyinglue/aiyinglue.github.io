/*
全局变量
*/
import { $, vuex, _config } from '../common.js';
let sms = {
  SMS_UCS2_MAX_SIZE: 670, //70*10
  SMS_7BIT_MAX_SIZE: 1530, //153*10
  G_SmsCounts: 0,
  isLatamSMS: _config.newSMS.pageItem.isSupportLatamSMS,
  GSM_7BIT_NUM: 128,
  //currentCount:0,
  phoneNumber:"",
  smsContent:"",
  smsId:0,
  arrayGSM_7DefaultTable: [
    0x0040, 0x00A3, 0x0024, 0x00A5, 0x00E8, 0x00E9, 0x00F9, 0x00EC, 0x00F2, 0x00C7, 0x000A, 0x00D8, 0x00F8, 0x000D, 0x00C5, 0x00E5,
    0x0394, 0x005F, 0x03A6, 0x0393, 0x039B, 0x03A9, 0x03A0, 0x03A8, 0x03A3, 0x0398, 0x039E, 0x001B, 0x00C6, 0x00E6, 0x00DF, 0x00C9,
    0x0020, 0x0021, 0x0022, 0x0023, 0x00A4, 0x0025, 0x0026, 0x0027, 0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
    0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
    0x00A1, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
    0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005A, 0x00C4, 0x00D6, 0x00D1, 0x00DC, 0x00A7,
    0x00BF, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
    0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007A, 0x00E4, 0x00F6, 0x00F1, 0x00FC, 0x00E0
  ],
  arrayGSM_7ExtTable: [
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0x000A, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
    0x007C, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
  ],
  arrayLatamTable: [
    0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C8,
    0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE,
    0x00CF, 0x00D2, 0x00D3, 0x00D4, 0x00D5,
    0x00D9, 0x00DA, 0x00DB, 0x00DD, 0x00E1,
    0x00E2, 0x00E3, 0x00E7, 0x00EA, 0x00EB,
    0x00ED, 0x00EE, 0x00EF, 0x00F3, 0x00F4,
    0x00F5, 0x00FA, 0x00FB, 0x00FD, 0x00FF
  ],
  arrayLatamTableStr: [
    0x0041, 0x0041, 0x0041, 0x0041, 0x0045,
    0x0045, 0x0045, 0x0049, 0x0049, 0x0049,
    0x0049, 0x004F, 0x004F, 0x004F, 0x004F,
    0x0055, 0x0055, 0x0055, 0x0059, 0x0061,
    0x0061, 0x0061, 0x00C7, 0x0065, 0x0065,
    0x0069, 0x0069, 0x0069, 0x006F, 0x006F,
    0x006F, 0x0075, 0x0075, 0x0079, 0x0079
],
  isUcs2(str) {
    return this.ucs2_number_check(str) > 0 ? true : false;
  },
  ucs2_number_check(str) {
    let i;
    let char_i;
    let num_char_i;

    let j;
    let flag;
    let ucs2_num_temp = 0;

    if (str.length == 0) {
      return 0;
    }
    for (i = 0; i < str.length; i++) {
      flag = 0;
      char_i = str.charAt(i);
      num_char_i = char_i.charCodeAt();
      for (j = 0; j < this.GSM_7BIT_NUM; j++) {
        //if ((num_char_i == this.arrayGSM_7DefaultTable[j]) || (num_char_i == this.arrayGSM_7ExtTable[j]) || (config.isLatamSMS && (num_char_i == this.arrayLatamTable[j]))) {
        if ((num_char_i == this.arrayGSM_7DefaultTable[j]) || (num_char_i == this.arrayGSM_7ExtTable[j]) || (this.isLatamSMS && (num_char_i == this.arrayLatamTable[j]))) {
          flag = 1;
          flag = 1;
          break;
        }
      }
      if (0 == flag) {
        ucs2_num_temp++;
      }
    }
    return ucs2_num_temp;
  },
  get7ExtNum(str) {
    let i;
    let j;
    let char_i;
    let num_char_i;
    let num7Ext = 0;
    for (i = 0; i < str.length; i++) {
      char_i = str.charAt(i);
      num_char_i = char_i.charCodeAt();
      for (j = 0; j < this.GSM_7BIT_NUM; j++) {
        if (num_char_i == this.arrayGSM_7ExtTable[j]) {
          num7Ext++;
        }
      }
    }
    return num7Ext;
  },
  getSmsCountStr(strLen, type) {
    let counts;
    let singleStrNumA, singleStrNumB;
    let isUcs2 = type === "ucs2";
    let totalNum;
    singleStrNumA = isUcs2 ? 70 : 160;
    singleStrNumB = isUcs2 ? 67 : 153;
    if (strLen <= singleStrNumA) {
      //return "(1)";
      return 1;
    } else if (strLen > singleStrNumA) {
      counts = Math.ceil(strLen / singleStrNumB);
      this.G_SmsCounts = counts;
      totalNum = counts > 10 ? 3 : Math.floor(30 / counts);
      //return "(" + counts + ")";
      return counts;
    }
  },
  getSystemTime() {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();
    let currentHours = currentDate.getHours();
    let currentMinutes = currentDate.getMinutes();
    let currentSecs = currentDate.getSeconds();
    let currentTime = "";
    currentTime += currentYear + "-";
    currentTime += ((currentMonth < 10) ? "0" : "") + currentMonth + "-";
    currentTime += ((currentDay < 10) ? "0" : "") + currentDay + " ";
    currentTime += ((currentHours < 10) ? "0" : "") + currentHours + ":";
    currentTime += ((currentMinutes < 10) ? "0" : "") + currentMinutes + ":";
    currentTime += ((currentSecs < 10) ? "0" : "") + currentSecs;
    return currentTime
  },

  /*doAction(router,type,smsData) {
    switch (type) {
        case "reply":
          sms.doReply(router,type,smsData);
          break;
        case "forword":
          sms.doForward(router,type,smsData);
          break;
        case "edit":
          sms.doEdit(smsData);
          break;
        default:
          sms.doWrite(router,type,smsData);
    }
  },*/
  /*doWrite(router,type,smsData) {
    let writeSmsRouter={
      name: "newSMS",
      params: {pageType:type}
    };
    router.push(writeSmsRouter);
    sms.phoneNumber="";
    sms.smsContent="";
  },*/
  doReply(router,type,replyData) {
    let replySmsRouter={
      name: "newSMS",
      params: {pageType:type}
    };
    sms.phoneNumber = replyData.PhoneNumber;
    sms.smsContent = replyData.SMSContent;
    router.push(replySmsRouter);
    /*if (currentCount == totalCount && totalCount != 0) {
      sys.alert("ids_dlg_sms_smsFull");
    }*/
  },
  doForward(router,type,forwardData) {
    let forwardSmsRouter={
      name: "newSMS",
      params: {pageType:type}
    };
    sms.phoneNumber = forwardData.PhoneNumber;
    sms.smsContent = forwardData.SMSContent;
    router.push(forwardSmsRouter);
    /*if (currentCount == totalCount && totalCount != 0) {
      sys.alert("ids_dlg_sms_smsFull");
    }*/
  },
  doEdit(router,type, smsInfo) {
    let editSmsRouter={
      name: "newSMS",
      params: {pageType:type}
    };
    sms.phoneNumber = smsInfo.PhoneNumber;
    sms.smsContent = smsInfo.SMSContent;
    sms.smsId = smsInfo.SMSId;
    _config.newSMS.formData.Flag = 1;
    router.push(editSmsRouter);
  },
  phoneNumberRule(phoneNumber) {
    return /^[+|\d]?[0-9]{1,19}$/.test(phoneNumber);
  },
  multipleRecipinentsRule(inputNumber){
    return /^[+|;|\d]*$/.test(inputNumber);
  },
  recipientNumberRule(recipientNumber){
    if(_config.smsForwarding.pageItem.eeCustom){
      if(/^[0][0-9]{10}$/.test(recipientNumber) || /^[+][0-9]{13}$/.test(recipientNumber) || /^[0]{2}[0-9]{12}$/.test(recipientNumber) || /^[+][4]{2}[0-9]{10}$/.test(recipientNumber)){
        return true;
      }else{
        return false;
      }
    }else{
      return /^[+|\d]?[0-9]{1,19}$/.test(recipientNumber);
    }

  },
  to7BITStr(str) {
    let i;
    let char_i;
    let num_char_i;

    let j;
    let flag;
    let trueStr = "";

    let k;
    for (i = 0; i < str.length; i++) {
      flag = 0;
      char_i = str.charAt(i);
      num_char_i = char_i.charCodeAt();
      let positionNnm = this.position(num_char_i);
      if (!isNaN(positionNnm) && positionNnm >= 0 && positionNnm < this.arrayLatamTable.length) {
        num_char_i = this.arrayLatamTableStr[positionNnm];
      }
      for (j = 0; j < this.GSM_7BIT_NUM; j++) {
        if (num_char_i == this.arrayGSM_7DefaultTable[j] || (num_char_i == this.arrayGSM_7ExtTable[j])) {
          flag++
        }
      }

      if (flag == 0) {
        num_char_i = 0x0020;
      }
      trueStr += String.fromCharCode(num_char_i);
    }

    return trueStr;
  },
  position(value) {
    for (var i in this.arrayLatamTable) {
      if (this.arrayLatamTable[i] == value) {
        return i;
        break;
      }
    }
  }
  /*smsGoBack(listName) {
    if (listName == "outbox") {
      this.page.outboxListDisplay=false;
      this.page.outboxDetailDisplay=true;
    } else{
      this.page.inboxListDisplay=false;
      this.page.inboxDetailDisplay=true;
    }
  }
  saveEvent(saveData) {
    let results = {
      callback: this.init
    };
    this.sdk.post("SaveSMS", saveData, results);
  },
  sendEvent(sendData) {
    let results = {
      callback: this.init
    };
    this.sdk.post("SendSMS", sendData, results);
  }*/
}
export default sms;
