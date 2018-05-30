import _ from 'underscore';
import menuConfig from './config/menuConfig.js'
import sys from "./config/sys.js";
import { defaultCountryCodeList, countryCodeALL } from "./config/countryCode.js";

import langListAll from "./config/langListAll.js";
import validates from './plugin/validates.js';
import customConfig from "./config/customConfig.json";
import customConfigAuto from "./config/customConfigAuto.json";

_.extend(customConfig, customConfigAuto);
let config = {};

let countryCodeformOptions = []
if (_.indexOf(defaultCountryCodeList, CustomConfig("defaultWlanCountryCode")) == -1) {
  defaultCountryCodeList.unshift(CustomConfig("defaultWlanCountryCode"))
}
_.each(defaultCountryCodeList, (k) => {
  countryCodeformOptions.push([k, countryCodeALL[k][0]])
    //countryCodeformOptions.push([k, v[0]])
})

//##################### common Options start
const checkBoxEnableOptions = [
  [1, 'ids_enable'],
  [0, 'ids_disable']
];

const checkBoxDisableOptions = [
  [0, 'ids_enable'],
  [1, 'ids_disable']
];
const autoManualOptions = [
  [0, 'ids_auto'],
  [1, 'ids_manual']
];

const manualAutoOptions = [
  [1, 'ids_auto'],
  [0, 'ids_manual']
];

const offOnOptions = [
  [1, 'ids_wifi_on'],
  [0, 'ids_wifi_off']
];
//##################### common Options end

//##################### common Options start
const requiredRule = { required: true, message: 'ids_required', trigger: 'change' };
const IPRule = { validator: validates.ip, message: 'ids_IpRule', trigger: 'change' };
const pinRule = { validator: validates.pin, message: 'ids_sim_pinRule', trigger: 'change' };
const pukRule = { validator: validates.puk, message: 'ids_sim_pukRule', trigger: 'change' };
const ssidRule = { validator: validates.ssid, message: 'ids_wlan_ssidRule', trigger: 'change' };
const wepkeyRule = { validator: validates.wepkey, message: 'ids_wlan_wepKeyRule', trigger: 'change' };
const wpakeyRule = { validator: validates.wpakey, message: 'ids_wlan_wpaKeyRule', trigger: 'change' };
const portRule = { validator: validates.portVal, message: 'ids_portRule', trigger: 'change' }
const subnetMaskRule = { validator: validates.subnetMask, message: 'ids_router_subnetInvalid', trigger: 'change' }
  //##################### common Options end
const common = {
  options: {
    checkBoxEnable: checkBoxEnableOptions,
    checkBoxDisable: checkBoxDisableOptions,
    autoManualOptions: autoManualOptions,
    manualAutoOptions: manualAutoOptions,
    offOn: offOnOptions
  },
  rule: {
    required: requiredRule,
    IP: IPRule,
    pin: pinRule,
    puk: pukRule,
    ssidRule: ssidRule,
    wepkey: wepkeyRule,
    wpakey: wpakeyRule,
    port: portRule,
    subnetMask: subnetMaskRule
  }
}

function CustomConfig(name) {
  return customConfig[name];
}

config.pageConfig = {
  IsSupportTimeOutLogout: true,
  IsSupportWiFi5G: true,
  IsSupportWiFiAP2G_guest: false,
  langListAll: langListAll,
  IsSupportActivePicopoint: false,
  langListSupport: CustomConfig("langListSupport"),
  rightDisplayLangConfig: ['ar', 'wr'],
  IsSupportAuthentication: false,
  netWorkDisplayType: 0,//0:use requirment generated config;1:Network Type display like GPRS,EDGE,HSPA,...LTE and so on;
  networkTypeMap: [
    [0, "ids_netwrok_noService"],
    [1, CustomConfig("NetTypeGPRS")],
    [2, CustomConfig("NetTypeEDGE")],
    [3, CustomConfig("NetTypeHSPA")],
    [4, CustomConfig("NetTypeHSUPA")],
    [5, CustomConfig("NetTypeUMTS")],
    [6, CustomConfig("NetTypeHSPAPLUS")],
    [7, CustomConfig("NetTypeDCHSPAPLUS")],
    [8, CustomConfig("NetTypeLTE")],
    [9, CustomConfig("NetTypeLTEPLUS")],
    [11,CustomConfig("NetTypeGSM")]
  ],
  searchNetResultMap:[
    [1, CustomConfig("SearchNetResultGSM")],
    [2, CustomConfig("SearchNetResultUMTS")],
    [3, CustomConfig("SearchNetResultLTE")],
    [4, CustomConfig("SearchNetResultCDMA")],
    [5, "ids_unknown"]
  ],
  umOnlineUrl: "http://www.alcatel-move.com/um/url.html",
  projectName: "HH70",
  umCustom: "Generic",
  noNeedLoginRoutes: ["index"],
  displayDataRoamingSwitch: true,
  defaultCountryCodeList: defaultCountryCodeList,
  LogoUrl: "",
  isSuportLogoUrl: false,
  supportCountryCodeTranslation: false,
  supportForbiddenNwRegister: false,
  isReconnectFlag: false,
  IsShowQRcode: true,
  showFourOrFiveSignal: true,
  afterLogInRouting: "internetStatus"
}
config.logoList=[];
config.nav = menuConfig.nav;
config.sideMenu = menuConfig.sideMenu;
config.titleName = CustomConfig("pageTitle");

