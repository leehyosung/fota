'use strict'

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const https = require('https');

const keystore = require('./keystore');

const update_info_file = 'updateInfo.txt';

module.exports.version = version;
module.exports.firmware = firmware;
module.exports.request = request;


async function version(url) {
  let [statusCode, body, certificate] = await request(url);
  return {
    statusCode: statusCode,
    body: body.toString()
  }
}

async function firmware(url) {
  let [statusCode, body, certificate] = await request(url);

  const body_parsed = JSON.parse(body.toString());
  const version = body_parsed.firmware.version;
  const data = body_parsed.firmware.data;
  const signature = body_parsed.firmware.signature;
  const cert = body_parsed.firmware.certificate;

  return {
    statusCode: statusCode,
    body: {
      firmware: {
        version: version,
        data: data ? data : '',
        signature: signature ? signature : '',
        certificate: cert ? cert : ''
      }
    }
  }
}

// function firmware(requestVersion) {
//   const [version, firmwarePath] = firmwareInfo(requestVersion);
//
//   let binary = firmwarePath ? fs.readFileSync(firmwarePath) : undefined;
//
//   return {
//     statusCode: binary ? 200 : 404,
//     body: {
//       firmware: {
//         version: version,
//         data: binary ? binary.toString('base64') : '',
//         signature: binary ? signature(version) : '',
//       }
//     }
//   }
// }

let server_cert;

// server request
async function request(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8443,
      path: url,
      method: 'GET',

      cert: fs.readFileSync(path.join(__dirname, '../../cert/gateway/certificate.pem')),
      key: fs.readFileSync(path.join(__dirname, '../../cert/gateway/privatekey.pem')),
      ca: fs.readFileSync(path.join(__dirname, '../../cert/ca/certificate.pem')),
      passphrase: 'gateway',
      servername: '2jo-server', //Should be the same with server certificate's CN

      rejectUnauthorized: true,
    };

    https.request(options, res => {
      const cipher = res.connection.getCipher();


      server_cert = server_cert ? server_cert : res.connection.getPeerCertificate();

      res.on('data', body => {
        console.log(`[LCOAL CERT] ${res.connection.getCertificate().subject.CN} ${res.connection.getCertificate().fingerprint}`);
        console.log(`[REMOTE CERT] ${server_cert.subject.CN} ${server_cert.fingerprint}`);
        console.log(`[REQ:${url}] ${res.connection.remoteAddress} ${cipher.version} ${cipher.name}`);
        console.log(`[RES:${url}] ${res.statusCode} ${body.toString()}`);

        resolve([res.statusCode, body, server_cert]);
      })
    }).on('error', e => {
      reject(e)
    }).end()
  })
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