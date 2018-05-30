import $ from 'jquery';

function isASCIIData(str) {
  if (str == null) {
    return true;
  }
  var i = 0;
  var char_i;
  var num_char_i;
  for (i = 0; i < str.length; i++) {
    char_i = str.charAt(i);
    num_char_i = char_i.charCodeAt();
    if (num_char_i > 255) {
      return false;
    }
  }
}

function isNumber(str) {
  return /^[0-9]+$/.test(str);
}

function isHexaDigit(digit) {
  var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
  var len = hexVals.length;
  var i = 0;
  var ret = false;

  for (i = 0; i < len; i++) {
    if (digit == hexVals[i]) {
      break;
    }
  }

  if (i < len) {
    ret = true;
  }
  return ret;
}

function isHexaData(data) {
  var len = data.length;
  var i = 0;
  for (i = 0; i < len; i++) {
    if (isHexaDigit(data.charAt(i)) == false) {
      return false;
    }
  }
  return true;
}

function getLeftMostZeroBitPos(num) {
  var i = 0;
  var numArr = [128, 64, 32, 16, 8, 4, 2, 1];

  for (i = 0; i < numArr.length; i++)
    if ((num & numArr[i]) == 0)
      return i;

  return numArr.length;
}

function getRightMostOneBitPos(num) {
  var i = 0;
  var numArr = [1, 2, 4, 8, 16, 32, 64, 128];

  for (i = 0; i < numArr.length; i++)
    if (((num & numArr[i]) >> i) == 1)
      return (numArr.length - i - 1);

  return -1;
}

function inet_aton(a) {
  var n;
  n = a.split(/\./);
  if (n.length != 4) {
    return 0;
  }
  return ((n[0] << 24) | (n[1] << 16) | (n[2] << 8) | n[3]);
}


function inet_ntoa(n) {
  var a;
  a = (n >> 24) & 255;
  a += "."
  a += (n >> 16) & 255;
  a += "."
  a += (n >> 8) & 255;
  a += "."
  a += n & 255;
  return a;
}



function check_input_char(str) {
  /*not support char*/
  var MACRO_SUPPORT_CHAR_MIN = 32;
  var MACRO_SUPPORT_CHAR_MAX = 127;
  var MACRO_NOT_SUPPORT_CHAR_COMMA = 44; //,
  var MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK = 34; //"
  var MACRO_NOT_SUPPORT_CHAR_COLON = 58; //:
  var MACRO_NOT_SUPPORT_CHAR_SEMICOLON = 59; //;
  var MACRO_NOT_SUPPORT_BACKSLASH_MARK = 92; //\
  var MACRO_NOT_SUPPORT_CHAR_38 = 38; //&
  var MACRO_NOT_SUPPORT_CHAR_39 = 39; //'
  var MACRO_NOT_SUPPORT_CHAR_42 = 42; //*
  var MACRO_NOT_SUPPORT_CHAR_47 = 47; ///
  var MACRO_NOT_SUPPORT_CHAR_60 = 60; //<
  var MACRO_NOT_SUPPORT_CHAR_62 = 62; //>
  var MACRO_NOT_SUPPORT_CHAR_63 = 63; //?
  var MACRO_NOT_SUPPORT_CHAR_124 = 124; //|
  var i;
  var char_i;
  var num_char_i;

  if (str == "") {
    return true;
  }

  for (i = 0; i < str.length; i++) {
    char_i = str.charAt(i);
    num_char_i = char_i.charCodeAt();
    if ((num_char_i > MACRO_SUPPORT_CHAR_MAX) || (num_char_i < MACRO_SUPPORT_CHAR_MIN)) {
      return false;
    } else if ((MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_COLON == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_SEMICOLON == num_char_i) || (MACRO_NOT_SUPPORT_BACKSLASH_MARK == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_38 == num_char_i)) {
      return false;
    } else {
      continue;
    }
  }
  return true;
}