config.mobileConnection = {
  pageItem: {
    ConnectModeVisible: true,
    ConnectModeHelp: false,
    isNetworkRoamNoteRule: false
  },
  formOptions: {
    ConnectMode: common.options.manualAutoOptions,
    PdpType: [
      [0, 'IPV4'],
      [2, 'IPV6'],
      [3, 'IPv4v6']
    ],
    RoamingConnect: common.options.checkBoxEnable
  },
  formData: {},
  formRules: {}
};

config.networkSettings = {
  pageItem: {
    showListNetType: true,
    NetworkModeHelp: false,
    ConnectedIsDisconnect: true,
    IsShowManualSearchMode: true
  },
  formOptions: {
    NetselectionMode: common.options.autoManualOptions,
    NetworkMode: [
      [0, 'ids_auto'],
      [1, 'ids_2gOnly'],
      [2, 'ids_3gOnly'],
      [3, 'ids_4gOnly']
      /*[5,'ids_3g4gNoOnly']*/
    ]
  },
  formData: {
    NetselectionMode: 0,
    RoamingConnect: 0,
    NetworkMode: 0
  },
  formRules: {}
};



//pinManagement
config.pinManagement = {
  formData: {
    PinState: 0,
    ChangePinState: 0,
    AutoValidatePinState: 0,
    Pin: "",
    DisPin: "",
    State: 1,
    Puk: "",
    NewPin: "",
    CurrentPin: "",
    SIMLockCode: "",
    ConfirmPin: ""
  },
  pageItem: {
    isShowPinStatus:false,
    disconnectDialing:true
  },
  formOptions: {
    AutoValidatePinState: common.options.checkBoxEnable,
  },
  validates: {
    Confirm: (vm) => {
      return validates.Confirm(vm, "NewPin");
    }
  },
  formRules: {
    Pin: [
      //common.rule.required,
      { required: true, message: 'ids_pinManagement_required', trigger: 'change' },
      common.rule.pin
    ],
    DisPin: [
      //common.rule.required,
      { required: true, message: 'ids_pinManagement_required', trigger: 'change' },
      common.rule.pin
    ],
    NewPin: [
      //common.rule.required,
      { required: true, message: 'ids_pinManagement_newRequired', trigger: 'change' },
      { validator: validates.pin, message: 'ids_pinManagement_newPinRule', trigger: 'change' },
    ],
    CurrentPin: [
      //common.rule.required,
      { required: true, message: 'ids_pinManagement_required', trigger: 'change' },
      common.rule.pin
    ],
    ConfirmPin: [
      //common.rule.required,
      { required: true, message: 'ids_pinManagement_confirmPinRequired', trigger: 'change' },
      common.rule.pin
    ]
  },
  formRulesExtension: {
    ConfirmPin: { validator: "Confirm", message: 'ids_pinManagement_confirmedPin' }
  }
};

//lanSettings
config.lanSettings = {
  formData: {},
  formOptions: {
    DHCPServerStatus: common.options.checkBoxEnable,
    DHCPLeaseTime: [
      [1],
      [6],
      [12],
      [24]
    ]
  },
  validates: {
    IPv4IPAddress: (vm) => {
      return validates.IsBroadcastOrNetworkAddress(vm, "IPv4IPAddress", "SubnetMask");
    },
    StartIPAddress1: (vm) => {
      return validates.IsSameSubnetAddrs(vm, "StartIPAddress", "IPv4IPAddress", "SubnetMask");
    },
    StartIPAddress2: (vm) => {
      return validates.IsAvailableIpPool(vm, "IPv4IPAddress", "StartIPAddress", "EndIPAddress");
    },
    StartIPAddress3: (vm) => {
      return validates.isEndIPGreaterThanStartIP(vm, "StartIPAddress", "EndIPAddress");
    },
    EndIPAddress1: (vm) => {
      return validates.IsBroadcastOrNetworkAddress(vm, "EndIPAddress", "SubnetMask");
    },
    EndIPAddress2: (vm) => {
      return validates.IsSameSubnetAddrs(vm, "EndIPAddress", "IPv4IPAddress", "SubnetMask");
    },
    EndIPAddress3: (vm) => {
      return validates.isEndIPGreaterThanStartIP(vm, "StartIPAddress", "EndIPAddress");
    }
  },
  formRules: {
    IPv4IPAddress: [
      { required: true, message: 'ids_lanSettings_IPv4IPAddressRequired', trigger: 'change' },
      common.rule.IP
    ],
    SubnetMask: [
      { required: true, message: 'ids_lanSettings_SubnetMaskRequired', trigger: 'change' },
      { validator: validates.subnetMask, message: 'ids_lanSettings_subnetInvalid' }
    ],
    StartIPAddress: [
      { required: true, message: 'ids_lanSettings_StartIPAddressRequired', trigger: 'change' },
      common.rule.IP
    ],
    EndIPAddress: [
      { required: true, message: 'ids_lanSettings_EndIPAddressRequired', trigger: 'change' },
      common.rule.IP
    ]
  },
  formRulesExtension: {
    IPv4IPAddress: { validator: "IPv4IPAddress", message: 'ids_lanSettings_ipInvalid' },
    StartIPAddress: [
      { validator: "StartIPAddress1", message: 'ids_lanSettings_startToEnd' },
      { validator: "StartIPAddress2", message: 'ids_lanSettings_DHCPIpRule' },
      { validator: "StartIPAddress3", message: 'ids_lanSettings_endToStartIp' }
    ],
    EndIPAddress: [
      { validator: "EndIPAddress1", message: 'ids_lanSettings_endIpRule' },
      { validator: "EndIPAddress2", message: 'ids_lanSettings_endToStart' },
      { validator: "EndIPAddress3", message: 'ids_lanSettings_endToStartIp' }
    ]
  }
};


