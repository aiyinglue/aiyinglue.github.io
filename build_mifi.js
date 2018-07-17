const bluebird = require('bluebird');
const path = require('path');
const child_process = require('child_process');
const moment = require('moment');
const _ = require('underscore');
const fs = bluebird.promisifyAll(require("fs"));
const execAsync = bluebird.promisify(require('child_process').exec);
const xlsx = require("node-xlsx");
const watch = require('node-watch');

var WEBRC_WWW = "webrc"
var DIST_WWW = "dist"
var CustomDir = "Custom"
const OnlineConfigProject = ["HH40","HH41","HH70"];//use online website generated config file
const ExcelConfigProject = ["MW70","MW71","MW120","MW40"];//use excel generated config file

var args = process.argv.splice(2);
var $buildType = args[0] || "b"
var $projectName = args[1] || "HH70"
var $customName = args[2] || "Generic"
var $version = args[3] || ""
if ($version !== "") {
  $version = "-r" + $version
}

console.log($buildType)
console.log($projectName)
console.log($customName)

var $projectPath = CustomDir + "/" + $projectName
var $customPath = $projectPath + "/" + $customName

init($buildType, $projectName, $customName);

function cmd(cmd) {
  console.log("cmd:" + cmd)
  try {
    return child_process.execSync(cmd, {
      encoding: "utf8"
    })
  } catch (err) {
    return false
  }
}

//拷贝源代码
function copy2webrc() {
  cmd(`cp -rf src/** ${WEBRC_WWW}`);
  cmd(`cp -rf ${$projectPath}/Generic/** ${WEBRC_WWW}`);
  if ($customName !== "Generic") {
    cmd(`cp -rf ${$customPath}/** ${WEBRC_WWW}`);
  }
}

