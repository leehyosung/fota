'use strict'

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const keystore = require('./keystore');

const update_info_file = 'updateInfo.txt';

module.exports.version = version;
module.exports.firmware = firmware;

function version() {
  return {
    statusCode: 200,
    body: {
      version: firmwareInfo()[0]
    }
  }
}

function firmware(requestVersion) {
  const [version, firmwarePath] = firmwareInfo(requestVersion);

  let binary = firmwarePath ? fs.readFileSync(firmwarePath) : undefined;

  return {
    statusCode: binary ? 200 : 404,
    body: {
      firmware: {
        version: version,
        data: binary ? binary.toString('base64') : '',
        signature: binary ? signature(version) : '',
      }
    }
  }
}

function firmwareInfo(requestVersion) {
  const files = fs.readdirSync(path.join(__dirname, '../../firmware'));

  let fileName, version = 0;

  if (requestVersion) {
    const filePath = path.join(__dirname, `../../firmware/firmware.${requestVersion}`);

    return fs.existsSync(filePath) ? [requestVersion.toString(), filePath] : [requestVersion.toString(), undefined]
  } else {
    files.forEach(element => {
      const tokens = element.split('.');

      if (tokens[0] !== 'firmware') {
        return
      }

      const num = parseInt(tokens[1]);
      if (num > version) {
        version = num;
        fileName = element
      }
    });

    return [version.toString(), path.join(__dirname, '../../firmware/', fileName)]
  }
}

//server에서 전달 받는 정보를 전달함
//TODO version check
function signature(version) {
  const filePath = path.join(__dirname, `../../firmware/` + update_info_file);
  if (!fs.existsSync(filePath)){
    return undefined;
  }

  let signature = fs.readFileSync(filePath);
  var update_info = JSON.parse(signature);

  if(version === update_info.version)
    return update_info.signature;
  else {
    console.log('invalided update info signature : version info = ' + version);
    return undefined;
  }
}