//changePassword
config.changePassword = {
  pageItem: {
    changePasswordNote: false,
    eeValidationRules: false
  },
  formData: {
    UserName: "admin",
    CurrPassword: "",
    NewPassword: "",
    ConfirmPassword: ""
  },
  formOptions: {},
  validates: {
    Confirm: (vm) => {
      return validates.Confirm(vm, "NewPassword");
    }
  },
  formRules: {
    CurrPassword: [
      { required: true, message: 'ids_changePassword_currPasswordRequired', trigger: 'change' }
    ],
    NewPassword: [
      { required: true, message: 'ids_changePassword_newPasswordRequired', trigger: 'change' },
      { validator: validates.passwordRules, message: 'ids_changePassword_passwordRulePrompt' }
    ],
    ConfirmPassword: [
      { required: true, message: 'ids_changePassword_confirmPasswordRequired', trigger: 'change' }
    ]
  },
  formRulesExtension: {
    ConfirmPassword: { validator: "Confirm", message: 'ids_changePassword_confirmPdwNotSame' },
  }
};

//systemSettings
config.systemSettings = {
  pageItem: {},
  formData: {
    Language: "fr",
    CurrTime: "",
    TimeZone: "UTC",
    ZoneName: "UTC"
  },
  formOptions: {
    Language: [],
    ZoneName: []
  },
  formRules: {}
}

config.systemSettings.formOptions.ZoneName = sys.TimeZone;

//ntpServer
config.ntpServer = {
  pageItem: {
    NtpServer1_custom: [],
    NtpServer2_custom: []
  },
  formData: {
    NtpServer1: "0.openwrt.pool.ntp.org",
    NtpServer2: "0.openwrt.pool.ntp.org"
  },
  formOptions: {
    NtpServer1: [],
    NtpServer2: []
  },
  formRules: {}
}
config.ntpServer.formOptions.NtpServer1 = sys.NtpServer1;
config.ntpServer.formOptions.NtpServer2 = sys.NtpServer2;

//backupRestore
config.backupRestore = {
  formData: {
    iptRestore: "45646"
  },
  formOptions: {},
  formRules: {}
}

//inbox
config.inbox = {
    formData: {},
    formOptions: {},
    formRules: {}
  }
  //outbox
config.outbox = {
    formData: {},
    formOptions: {},
    formRules: {}
  }
  //draft
config.draft = {
    formData: {},
    formOptions: {},
    formRules: {}
  }
  //newSMS
config.newSMS = {
    pageItem: {
      SupportMultipleRecipients: false,
      isSupportLatamSMS: false
    },
    formData: {
      PhoneNumber: "",
      SMSContent: "",
      SMSId: -1,
      Flag: 0
    },
    formOptions: {},
    formRules: {}
  }
  //SMS Settings
config.smsSettings = {
  pageItem: {},
  formData: {
    "StoreFlag": 1,
    "SMSReportFlag": 1,
    "SMSCenter": ""
  },
  formOptions: {
    StoreFlag: [
      [0, 'ids_smsSettings_modeSimCard'],
      [1, 'ids_smsSettings_device']
    ],
    SMSReportFlag: common.options.checkBoxEnable
  },
  formRules: {}
}

//SMS Forwarding
config.smsForwarding = {
  pageItem: {
    smsForwardingOpen: false,
    eeCustom: false
  },
  formData: {
    "redirect_flag": 0,
    "redirect_number": "",
    "SMSTime": ""
  },
  formOptions: {
    redirect_flag: common.options.checkBoxEnable
  },
  formRules: {}
}

//smsReport.vue
config.smsReport = {
  formData: {},
  formOptions: {},
  formRules: {}
}

//CallLog
config.callLogs = {
  formData: {
    Page: 0,
    ListType: 0
  },
  formOptions: {},
  formRules: {}
}

config.profileManagement = {
  initNewData: {
    "ProfileName": "",
    "APN": "",
    "Password": "",
    "AuthType": 0,
    "DailNumber": "",
    "UserName": ""
  },
  pageItem: {
    "ConnectedIsDisconnect": true
  },
  formData: {},
  formOptions: {
    AuthType: [
      [0, 'ids_none'],
      [1, 'PAP'],
      [2, 'CHAP'],
      [3, 'PAP& CHAP']
    ]
  },
  formRules: {
    ProfileName: [
      //common.rule.required,
      { required: true, message: 'ids_profile_nameRequired', trigger: 'change' },
      { validator: validates.profileName, message: 'ids_profile_profileNameRule' }
    ],
    DailNumber: [
      //common.rule.required,
      { required: true, message: 'ids_profile_dialNumberRequired', trigger: 'change' },
      { validator: validates.devicename, message: 'ids_profile_inputRule' }
    ],
    APN: [
      { validator: validates.devicename, message: 'ids_profile_inputRule' }
    ],
    UserName: [
      { validator: validates.devicename, message: 'ids_profile_userNameRule' }
    ],
    Password: [
      { validator: validates.profilePw, message: 'ids_profile_pwdRule' }
    ]
  }
};
// Monthly Plan
config.monthlyPlan = {
  formData: {},
  formOptions: {
    AutoDisconnFlag: common.options.checkBoxEnable,
    TimeLimitFlag: common.options.checkBoxEnable,
    Unit: [
      [0, 'ids_mb'],
      [1, 'ids_gb'],
      [2, 'ids_kb']
    ]
  },
  formRules: {
    MonthlyPlan: [
      { required: true, message: 'ids_monthlyPlan_monthlyDataRequired', trigger: 'change' },
      { validator: validates.monthlyPlan, message: 'ids_monthlyPlan_totalUsageInvalid' }
    ],
    TimeLimitTimes: [
      { required: true, message: 'ids_monthlyPlan_timeLimitRequired', trigger: 'change' },
      { validator: validates.timeLimitTimes, message: 'ids_monthlyPlan_overtimeInvalid' }
    ]
  }
};