function init(...args) {
  let [$buildType, $projectName = "", $customName = "Generic"] = [...args]
  if ($buildType !== "b" && $buildType !== "p") {
    console.log("buildType Error:b or p")
    return;
  }

  if ($projectName == "" || !fs.existsSync($projectPath)) {
    console.log("projectName Error")
    return;
  }

  if ($customName == "" || !fs.existsSync($customPath)) {
    console.log("customName Error")
    return;
  }
  cmd(`rm -rf ${WEBRC_WWW}`)
  cmd(`mkdir ${WEBRC_WWW}`)
  //if ($buildType == "p") {
  cmd("rm -rf Requirements")
  //}

  //拷贝需求文件或根据Excel需求配置表生成json需求配置文件
  let GenericRequirements, WebUIRequirements = {},
    CustomRequirements = {}
    try {
      if (OnlineConfigProject.indexOf($projectName) != -1) {//拷贝需求文件
        if (!fs.existsSync(`./Requirements/${$projectName}`)) {
          cmd(`svn export --force "svn://10.128.161.92/datacard/SPM/03 Customized Requirements/${$projectName}/Config" Requirements/${$projectName}`)
          GenericRequirements = require(`./Requirements/${$projectName}/Generic.json`);
          if ($customName != "Generic") {
            CustomRequirements = require(`./Requirements/${$projectName}/${$customName}.json`);
          }
          _.each(CustomRequirements, function (v, m) {
          if (_.has(GenericRequirements, m)) {
                _.extend(GenericRequirements[m], v)
              }
          })
          writeConfigcb();
        }
      } else if (ExcelConfigProject.indexOf($projectName) != -1) {//根据Excel需求配置表生成json需求配置文件
        console.log(`start parseXlsxJson`);
        parseXlsxJson($projectName, $customName, function () {
          console.log("parseXlsxJson success");
        });
        GenericRequirements = require(`./Requirements/${$projectName}/${$customName}.json`);
        writeConfigcb();
      }
    } catch (err) {
      console.log("Requirements error")
    }
    function writeConfigcb() {
      WebUIRequirements.verTime = moment().format('YYYY-MM-DD HH:mm:ss');
      _.extend(WebUIRequirements, GenericRequirements.WebUI);
      WebUIRequirements.defaultLanguage = GenericRequirements.system_config.SysLanguage;
      WebUIRequirements.defaultWlanCountryCode = GenericRequirements.wifi_config.DefaultCountry;
    }
  cmd("echo " + args + " > versionInfo.txt")
  if ($buildType == "p") {
    cmd("svn up")
    cmd("bash versionlog.sh")
  }

  copy2webrc()
  fs.writeFileSync(`${WEBRC_WWW}/config/customConfigAuto.json`, JSON.stringify(WebUIRequirements, null, 2));
  fs.writeFileSync(`${WEBRC_WWW}/i18n/verInfo.json`, JSON.stringify(WebUIRequirements, null, 2));
  watchFile()

  function watchFile() {
    var watchDir = ["src", `${$projectPath}/Generic/`];
    if ($customName !== "Generic") {
      watchDir.push($customPath)
    }
    if ($buildType == "b") {
      _watchFile()
    }

    function _watchFile() {
      watch(watchDir, function (file) {
        file = file.replace(/\\/g, "/")
        var webrcFile = ""
        console.log(`update file: ${file}`)
        if (file.indexOf("src") == 0) {
          webrcFile = file.replace("src", "")
          if (!fs.existsSync(`${$projectPath}/Generic${webrcFile}`) && !fs.existsSync(`${$customPath}${webrcFile}`)) {
            cmd(`cp -rf "${file}" "${WEBRC_WWW}/${webrcFile}"`)
          }
        } else if (file.indexOf(`${$projectPath}/Generic`) == 0) {
          webrcFile = file.replace(`${$projectPath}/Generic`, "")
          if ($customName == "Generic" || ($customName == "Generic" && !fs.existsSync($customPath + webrcFile))) {
            cmd(`cp -rf "${file}" "${WEBRC_WWW}/${webrcFile}"`)
          }
        } else if (file.indexOf($customPath) == 0) {
          webrcFile = file.replace($customPath, "")
          cmd(`cp -rf "${file}" "${WEBRC_WWW}/${webrcFile}"`)
        }
      });
    }
  }

  var langArr;
  try {
    langArr = WebUIRequirements.langListSupport || ["en"];
  } catch (err) {
    langArr = ["en", "fr", "it", "sp"]
  }
  /*let new_customConfig = require(`./webrc/config/customConfig.json`)
  if(OnlineConfigProject.indexOf($projectName) === -1){
    langArr= new_customConfig.langListSupport || ["en"]
  }*/
  if ($customName == "Beeline" && $projectName == "MW40V") {
    langArr = ["en", "ru", "kz"]
  }

  buildString(langArr, function () {
    cmd("rm -rf www")
    cmd("npm run build")
    cmd("mv versionInfo.txt www/")
    console.log(`###########################################${DIST_WWW}`)
    cmd(`rm -rf www/${DIST_WWW}/i18n/*.js`)
    cmd(`cp -rf vendor/vendor.dll.js www/${DIST_WWW}/`);
    if ($projectName === "MW40"){//MW40老项目使用ElementUI需要拷贝MW40/Generic下一些文件目录避免FW编译过程读不到相关文件影响编译流程。
      cmd(`cp -rf ${$projectPath}/Generic/** www/`);
    }
    console.log("npm build ok")
    console.log(args)
    if ($buildType == "p") { //如果是编译上库发版本
      release()
    }
  })

  //将生成的编译代码拷贝到指定的svn路径
  function release() {
    cmd(`svn up ../SmartSwReleaseUI/ElementUI`); //更新生产环境代码
    let releaseProjectPath
    if ($customName == "Generic") { //通用版本代码
      releaseProjectPath = path.join(__dirname, `../SmartSwReleaseUI/ElementUI/${$projectName}_rc`) //通用版目录路径
    }else{
      if ($customName == "Beeline" && $projectName == "MW40V") {
        releaseProjectPath = path.join(__dirname, `../SmartSwReleaseUI/Beeline/www`) //定制版本目录路径
      } else {
        releaseProjectPath = path.join(__dirname, `../SmartSwReleaseUI/ElementUI/${$customName}/${$projectName}_rc`) //定制版本目录路径
      }
      
    }
    //如版本代码目录不存在，则新建该目录，存在则清空目录代码
    if (!fs.existsSync(releaseProjectPath)) {
      cmd(`mkdir -p ${releaseProjectPath}`)
    } else {
      if ($customName != "Beeline" && $projectName != "MW40V") {//beeline项目不能清空原目录
        cmd(`rm -rf ${releaseProjectPath}/**`)
      }
    }
    //拷贝编译好的www代码到通用版目录
    cmd(`cp -rf www/** ${releaseProjectPath}`)
    cmd(`rm -rf ${releaseProjectPath}/${DIST_WWW}/i18n/*.js`)
    console.log("release ok")
  }
}