function check_profile_password(str) {
  return str == "" || !(/[\s'\"\\]/g.test(str))
}
var validate = {
  required: function () {
    return arguments[0] != "";
  },
  number: function () {
    return /^\d+$/.test(arguments[0]);
  },
  eq: function () {
    return arguments[0] == arguments[1];
  },
  gt: function () {
    return arguments[0] > arguments[1];
  },
  gte: function () {
    return arguments[0] >= arguments[1];
  },
  lt: function () {
    return arguments[0] < arguments[1];
  },
  lte: function () {
    return arguments[0] <= arguments[1];
  },
  password: function () {
    return /^[A-Za-z0-9\-\+\!\^\$\@\#\&\*]{4,16}$/.test(arguments[0]);
  },
  gtLen: function () {
    return arguments[0].length > arguments[1]
  },
  ltLen: function () {
    return arguments[0].length < arguments[1]

  },
  pin: function () {
    return this.required(arguments[0]) && this.gtLen(arguments[0], 3) && this.ltLen(arguments[0], 9) && this.number(arguments[0]);
  },

  puk: function () {
    var pukCode = arguments[0];
    return this.required(arguments[0]) && pukCode.length == 8 && isNumber(pukCode);
  },

  simlockCode: function () {
    var simlockCode = arguments[0];
    return simlockCode.length == 10 && isNumber(simlockCode);
  },

  smsNumber: function () {
    return /^[+]?[0-9]{3,20}$/.test(arguments[0]);
  },

  inputChar: check_input_char,

  wpsPin: function (str) {
    if (str.length != 4 && str.length != 8) {
      return false;
    }
    if (isNaN(str) == true) {
      return false;
    }
    return true;
  },

  wepKey: function (key) {
    var len = key.length;
    switch (len) {
      case 5:
      case 13:
        if (isASCIIData(key) == false) {
          return false;
        }
        break;
      case 10:
      case 26:
        if (isHexaData(key) == false) {
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  },

  wpaKey: function (key) {
    if ((key.length < 8) || (key.length > 63) || check_input_char(key) == false) {
      return false;
    } else {
      return true;
    }
  },
  devicename: function (str) {
    if (str == undefined) {
      return false
    }
    if (str != "" && !check_input_char(str)) {
      return false;
    } else {
      return true;
    }
  },
  ssid: function (str) {
    return /^[A-Za-z0-9\.\s\-\_]+$/.test(str);
  },

  billingDay: function (str) {
    if (str == "" || str < 1 || str > 31 || !isNumber(str)) {
      return false;
    }
    return true;
  },

  monthlyPlan: function (str) {
    if (str != "") {
      if (str < 0 || str > 1024 || !isNumber(str)) {
        return false;
      }
      return true;
    }
  },

  timeLimitTimes: function (str) {
    if (str == "" || str < 0 || str > 43200 || !isNumber(str)) {
      return false;
    }
    return true;
  },

  UserUpBand: function (str) {
    if (str == undefined) {
      return true;
    }
    if (str != "") {
      if (str < 100 || !isNumber(str) || str > 1500000) {
        return false;
      }
      return true;
    }
  },
  UserDownBand: function (str) {
    if (str == undefined) {
      return true;
    }
    if (str != "") {
      if (str < 500 || !isNumber(str) || str > 15000000) {
        return false;
      }
      return true;
    }
  },
  informInterval: function (str) {
    if (str == "" || str < 0 || str > 2678400 || isNaN(str)) {
      return false;
    }
    return true;
  },

  acsUrl: function (str) {
    var regHttp = new RegExp("((^http)|(^https)):\/\/(\\w)+\.(\\w)+");
    if (!regHttp.test(str)) {
      return false;
    }
    return true;
  },
  acsUserName: function (str) {
    if (str == "") {
      return false;
    }
    return true;
  },

  acsUserPassword: function (str) {
    if (str == "") {
      return false;
    }
    return true;
  },

  conReqUserName: function (str) {
    if (str == "") {
      return false;
    }
    return true;
  },

  conReqUserPassword: function (str) {
    if (str == "") {
      return false;
    }
    return true;
  },

  ip: function (ip) {
    if (ip == undefined) {
      return false
    }
    if (ip == "") {
      return true;
    }
    var addrParts = ip.split('.');
    if (addrParts.length != 4) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) == true) {
        return false;
      }

      if (addrParts[i] == '') {
        return false;
      }

      if (addrParts[i].indexOf(' ') != -1) {
        return false;
      }

      if ((addrParts[i].indexOf('0') == 0) && (addrParts[i].length != 1)) {
        return false;
      }
    }

    if ((addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223) || (addrParts[1] < 0 || addrParts[1] > 255) || (addrParts[2] < 0 || addrParts[2] > 255) || (addrParts[3] <= 0 || addrParts[3] >= 255)) {
      return false;
    }

    return true;
  },
  macAddressPart: function () {
    /*return this.required(arguments[0]) && this.gtLen(arguments[0], 3) && this.ltLen(arguments[0], 9) && this.number(arguments[0]);*/
    if (arguments[0].length != 2) {
      return false;
    }

    for (j = 0; j < arguments[0].length; j++) {
      var c = arguments[0].toLowerCase().charAt(j);
      if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  },
  macAddr: function (address) {
    if (address == "") {
      return true;
    }
    var c = '';
    var i = 0,
      j = 0;
    var OddVals = new Array("1", "3", "5", "7", "9", "b", "d", "f");

    if (address == 'ff:ff:ff:ff:ff:ff') {
      return false;
    }

    let addrParts = address.split(':');
    if (addrParts.length != 6) {
      return false;
    }
    for (i = 0; i < 6; i++) {
      if (addrParts[i].length != 2) {
        return false;
      }

      for (j = 0; j < addrParts[i].length; j++) {
        c = addrParts[i].toLowerCase().charAt(j);
        if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
          continue;
        } else {
          return false;
        }
      }
    }

    c = addrParts[0].toLowerCase().charAt(1);

    for (i = 0; i < OddVals.length; i++) {
      if (c == OddVals[i]) {
        return false;
      }
    }

    return true;
  },

  subnetMask: function (mask) {
    var i = 0;
    var num = 0;
    var zeroBitPos = 0,
      oneBitPos = 0;
    var zeroBitExisted = false;

    if (mask == '0.0.0.0') {
      return false;
    }

    if (mask == '255.255.255.255') {
      return false;
    }

    var maskParts = mask.split('.');
    if (maskParts.length != 4) {
      return false;
    }

    for (i = 0; i < 4; i++) {
      if (isNaN(maskParts[i]) == true) {
        return false;
      }
      if (maskParts[i] == '') {
        return false;
      }
      if (maskParts[i].indexOf(' ') != -1) {
        return false;
      }

      if ((maskParts[i].indexOf('0') == 0) && (maskParts[i].length != 1)) {
        return false;
      }

      num = parseInt(maskParts[i]);
      if (num < 0 || num > 255) {
        return false;
      }
      if (zeroBitExisted == true && num != 0) {
        return false;
      }
      zeroBitPos = getLeftMostZeroBitPos(num);
      oneBitPos = getRightMostOneBitPos(num);
      if (zeroBitPos < oneBitPos) {
        return false;
      }
      if (zeroBitPos < 8) {
        zeroBitExisted = true;
      }
    }

    return true;
  },

  port: function (str) {
    if (str == '') {
      return true;
    }
    if (str == "" || str < 0 || str > 65535 || !isNumber(str)) {
      return false;
    }
    return true;
  },

  dhcpTime: function (str) {
    if (str == "" || str < 2 || str > 2880 || !isNumber(str)) {
      return false;
    }
    return true;
  },

  profileName: function (str) {
    return !(/[:;\,\"\\&%<>?\+]+/g.test(str));
  },
  profilePw: function (str) {
    return !(/[\s'\"\\]/g.test(str));
  },
  checkUSSDNextCode: function (code) {
    return /^[0-9\#\*]+$/.test(code);
  },

  hostName: function (name) {
    var doname = /^([\w-]+\.)+(home)$/;
    if (!doname.test(name)) {
      return false;
    }
    return true;
  },

  IsBroadcastOrNetworkAddress: function (Ip, Netmask) {
    var ip;
    var mask;
    var netaddr;
    var broadaddr;
    ip = inet_aton(Ip);
    mask = inet_aton(Netmask);
    netaddr = ip & mask;
    broadaddr = netaddr | ~mask;
    if (netaddr == ip || ip == broadaddr) {
      return false;
    }
    return true;
  },

  IsAvailableIpPool: function (homeIp, startIp, endIp) {
    if (homeIp == "" || startIp == "" || endIp == "") {
      return true
    }
    var H = homeIp.split(".");
    var S = startIp.split(".");
    var E = endIp.split(".");

    var x3 = 256 * 256 * 256;
    var x2 = 256 * 256;
    var x1 = 256;

    var H1 = (parseInt(H[0]) * x3) + (parseInt(H[1]) * x2) + (parseInt(H[2]) * x1) + parseInt(H[3]);
    var S1 = (parseInt(S[0]) * x3) + (parseInt(S[1]) * x2) + (parseInt(S[2]) * x1) + parseInt(S[3]);
    var E1 = (parseInt(E[0]) * x3) + (parseInt(E[1]) * x2) + (parseInt(E[2]) * x1) + parseInt(E[3]);

    return (S1 > (H1) || E1 < H1);
  },

  IsSameSubnetAddrs: function (Ip1, Ip2, mask) {
    var addrParts1 = Ip1.split(".");
    var addrParts2 = Ip2.split(".");
    var maskParts = mask.split(".");
    for (let i = 0; i < 4; i++) {
      if (((Number(addrParts1[i])) & (Number(maskParts[i]))) != ((Number(addrParts2[i])) & (Number(maskParts[i])))) {
        return false;
      }
    }
    return true;
  },

  isSameSubnetAvailableIp: function (startIp, homeIp) {
    var S = startIp.split(".");
    var H = homeIp.split(".");

    if (parseInt(S[3]) > (parseInt(H[3])) || parseInt(S[3]) < parseInt(H[3])) {
      return true;
    } else {
      return false;
    }
  },

  isEndIPGreaterThanStartIP: function (startIp, endIp) {
    var S = startIp.split(".");
    var E = endIp.split(".");

    if (parseInt(S[3]) < parseInt(E[3])) {
      return true;
    } else {
      return false;
    }
  },

  ussdCode: function (code) {
    return /^[0-9\#\*]+$/.test(code);
  },

  checkPortInvalid: function (portStr) {
    var portList = portStr.split(",");
    if (portStr == "" || portList.length == 0) {
      return true;
    }
    var re = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/;
    for (var i in portList) {
      if (!re.test(portList[i])) {
        return false;
      }
    }
    return true;
  },
  checkIpAddressInvalid: function (address) {
    if (address == "" || address == null) {
      return true;
    }
    var addrParts = address.split('.');
    if (addrParts.length != 4) {
      return false;
    }

    for (var i = 0; i < 4; i++) {
      if (isNaN(addrParts[i]) == true) {
        return false;
      }

      if (addrParts[i] == '') {
        return false;
      }

      if (addrParts[i].indexOf(' ') != -1) {
        return false;
      }

      if ((addrParts[i].indexOf('0') == 0) && (addrParts[i].length != 1)) {
        return false;
      }
    }
    if (addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223 || addrParts[1] < 0 || addrParts[1] > 255 || addrParts[2] < 0 || addrParts[2] > 255 || addrParts[3] <= 0 || addrParts[3] >= 255) {
      return false;
    }
    return true;
  },
  isValidUrlAddress: function (address) {
    var regUrl = /([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var regHttp = new RegExp(regUrl);
    if (regHttp.test(address)) {
      return true;
    }
    return false;
  },
  portVal: function (portVal) {
    if (portVal == "" || portVal < 0 || portVal > 65535 || !isNumber(portVal)) {
      return false;
    }
    return true;
  },
  checkInvalidateDestNet: function (deIp, deMask) {
    if (deMask == '0.0.0.0') {
      return true;
    }

    if (deIp == '0.0.0.0') {
      return true;
    }
    var maskParts = deMask.split('.');
    var ipParts = deIp.split('.');
    if (ipParts[3] != 0 && maskParts[3] == 255) {
      return true;
    }
    //C class
    if (ipParts[3] == 0 && ipParts[2] != 0 && maskParts[2] != 0) {
      var ipPartsNum = parseInt(ipParts[2]);
      var maskPartsNum = parseInt(maskParts[2]);
      if ((maskPartsNum | ipPartsNum) == maskPartsNum) {
        return true;
      }
    }
    //B class
    if (ipParts[3] == 0 && ipParts[2] == 0 && ipParts[1] != 0 && maskParts[1] != 0) {
      var ipPartsNum = parseInt(ipParts[1]);
      var maskPartsNum = parseInt(maskParts[1]);
      if ((maskPartsNum | ipPartsNum) == maskPartsNum) {
        return true;
      }
    }
    //A class
    if (ipParts[3] == 0 && ipParts[2] == 0 && ipParts[1] == 0 && ipParts[0] != 0 && maskParts[0] != 0) {
      var ipPartsNum = parseInt(ipParts[0]);
      var maskPartsNum = parseInt(maskParts[0]);
      if ((maskPartsNum | ipPartsNum) == maskPartsNum) {
        return true;
      }
    }

    return false;
  },
  isInvalidMtu: function (value) {
    if (value == "" || value < 576 || value > 1500 || !isNumber(value)) {
      return false;
    }
    return true;
  },
  isInvalidpppoeMtu: function (value) {
    if (value == "" || value < 576 || value > 1492 || !isNumber(value)) {
      return false;
    }
    return true;
  },
  passwordRules: function (value) {
    return /^[A-Za-z0-9\-\+\!\^\$\@\#\&\*]{4,16}$/.test(value);
  },
  eePasswordRules: function (value) {
    return /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[\-\+\!\^\$\@\#\&\*])[A-Za-z0-9\-\+\!\^\$\@\#\&\*]{8,16}$/.test(value);
  },
  checkUSSDCode: function (code) {
    return /^((\*|#){1,3}[0-9]{2,3}([0-9\*])*)#$/.test(code);
  },
  checkUSSDNextCode: function (code) {
    return /^[0-9\#\*]+$/.test(code);
  },
  isValidAscIICharset: function (str) {
    var i = 0;
    for (i = 0; i < str.length; i++) {
      if (!(str.charCodeAt(i) >= 33 && str.charCodeAt(i) <= 126)) {
        return false;
      }
    }
    return true;
  },
  isVaildDomainname: function (val) {
    if (val == '') {
      return false;
    }
    for (j = 0; j < val.length; j++) {
      var c = val.charAt(j);
      if (c >= 'a' && c <= 'z') {
        continue;
      } else if (c >= 'A' && c <= 'Z') {
        continue;
      } else if (c >= '0' && c <= '9') {
        continue;
      } else if (c == '-' || c == '.') {
        continue;
      } else {
        return false;
      }
    }
    return true;
  },
  isStartWithChar: function (str) {
    var reg = /^[a-zA-Z]/;
    var value = reg.test(str);
    return value;
  },
  isTValidName: function (name) {
    var i = 0, j = 0;
    var unsafeString = "\"<>%\\^[]`\+\$\,='#&:;*/{} \t";
    for (i = 0; i < name.length; i++) {
      for (j = 0; j < unsafeString.length; j++) {
        if ((name.charAt(i)) == unsafeString.charAt(j)) {
          return false;
        }
      }
    }
    return true;
  },
  ValidStarDomainname: function (val) {
    if ((val.indexOf(".") == -1 && val != "") || (val.indexOf(".") != -1 && val.length == 1)) {
      return false;
    }
    return true;
  },
  ValidEndDomainname: function (val) {
    if (/\.$/.exec(val) || /^\./.exec(val) || /-$/.exec(val) || /^-/.exec(val)) {
      return false;
    }
    return true;
  }
}

export default validate;