//  usage Record
config.usageRecord = {
  formData: {},
  formOptions: {},
  formRules: {}
};


// Statistics/internetStatistics 
config.internetStatistics = {
  pageItem: {
    BillingDay: false
  },
  formData: {
  },
  formOptions: {},
  formRules: {}
};
//Statistics/diagnostic
config.diagnostic = {
  formData: {},
  formOptions: {},
  formRules: {}
};

// Statistics/lanStatistics 
config.lanStatistics = {
  formData: {},
  formOptions: {},
  formRules: {}
};
// Statistics/wlanStatistics 
config.wlanStatistics = {
  formData: {},
  formOptions: {},
  formRules: {}
};

config.algSettings = {
  formOptions: {
    FtpStatus: common.options.checkBoxEnable,
    H323AlgStatus: common.options.checkBoxEnable,
    SipAlgStatus: common.options.checkBoxEnable
  },
  formData: {},
  formRules: {}
}


config.dmzSettings = {
  formOptions: {
    dmz_status: common.options.checkBoxEnable
  },
  formData: {
    dmz_status: 0,
    dmz_ip: ''
  },
  formRules: {
    dmz_ip: [
      { required: true, message: 'ids_dmz_requireHostIPAddress', trigger: 'change' },
      common.rule.IP
    ]
  }
}



config.upnpSettings = {
  formOptions: {
    upnp_switch: common.options.checkBoxEnable
  },
  formData: {},
  formRules: {}
}


config.virtualServer = {
  formOptions: {
    fwding_status: common.options.offOn,
    fwding_protocol: [
      [6, 'TCP'],
      [17, 'UDP'],
      [253, 'TCP&UDP']
    ]
  },
  formData: {
    portfwd_name: '',
    private_ip: '',
    private_port: '',
    global_port: '',
    fwding_protocol: 17,
    fwding_status: 0
  },
  formRules: {
    portfwd_name: [
      { required: true, message: 'ids_vtServer_nameRequired', trigger: 'change' },
    ],
    private_ip: [
      { required: true, message: 'ids_vtServer_lanIpRequired', trigger: 'change' },
      common.rule.IP
    ],
    private_port: [
      { required: true, message: 'ids_vtServer_lanPortRequired', trigger: 'change' },
      common.rule.port
    ],
    global_port: [
      { required: true, message: 'ids_vtServer_wanPortRequired', trigger: 'change' },
      common.rule.port
    ]
  }

}

//wps
config.wps = {
  formData: {
    wpsMode: 0,
    WpsPin: ""
  },
  formOptions: {
    wpsMode: [
      [0, 'ids_wps_wpsPin'],
      [1, 'ids_wps_pbc']
    ]
  },
  formRules: {
    WpsPin: [
      { required: true, message: 'ids_wps_WpsPinRequired', trigger: 'change' },
      { validator: validates.wpsPin, message: 'ids_wps_InvalidWpsPinTips' }
    ]
  }
}

//qos
config.qos = {
  formOptions: {
    State: common.options.checkBoxEnable
  },
  formData: {},
  formRules: {
    UserUpBand: [
      { validator: validates.UserUpBand, message: 'ids_qos_userUpBandTips' }
    ],
    UserDownBand: [
      { validator: validates.UserDownBand, message: 'ids_qos_userDownBandTips' }
    ]
  }
};

//login
config.login = {
  pageItem: {
    ForceChangePassword: false,
    fixedChangePassword: false,
    supportForgotPasswordPop: true,
    listenLogoutTime: 300000, //unit: ms
    stopListenLogoutTime: null
  },
  formData: {
    UserName: 'admin',
    Password: '',
    save_flag: 0
  },
  formOptions: {
    save_flag: common.options.checkBoxEnable
  },
  formRules: {}
};
//dlna
config.dlna = {
  pageItem: {
    needLoginAgain: false
  },
  formData: {},
  formOptions: {},
  formRules: {}
};

//usb
config.usb = {
  formData: {},
  formOptions: {
    UsbStatus: [
      [1, 'ids_usb_hardDisk'],
      [2, 'ids_usb_print']
    ]
  },
  formRules: {}
};

config.storageShare = {
  pageItem: {
    needLoginAgain: false
  },
  formData: {},
  formOptions: {},
  formRules: {}
};

//samba
config.samba = {
  pageItem: {
    Anonymous: true
  },
  formData: {},
  formOptions: {
    AuthType: [
      [0, 'ids_samba_readOnly'],
      [1, 'ids_samba_readWrite']
    ],
    Anonymous: common.options.checkBoxEnable
  },
  formRules: {}
};

//ftp
config.ftp = {
  pageItem: {
    Anonymous: true
  },
  formData: {},
  formOptions: {
    AuthType: [
      [0, 'ids_ftp_readOnly'],
      [1, 'ids_ftp_readWrite']
    ],
    Anonymous: common.options.checkBoxEnable
  },
  formRules: {}
};