//解析xlsx表生成字符串json字符串
function buildString(langArr, callback) {
  let xlsxName;
  let sheetName;
  if (($customName === "Beeline" && $projectName === "MW40V") || ($customName === "LK_BeelineKZ" && $projectName === "MW40")) {
    xlsxName = "./MW40VBeeline.xlsx";
    sheetName = "MW40VBeeline";
  } else {
    xlsxName = "./HH70_String.xlsx";
    sheetName = "HH70_all";
  }
  const Xlsxlib = require('./lib/Xlsxlib');
  const StringData = new Xlsxlib(xlsxName, sheetName).toKvObj().data
  var stringMap = require(`./${WEBRC_WWW}/i18n/map.js`)
  var stringMapCustom = require(`./${WEBRC_WWW}/i18n/map_custom.js`)
  stringMap = mrgeObjects(stringMap);
  stringMapCustom = mrgeObjects(stringMapCustom);
  _.extend(stringMap, stringMapCustom);
  var stringRes = {}
  _.each(langArr, function (n) {
    stringRes[n] = {}
  })
  _.each(stringMap, function (i, v) {
    _.each(langArr, function (n) {
      stringRes[n][v] = StringData[n][i] || StringData["en"][i] || ""
    })
  })


  var i = 0;
  _.each(langArr, function (n) {
    var str_custom_path = `./${WEBRC_WWW}/i18n/${n}_custom.js`;
    var str_custom;
    var jsonPath = `./${WEBRC_WWW}/i18n/${n}.json`
    if (fs.existsSync(str_custom_path)) {
      str_custom = require(str_custom_path) || {}
      str_custom = mrgeObjects(str_custom);
      _.extend(stringRes[n], str_custom)
    }

    fs.writeFile(jsonPath, JSON.stringify(stringRes[n], null, 2), function (err) {
      console.log(jsonPath)
      i++;
      if (i == langArr.length) {
        if (callback) {
          callback()
        }
      }
    })
  })
}

  //解析MW70/MW71/MW120等需求xlsx表生成json配置文件
  function parseXlsxJson($ProjectName, $customName, callback) {
    let xlsxName = `./Requirements/${$projectName}/Requirement-all.xlsx`;
    let sheetName = "SW-V1.0";
    let parsedrequirments = {};
    let requirmentsConfig = {
      "WebUI": parsedrequirments,
      "system_config": {
        "SysLanguage": "en"
      },
      "wifi_config": {
        "DefaultCountry": "CN"
      }
    };
    if (!fs.existsSync(`./Requirements/${$projectName}`)) {
      cmd(`svn export --force "svn://10.128.161.92/datacard/SPM/03 Customized Requirements/${$projectName}" Requirements/${$projectName}`)
    }
    let xlsxData = xlsx.parse(xlsxName)[1].data; //sheet "SW-V1.0"
    let headerData = xlsxData[0];

    let JsKeyIndex = 2;
    let customNameIndex = 10;
    JsKeyIndex = headerData.indexOf("Js key");
    if ($customName != "Generic") {
      customNameIndex = headerData.indexOf($customName);
    } else {
      customNameIndex = headerData.indexOf("00_Generic");
    }
    _
      .each(xlsxData, function (i, v) {
        let tmpData = {};
        if (i[JsKeyIndex] != undefined && i[JsKeyIndex] != "disable auto country code") {
          a = i[JsKeyIndex]
          b = i[customNameIndex];
          tmpData[a] = b;
          _.extend(parsedrequirments, tmpData);
        }
      })
    requirmentsConfig.WebUI = parsedrequirments;
    requirmentsConfig.WebUI.langListSupport = parsedrequirments.sys_language.split(",") || ["en"];
    requirmentsConfig.system_config.SysLanguage = parsedrequirments.SysLanguage;
    requirmentsConfig.wifi_config.DefaultCountry = parsedrequirments.DefaultCountry;
    var jsonPath = `./Requirements/${$projectName}/${$customName}.json`;
    fs.writeFileSync(jsonPath,JSON.stringify(requirmentsConfig, null, 2));
  }

//用于将定制表中的字符串合并到json表中
function mrgeObjects(objectsMap) {
  _.map(objectsMap, function (i, v) {
    if (typeof (i) == "object") {
      _.extend(objectsMap, i);
      delete objectsMap[v];
    }
  });
  return objectsMap;
}
