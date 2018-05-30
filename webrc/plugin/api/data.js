var config = {
  Pin: "1234",
  Puk: "12345678",
  UserName: "admin",
  Password: "admin"
}

let ConnectionStatus = 0; //
export default {
  config: config,
  GetLoginState: {
    "State": 0,
    "LoginRemainingTimes": 5,
    "LockedRemainingTime": 0
  },
  Language: "en",
  GetSimStatus: {
    "SIMState": 7,
    "PinState": 2,
    "PinRemainingTimes": 3,
    "PukRemainingTimes": 5,
    "SIMLockState": 10,
    "SIMLockRemainingTimes": 0
  },
  GetAutoValidatePinState: {
    "State": 0
  },
  GetPasswordSaveInfo: {
    "username": "admin",
    "password": "admin",
    "save_flag": 0
  },
  //*****************Connection*****************
  GetConnectionState: {
    "ConnectionStatus": ConnectionStatus,
    "ConnectProfile": "UNICOM",
    "IPv4Adrress": "0.0.0.0",
    "IPv6Adrress": "0::0",
    "DlRate": 0,
    "UlRate": 0,
    "UlBytes": 0,
    "DlBytes": 0,
    "ConnectionTime": 0
  },
  GetConnectionSettings: {
    "IdleTime": 600,
    "ConnectMode": 1,
    "RoamingConnect": 1,
    "PdpType": 3
  },
  //*****************Network*****************
  GetNetworkInfo: {
    "PLMN": "46001",
    "NetworkType": 7,
    "LAC": 42286,
    "CellId": 23018347,
    "RncId": 7,
    "NetworkName": "",
    "SpnName": "",
    "Roaming": 1,
    "Domestic_Roaming": 1,
    "SignalStrength": 3,
    "mcc": "026",
    "mnc": "333",
    "SINR": "",
    "RSRP": "",
    "RSSI": "",
    "eNBID": "",
    "CGI": "",
    "CenterFreq": "",
    "TxPWR": "",
    "LTE_state": 0,
    "PLMN_name": "china unicom",
    "Band": "",
    "DL_channel": "",
    "UL_channel": "",
    "RSRQ": ""
  },
  SearchNetworkResult: {
    "SearchState": 0,
    "ListNetworkItem": []
  },
  GetNetworkRegisterState: {
    "regist_state": 0
  },
  GetNetworkSettings: {
    "NetworkMode": 2,
    "NetselectionMode": 0
  },
  //*****************Wlan*****************
  GetWlanState: {
    "WlanState": 1
  },
  GetWlanSettings: {
    "WlanAPMode": 0,
    "curr_num": 0,
    "AP2G": {
      "WlanAPID": 0,
      "ApStatus": 1,
      "WMode": 2,
      "Ssid": "",
      "SsidHidden": 1,
      "Channel": 0,
      "SecurityMode": 4,
      "WepType": 0,
      "WepKey": "12345678",
      "WpaType": 1,
      "WpaKey": "1234567890",
      "CountryCode": "CN",
      "ApIsolation": 0,
      "max_numsta": 15,
      "curr_num": 5
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
      "WlanAPID": 1,
      "ApStatus": 0,
      "WMode": 4,
      "Ssid": "",
      "SsidHidden": 0,
      "Channel": 0,
      "SecurityMode": 4,
      "WepType": 1,
      "WepKey": "12345678",
      "WpaType": 1,
      "WpaKey": "1234567890",
      "CountryCode": "CN",
      "ApIsolation": 0,
      "max_numsta": 15,
      "curr_num": 0
    }
  },
  GetWlanSupportMode: {
    "WlanAPMode": 0
  },
  GetWlanStatistics: {
    "List": []
  },

  //*****************SMS*****************
  getSmsInitState: {
    "state": 0
  },
  GetSMSContactList: {
    "SMSContactList": [],
    "Page": 1,
    "TotalPageCount": 3
  },
  GetSMSContentList: {
    "SMSContentList": [],
    "Page": 1,
    "ContactId": 4,
    "PhoneNumber": [],
    "TotalPageCount": 1
  },
  GetSMSStorageState: {
    "TUseCount": 0,
    "UnreadSMSCount": 0,
    "UnreadReport": 0,
    "LeftCount": 50,
    "MaxCount": 50
  },
  GetSendSMSResult: {
    "SendStatus": 0
  },
  GetSMSSettings: {
    "SMSCenter": "+8613010888500",
    "StoreFlag": 0,
    "SMSReportFlag": 0
  },
  GetSMSListByContactNum: {
    "SMSList": [],
    "Page": 1,
    "TotalPageCount": 1
  },
  getNewSMS: {
    "SMSId": 65543,
    "SMSType": 2,
    "SMSContent": "温馨提示：您30日上网流量8.10MB，本月累计上网流量67.64MB。如需帮助，可访问沃在线客服chat.gd10010.cn\/llrts。",
    "SMSTime": "31-07-2015 10:43:13"
  },
  GetNewMessage: {
    "PhoneNumber": "18617092862",
    "SMSType": 1,
    "SMSContent": "dsfasdgdsg",
    "SMSId": 65538,
    "SMSTime": "2016-07-22 17:23:11",
    "SMSTimezone": 942735648
  },

  //*****************Statistics*****************
  GetUsageRecord: {
    "HUseData": 42342,
    "HCurrUseUL": 2122,
    "HCurrUseDL": 42344,
    "RoamUseData": 42342,
    "RCurrUseUL": 2122,
    "RCurrUseDL": 42344,
    "TConnTimes": 42342,
    "CurrConnTimes": 2122,
    "MonthlyPlan": 42344,
    "NextCycleDate": "2014-09-11",
    "RemainingDays": 11
  },
  GetUsageSettings: {
    "MonthlyPlan": 1024,
    "UsedData": 300,
    "Unit": 0,
    "UnitWarn": 0,
    "BillingDay": 1,
    "TimeLimitFlag": 1,
    "TimeLimitTimes": 1,
    "UsedTimes": 1,
    "AutoDisconnFlag": 1,
    "UsedDataWarn": 50

  },
  GetUsageSetFlag: {
    "usageSet_flag": 0
  },

  //*****************USSD*****************
  GetUSSDSendResult: {
    "UssdContent": "",
    "UssdType": 1,
    "SendState": 1,
    "UssdContentLen": 1

  },
  //*****************Update*****************
  GetDeviceNewVersion: {
    "State": "0",
    "Version": "MW40_test2",
    "Date": "999",
    "total_size": 56655858

  },
  GetDeviceUpgradeState: {
    "Status": 0,
    "Process": 0
  },
  GetManualUpdateProcess: {
    "update_status": "Downloading", //Downloading、Installing、DownloadFail、InstallFail、OK-reboot
    "IsReadyForUpdate": 0

  },

  //*****************Firewall*****************
  GetMacFilterSettings: {
    "filter_policy": 0,
    "MacAllowList": [],
    "MacDenyList": []
  },
  GetPortFwding: {
    "total_num": 2,
    "portfwd_list": []

  },
  GetDMZSettings: {
    "dmz_status": 1,
    "dmz_ip": "192.168.1.60"
  },
  GetIPFilterList: {
    "total_num": 1,
    "filter_policy": 1,
    "ipFilter_list": []

  },
  GetFirewallSwitch: {
    "firewall_status": 1,
    "ipflt_status": 1,
    "wan_ping_status": 0,
    "port_forward_status": 1
  },
  GetUrlFilterSettings: {
    "filter_policy": 1,
    "UrlAllowList": [],
    "UrlDenyList": []
  },
  GetWanAccess: {
    "disableWanAcess": 1
  },

  GetALGSettings: {
    "FtpStatus": 0,
    "H323AlgStatus": 0,
    "SipAlgStatus": 0,
    "SipAlgPort": 5060
  },
  GetParentalSettings: {
    "Control_policy": 1,
    "ParentalControl_list": []

  },
  
  GetVPNPassthrough: {
    "status": 0,
    "vpn_server": "192.168.1.60"
  },
  //*****************Lan*****************
  GetLanSettings: {
    "IPv4IPAddress": "192.168.1.1",
    "SubnetMask": "255.255.255.0",
    "DHCPServerStatus": 0,
    "StartIPAddress": "192.168.1.12",
    "EndIPAddress": "192.168.1.99",
    "DHCPLeaseTime": 12,
    "DHCPLeaseTimeType": 1,
    "MacAddress": "",
    "VPNPassthrough": 0,
    "DNSMode": 0,
    "DNSAddress1": "",
    "DNSAddress2": ""
  },

  GetLanPortInfo: {
    "List": []
  },

  GetLanStatistics: {
    "List": []
  },


  //*****************ConnectionDevices*****************
  GetConnectedDeviceList: {
    "ConnectedList": [],
    "ConnectedGuestList": []

  },
  GetBlockDeviceList: {
    "BlockList": []
  },
  GetDeviceDefaultRight: {
    "InternetRight": 1,
    "StorageRight": 1
  },

  //*****************System*****************
  GetSystemInfo: {
    "DeviceName": "y858",
    "IMEI": "123456789012",
    "HwVersion": "ABCD",
    "SwVersion": "MW40_test1",
    "HttpApiVersion": "1.0",
    "WebUiVersion": "",
    "MacAddress": "",
    "UICCID": "",
    "HNBN": "",
    "CSGT": "",
    "IMEISV": "",
    "RFVersion": "",
    "AsicVersion": "",
    "msisdn": "",
    "IMSI": "",
    "Model": "",
    "FirmwareVersion": "",
    "FWBuildDate": "",
    "WebAppVersion": "",
    "BootloaderVersion": "",
    "Manager": "",
    "Manufacturer": "",
    "AMSSVersion": "",
    "Chipset": ""
  },
  GetCurrentLanguage: {
    "Language": "en"
  },
  GetSystemStatus: {
    "NetworkType": 0,
    "SignalStrength": 0,
    "WlanState": 0,
    "ConnectionStatus": 0,
    "SmsState": 0,
    "chg_state": 0,
    "bat_cap": 0,
    "bat_level": 1,
    "Roaming": 0,
    "curr_num": 0,
    "Conprofileerror": 0,
    "NetworkName": "",
    "TotalConnNum": 0,
    "UsbStatus": 0
  },
  GetUpnpSettings: {
    "upnp_switch": 1
  },
  GetCurrentTime: {
    "CurrTime": "",
    "TimeZone": "GMT0",
    "ZoneName": "UTC"
  },
  GetSystemSettings: {
    "AntennaSwitch": 1,
    "NtpServer1": "192.168.9.12",
    "NtpServer2": "192.168.9.13"
  },


  //*****************Sharing*****************
  GetDLNASettings: {
    "DlnaStatus": 0,
    "DlnaName": "Y858"
  },
  GetSambaStatus: {
    "SambaStatus": 0
  },
  GetSambaSettings: {
    "SambaStatus": 0,
    "Anonymous": 0,
    "AuthType": 0
  },
  GetFtpStatus: {
    "FtpStatus": 0
  },
  GetFtpSettings: {
    "FtpStatus": 0,
    "Anonymous": 0,
    "AuthType": 0
  },
  GetSDCardSpace: {
    "TotalSpace": 645656,
    "UsedSpace": 6456
  },
  GetSDFileList: {
    "FileList": [],
    "Page": 1,
    "TotalPage": 1,
    "Path": "/"

  },
  GetSDcardStatus: {
    "SDcardStatus": 1
  },
  GetUsbcardStatus: {
    "UsbcardStatus": 1
  },
  GetUIPwState: {
    "UIPwState": 0
  },

  GetUserNameAndPw: {
    "username": "admin",
    "password": "admin"
  },
  GetPasswordSaveInfo: {
    "username": "admin",
    "password": "admin",
    "save_flag": 0
  },

  //*****************Profile*****************
  GetProfileList: {
    "ProfileList": []

  },

  GetToken: {
    token: 0
  },
  //*****************Power Management*****************
  GetBatteryState: {
    "chg_state": 0,
    "BatteryLevel": 50
  },
  GetPowerSavingMode: {
    "SmartMode": 0,
    "WiFiMode": 1 /*[Optional]*/
  },

  //*****************WAN*****************
  GetWanSettings: {
    "SubNetMask": "",
    "Gateway": "",
    "IpAddress": "",
    "Mtu": 0,
    "ConnectType": 0,
    "PrimaryDNS": "",
    "SecondaryDNS": "",
    "Account": "",
    "Password": "",
    "Status": 0,
    "StaticIpAddress": "",
    "pppoeMtu": 0,
    "DurationTime": 0,
    "WanType": ""
  },
  GetWanCurrentMacAddr: {
    "MacAddr": "",
    "HostMacAddr": ""
  },
  GetWanIsConnInter: {
    "ConnToInterStatus": 0
  },
  //*****************Call Logs*****************
  GetCallLogList: {
    "CallLogList": [],
    "Page": 0,
    "TotalPageCount": 1
  },

  //*****************routingrules*****************
  GetStaticRouting: {
    "State": 0,
    "StaticRoutingList": []
  },
  GetDynamicRouting: {
    "RipState": 0,
    "Operation": 0,
    "RipVerion": 0
  },
  //*****************tr069*****************
  GetClientConfiguration: {
    "AcsUrl": "",
    "AcsUserName": "",
    "AcsUserPassword": "",
    "ConReqAuthent": 0,
    "ConReqUserName": "",
    "ConReqUserPassword": "",
    "Inform": 0,
    "InformInterval": 60
  },
  //Qos
  GetQosSettings: {
    "State": 1,
    "QosList": []
  },

  //first login
  GetPasswordChangeFlag: {
    "change_flag": 0
  },
  GetLastUrl: {
    "last_url": ""
  },
  //*****************DDNS*****************
  GetDdnsSettings: {
    "Ddns_list":[]
  }

}