//user settings
config.userSettings = {
  pageItem: {
    AccessDenyWarning: false,
    UserBlockWarning: false,
    hideBlockTableWhenNoData: false
  },
  formData: {
    DeviceName: ""
  },
  formOptions: {},
  formRules: {
    DeviceName: [
      { required: true, message: 'ids_user_DeviceNameRequired', trigger: 'change' }
    ]
  }
}

//setupWizard
config.setupWizard = {
  pageItem: {
    Disable2g5gwarning: false,
    DisableSSIDbroadcastwarning: false,
    SupporWifiCertification: false
  },
  formData: {
    currentProfileId: 0
  },
  formOptions: {},
  formRules: {}
};


//simState
config.simState = {
  pageItem: {
    isCallbackRouter: false
  },
  formData: {
    Pin: "",
    NewPin: "",
    Puk: "",
    ConfirmPin: "",
    SIMLockCode: "",
    AutoValidatePinState: 0
  },
  formOptions: {
    AutoValidatePinState: common.options.checkBoxEnable,
  },
  validates: {
    ConfirmPin: (vm) => {
      return validates.Confirm(vm, "NewPin");
    }
  },
  formRules: {
    Pin: [
      //common.rule.required,
      { required: true, message: 'ids_sim_pinCodeRequired', trigger: 'change' },
      common.rule.pin,
    ],
    NewPin: [
      //common.rule.required,
      { required: true, message: 'ids_sim_newPinRequired', trigger: 'change' },
      { validator: validates.pin, message: 'ids_sim_newPinRule', trigger: 'change' },
    ],
    Puk: [
      //common.rule.required,
      { required: true, message: 'ids_sim_pukEnterRequired', trigger: 'change' },
      common.rule.puk,
    ],
    ConfirmPin: [
      //common.rule.required,
      { required: true, message: 'ids_sim_confirmPinRequired', trigger: 'change' },
      common.rule.pin,
    ],
    SIMLockCode: [
      //common.rule.required,
      { required: true, message: 'ids_sim_simLockEnterRequired', trigger: 'change' },
      { validator: validates.simlockCode, message: 'ids_sim_simlockRule' }
    ]
  },
  formRulesExtension: {
    ConfirmPin: { validator: "ConfirmPin", message: 'ids_sim_confirmedPin' },
  }
};
//home status 
config.homeLanStatus = {
  formData: {}
};
//internetStatus
config.homeInternetStatus = {
  pageItem: {
    hideEmptyIP: false,
    changeProfileName: false,
    supportUSBStatus: true,
    monthlyPlanRunOutDialTips: false,
    supportDeviceUptime: false
  },
  formData: {
    "IPv4Adrress": ""
  },
  formRules: {}
};

config.homeWlanStatus = {
  pageItem: {
    warningBeforeChange: false
  },
  formData: {},
  ssidBroadcastDisplayNum: 1, //val:0,1
  ssidBroadcastArr: common.options.checkBoxDisable,
  formRules: {}
};
//localUpgrade
config.localUpgrade = {
  pageItem: {
    usbUpgradeMode: false
  },
  formData: {},
  formRules: {}
};

//wan mac Clone
config.macClone = {
  formData: {
    MacAddr: "",
    HostMacAddr: ""
  },
  formOptions: {},
  formRules: {
    HostMacAddr: [
      { required: true, message: 'ids_macClone_HostMacAddrRequired', trigger: 'change' },
      { validator: validates.macAddr, message: 'ids_macClone_macInvalid' }
    ]
  }
};

//wan Configure
config.wanConfigure = {
  formData: {},
  formOptions: {
    ConnectType: [
      [0, 'ids_wanConfigure_pppoe'],
      [1, 'ids_wanConfigure_dhcp'],
      [2, 'ids_wanConfigure_staticIp']
    ]
  },
  formRules: {
    "SubNetMask": [
      { required: true, message: 'ids_wanConfigure_SubNetMaskRequired', trigger: 'change' },
      common.rule.subnetMask
    ],
    "Gateway": [
      { required: true, message: 'ids_wanConfigure_GatewayRequired', trigger: 'change' },
      common.rule.IP
    ],
    "IpAddress": [
      { required: true, message: 'ids_wanConfigure_IpAddressRequired', trigger: 'change' },
      common.rule.IP
    ],
    "Mtu": [
      { required: true, message: 'ids_wanConfigure_MtuRequired', trigger: 'change' },
      { validator: validates.isInvalidMtu, message: 'ids_wanConfigure_mtuInvalid' }
    ],
    "PrimaryDNS": [
      { required: true, message: 'ids_wanConfigure_PrimaryDNSRequired', trigger: 'change' },
      common.rule.IP
    ],
    "SecondaryDNS": [
      common.rule.IP
    ],
    "Account": [
      { required: true, message: 'ids_wanConfigure_AccountRequired', trigger: 'change' },
    ],
    "Password": [
      { required: true, message: 'ids_wanConfigure_PasswordRequired', trigger: 'change' },
    ],
    "StaticIpAddress": [
      { required: true, message: 'ids_wanConfigure_StaticIpAddressRequired', trigger: 'change' },
      common.rule.IP
    ],
    "pppoeMtu": [
      { required: true, message: 'ids_wanConfigure_pppoeMtuRequired', trigger: 'change' },
      { validator: validates.isInvalidpppoeMtu, message: 'ids_wanConfigure_mtuInvalid' }
    ]
  }
};
//wanPing
config.wanPing = {
  formData: {},
  formOptions: {
    wan_ping_status: common.options.checkBoxEnable
  },
  formRules: {}
};

//vpn
config.vpn = {
  formData: {},
  formOptions: {
    status: common.options.checkBoxEnable
  },
  formRules: {}
};

//tr069
config.tr069 = {
  formData: {
    AcsUrl: "",
    AcsUserName: "",
    AcsUserPassword: "",
    ConReqAuthent: 1,
    ConReqUserName: "",
    ConReqUserPassword: "",
    Inform: 1,
    InformInterval: 60,
    State: 1
  },
  formOptions: {
    //Inform: common.options.checkBoxEnable,
    ConReqAuthent: common.options.checkBoxEnable
  },
  formRules: {
    AcsUrl: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_acsUrlRequired', trigger: 'change' },
      { validator: validates.acsUrl, message: 'ids_tr069_acsUrlRule' }
    ],
    AcsUserName: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_acsUserNameRequired', trigger: 'change' }
    ],
    AcsUserPassword: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_acsUserPasswordRequired', trigger: 'change' }
    ],
    ConReqUserName: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_conReqUserNameRequired', trigger: 'change' }
    ],
    ConReqUserPassword: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_conReqUserPasswordRequired', trigger: 'change' }
    ],
    InformInterval: [
      //common.rule.required,
      { required: true, message: 'ids_tr069_informIntervalRequired', trigger: 'change' },
      { validator: validates.informInterval, message: 'ids_tr069_informIntervalRule' }
    ]
  },
};
//ipFilter
config.ipFilter = {
  formData: {
    filter_policy: 0,
    ip_protocol: 17,
    lan_ip: "",
    lan_port: "",
    wan_ip: "",
    wan_port: "",
    IPv4IPAddress: "",
    SubnetMask: ""
  },
  formOptions: {
    filter_policy: [
      [0, 'ids_disable'],
      [1, 'ids_blacklist'],
      [2, 'ids_whitelist']
    ],
    ip_protocol: [
      [6, 'TCP'],
      [17, 'UDP'],
      [253, 'TCP/UDP']
    ]
  },
  validates: {
    lanAddrVal: (vm) => {
      return validates.IsSameSubnetAddrs(vm, "lan_ip", "IPv4IPAddress", "SubnetMask");
    },
    lanAddrValIp: (vm) => {
      return validates.isSameSubnetAvailableIp(vm, "lan_ip", "IPv4IPAddress");
    }
  },
  formRules: {
    lan_ip: [
      //common.rule.required,
      { required: true, message: 'ids_ipFilter_lanIpRequired', trigger: 'change' },
      common.rule.IP
    ],
    lan_port: [
      //common.rule.required,
      { required: true, message: 'ids_ipFilter_lanPortRequired', trigger: 'change' },
      common.rule.port
    ],
    wan_ip: [
      //common.rule.required,
      { required: true, message: 'ids_ipFilter_wanIpRequired', trigger: 'change' },
      common.rule.IP
    ],
    wan_port: [
      //common.rule.required,
      { required: true, message: 'ids_ipFilter_wanPortRequired', trigger: 'change' },
      common.rule.port
    ]
  },
  formRulesExtension: {
    lan_ip: [
      { validator: "lanAddrVal", message: 'ids_ipFilter_sameSubnet' },
      { validator: "lanAddrValIp", message: 'ids_ipFilter_lanDHCPIpRule' }

    ]
  }
};
//macFilter
config.macFilter = {
  formData: {
    filter_policy: 0,
    Address: ""
  },
  formOptions: {
    filter_policy: [
      [0, 'ids_disable'],
      [2, 'ids_blacklist'],
      [1, 'ids_whitelist']
    ]
  },
  formRules: {
    Address: [
      //common.rule.required,
      { required: true, message: 'ids_macFilter_MacAddressRequired', trigger: 'change' },
      { validator: validates.macAddr, message: 'ids_macFilter_macInvalid' }
    ]
  }
};
//urlFilter
config.urlFilter = {
  formData: {
    filter_policy: 0,
    url: ""
  },
  formOptions: {
    filter_policy: [
      [0, 'ids_disable'],
      [2, 'ids_blacklist'],
      [1, 'ids_whitelist']
    ]
  },
  formRules: {
    url: [
      //common.rule.required,
      { required: true, message: 'ids_urlFilter_urlRequired', trigger: 'change' },
      { validator: validates.isValidUrlAddress, message: 'ids_urlFilter_urlRuleMsg' }
    ]
  }
};
//staticRules
config.staticRules = {
  formData: {
    DestNetAddr: "",
    DestNetmask: "",
    GateWay: ""
  },
  formOptions: {
    State: common.options.checkBoxEnable
  },
  validates: {
    DestNetmaskVal: (vm) => {
      return validates.checkInvalidateDestNet(vm, "DestNetAddr", "DestNetmask");
    }
  },
  formRules: {
    DestNetAddr: [
      //common.rule.required,
      { required: true, message: 'ids_routingRules_destNetAddrRequired', trigger: 'change' },
      common.rule.IP
    ],
    DestNetmask: [
      //common.rule.required,
      { required: true, message: 'ids_routingRules_destNetmaskRequired', trigger: 'change' },
      { validator: validates.subnetMask, message: 'ids_routingRules_subnetInvalid' }
    ],
    GateWay: [
      //common.rule.required,
      { required: true, message: 'ids_routingRules_gateWayRequired', trigger: 'change' },
      common.rule.IP
    ]
  },
  formRulesExtension: {
    //DestNetmask: { validator: "DestNetmaskVal", message: 'ids_routingRules_subnetInvalid' },
  }
};
//dynamicRules
config.dynamicRules = {
  formData: {
    RipVerion: 0
  },
  formOptions: {
    RipVerion: [
      [0, 'ids_routingRules_ripV1V2'],
      [1, 'ids_routingRules_ripV1'],
      [2, 'ids_routingRules_ripV2']
    ]
  },
  formRules: {}
};
//onlineUpgrade
config.onlineUpgrade = {
  pageItem: {
    autoUpgradeMode: false
  },
  formData: {},
  formRules: {}
};

config.Wlan = {
  pageItem: {
    Supportcountryregion: true,
    Disable2g5gwarning: false,
    DisableSSIDbroadcastwarning: false,
    SupporWifiCertification: false
  },
  formData: {
    "show2GPassword": false,
    "show5GPassword": false,
    "showAP2G_guestPassword": false,
    "WiFiOffTime": 0,
    "AP2G": {
      "ApStatus": 0,
      "WMode": 3,
      "CountryCode": "CN",
      "Ssid": "",
      "SsidHidden": 0,
      "Channel": 0,
      "SecurityMode": 3,
      "WepType": 0,
      "WepKey": "1234567890",
      "WpaType": 1,
      "WpaKey": "GE747TNT",
      "ApIsolation": 0,
      "max_numsta": 15,
      "curr_num": 0,
      "CurChannel": 8,
      "Bandwidth": 0
    },
    "AP2G_guest": {
      "ApStatus": 0,
      "WMode": 3,
      "CountryCode": "CN",
      "Ssid": "",
      "SsidHidden": 0,
      "Channel": 0,
      "SecurityMode": 3,
      "WepType": 0,
      "WepKey": "1234567890",
      "WpaType": 1,
      "WpaKey": "GE747TNT",
      "ApIsolation": 0,
      "max_numsta": 15,
      "curr_num": 0,
      "CurChannel": 8,
      "Bandwidth": 0
    },
    "AP5G": {
      "ApStatus": 0,
      "WMode": 3,
      "CountryCode": "CN",
      "Ssid": "",
      "SsidHidden": 0,
      "Channel": 0,
      "SecurityMode": 3,
      "WepType": 0,
      "WepKey": "1234567890",
      "WpaType": 1,
      "WpaKey": "GE747TNT",
      "ApIsolation": 0,
      "max_numsta": 15,
      "curr_num": 0,
      "CurChannel": 8,
      "Bandwidth": 0
    }
  },
  formOptions: {
    show2GPassword: common.options.checkBoxEnable,
    show5GPassword: common.options.checkBoxEnable,
    showAP2G_guestPassword: common.options.checkBoxEnable,
    AP2G: {
      ApStatus: common.options.checkBoxEnable,
      CountryCode: countryCodeformOptions,
      SecurityMode: [
        [0, 'ids_disable'],
        [1, 'WEP'],
        [2, 'WPA'],
        [3, 'WPA2'],
        [4, 'WPA/WPA2']
      ],
      WepType: [
        [0, 'ids_wifi_wepOpen'],
        [1, 'ids_wifi_wepShare']
      ],
      WpaType: [
        [0, 'TKIP'],
        [1, 'AES'],
        [2, 'ids_auto']
      ],
      ApIsolation: [
        [0, 'ids_wifi_off'],
        [1, 'ids_wifi_on'],
      ],
      WMode: [
        [0, 'ids_auto'],
        [1, '802.11b'],
        [2, '802.11b/g'],
        [3, '802.11b/g/n']
      ],
      SsidHidden: common.options.checkBoxDisable,
      Bandwidth: [
        [0, 'ids_auto'],
        [1, '20MHz'],
        [2, '40MHz']
      ]
    },
    AP2G_guest: {
      ApStatus: common.options.checkBoxEnable,
      CountryCode: countryCodeformOptions,
      SecurityMode: [
        [0, 'ids_disable'],
        [1, 'WEP'],
        [2, 'WPA'],
        [3, 'WPA2'],
        [4, 'WPA/WPA2']
      ],
      WepType: [
        [0, 'ids_wifi_wepOpen'],
        [1, 'ids_wifi_wepShare']
      ],
      WpaType: [
        [0, 'TKIP'],
        [1, 'AES'],
        [2, 'ids_auto']
      ],
      ApIsolation: [
        [0, 'ids_wifi_off'],
        [1, 'ids_wifi_on'],
      ],
      WMode: [
        [0, 'ids_auto'],
        [1, '802.11b'],
        [2, '802.11b/g'],
        [3, '802.11b/g/n']
      ],
      SsidHidden: common.options.checkBoxDisable,
      Bandwidth: [
        [0, 'ids_auto'],
        [1, '20MHz'],
        [2, '40MHz']
      ]
    },
    AP5G: {
      ApStatus: common.options.checkBoxEnable,
      CountryCode: countryCodeformOptions,
      SecurityMode: [
        [0, 'ids_disable'],
        [1, 'WEP'],
        [2, 'WPA'],
        [3, 'WPA2'],
        [4, 'WPA/WPA2']
      ],
      WepType: [
        [0, 'ids_wifi_wepOpen'],
        [1, 'ids_wifi_wepShare']
      ],
      WpaType: [
        [0, 'TKIP'],
        [1, 'AES'],
        [2, 'ids_auto']
      ],
      ApIsolation: [
        [0, 'ids_wifi_off'],
        [1, 'ids_wifi_on']
      ],
      WMode: [
        [0, 'ids_auto'],
        [4, '802.11a'],
        [5, '802.11a/n'],
        [6, '802.11a/c']
      ],
      SsidHidden: common.options.checkBoxDisable,
      Bandwidth: [
        [0, 'ids_auto'],
        [1, '20MHz'],
        [2, '40MHz']
      ],
      BandwidthAuto: [
        [0, 'ids_auto'],
        [1, '20MHz'],
        [2, '40MHz']
      ],
      BandwidthAc: [
        [4, 'ids_auto'],
        [1, '20MHz'],
        [2, '40MHz'],
        [3, '80MHz']
      ]
    }
  },
  formRules: {
    "AP2G:Ssid": [
      { required: true, message: 'ids_wlan_Ssid_required', trigger: 'change' },
      common.rule.ssidRule
    ],
    "AP5G:Ssid": [
      { required: true, message: 'ids_wlan_Ssid_required', trigger: 'change' },
      common.rule.ssidRule
    ],
    "AP2G:WepKey": [
      { required: true, message: 'ids_wlan_WepKey_required', trigger: 'change' },
      common.rule.wepkey
    ],
    "AP5G:WepKey": [
      { required: true, message: 'ids_wlan_WepKey_required', trigger: 'change' },
      common.rule.wepkey
    ],
    "AP2G:WpaKey": [
      { required: true, message: 'ids_wlan_WpaKey_required', trigger: 'change' },
      common.rule.wpakey
    ],
    "AP5G:WpaKey": [
      { required: true, message: 'ids_wlan_WpaKey_required', trigger: 'change' },
      common.rule.wpakey
    ],
    "AP2G_guest:Ssid": [
      { required: true, message: 'ids_wlan_Ssid_required', trigger: 'change' },
      common.rule.ssidRule
    ],
    "AP2G_guest:WepKey": [
      { required: true, message: 'ids_wlan_WepKey_required', trigger: 'change' },
      common.rule.wepkey
    ],
    "AP2G_guest:WpaKey": [
      { required: true, message: 'ids_wlan_WpaKey_required', trigger: 'change' },
      common.rule.wpakey
    ],
  },
};
//deviceinfo
config.deviceinfo = {
  pageItem: {
    SupportIMSI: true,
    supportHwVersion: false,
    supportModemVersion: true
  }
};
//parentalControl
config.parentalControl = {
  formData: {
    device_name: "",
    mac_address: "",
    url: "",
    forbidden_Starttime: "",
    forbidden_Endtime: "",
    Control_status: 0
  },
  formOptions: {
    Control_status: [
      [0, 'ids_wifi_off'],
      [1, 'ids_wifi_on']
    ],
  },
  validates: {},
  formRules: {
    url: [
      //common.rule.required,
      { required: true, message: 'ids_parentalControl_urlRequired', trigger: 'change' },
      { validator: validates.isValidUrlAddress, message: 'ids_parentalControl_urlRuleMsg' }
    ],
    mac_address: [
      //common.rule.required,
      { required: true, message: 'ids_parentalControl_macAddressRequired', trigger: 'change' },
      { validator: validates.macAddr, message: 'ids_parentalControl_macInvalid' }
    ],
    device_name: [
      //common.rule.required
      { required: true, message: 'ids_parentalControl_deviceNameRequired', trigger: 'change' }
    ],
  },
  formRulesExtension: {}
};

config.activePicopoint = {
  formData: {
    "Nashid": "",
    "UamSecret": "",
    "UamServer": "",
    "UamPor": "",
    "UamAliasName": ""
  },
};
config.helpfaq = {
  formData: {
    "MSISDN": "8618620322862",
    "HwVersion": "HH70-V-V1.0",
    "DeviceName": "HH70"
  },
  formOptions: {},
  formRules: {}
};
//ddns
config.ddns = {
  formData: {
    showPassword:false,
    connection_status: "",
    service_Provider: "",
    status: 0,
    domain_name: "",
    user_name: "",
    password: ""
  },
  formOptions: {
    status: common.options.offOn,
    service_Provider: [],
    showPassword: common.options.checkBoxEnable,
  },
  validates: {},
  formRules: {
    domain_name: [
      //common.rule.required,
      { required: true, message: 'ids_ddns_domainnameRequired', trigger: 'change' },
      { validator: validates.isValidAscIICharset, message: 'ids_ddns_domainnameRequired' },
      { validator: validates.isStartWithChar, message: 'ids_ddns_invalidDomainnameStart' },
      { validator: validates.ValidStarDomainname, message: 'ids_ddns_invalidDomainnameStart' },
      { validator: validates.ValidEndDomainname, message: 'ids_ddns_invalidDomainnameEnd' }
    ],
    user_name: [
      //common.rule.required
      { required: true, message: 'ids_ddns_userNameRequired', trigger: 'change' },
      { validator: validates.isValidAscIICharset, message: 'ids_ddns_userNameRequired' },
      { validator: validates.isTValidName, message: 'ids_ddns_invalidUsername' }
    ],
    password: [
      //common.rule.required
      { required: true, message: 'ids_ddns_passwordRequired', trigger: 'change' },
      { validator: validates.isValidAscIICharset, message: 'ids_ddns_passwordRequired' }
    ],
  },
  formRulesExtension: {}
}
config.ddns.formOptions.service_Provider = sys.service_Provider;

export default config;
