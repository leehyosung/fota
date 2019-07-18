'use strict'

const https = require('https');

const Keystore = require('./Keystore');

module.exports.version = version;
module.exports.firmware = firmware;
module.exports.request = request;


async function version(url) {
  let [statusCode, body] = await request(url);
  const body_parsed = JSON.parse(body.toString());
  return {
    statusCode: statusCode,
    body: {
      version: body_parsed.version,
    }
  }
}

async function firmware(url) {
  let [statusCode, body] = await request(url);

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

function sanitize(url) {
  if (url === '/firmware' && !url.includes('source')) {
    return url + `?source=${process.argv[2]}`
  } else if (url.startsWith('/firmware?') && !url.includes('source')) {
    return url + `&source=${process.argv[2]}`
  } else {
    return url
  }
}

async function getOptions(url) {
  const keystore = new Keystore(process.argv[2]);

  return {
    hostname: global.config.serverIp,
    port: global.config.serverPort,
    path: sanitize(url),
    // path: url,
    method: 'GET',

    cert: await keystore.certificate(),
    key: await keystore.privateKey(),
    ca: await keystore.certificateOfCa(),
    passphrase: await keystore.passphraseOfPrivateKey(),

    servername: await keystore.peerCommonName(), //Should be the same with server certificate's CN

    rejectUnauthorized: true,
  }
}

let certificate;

// server request
async function request(url) {
  const options = await getOptions(url);

  return new Promise((resolve, reject) => {
    https.request(options, res => {
      const cipher = res.connection.getCipher();

      certificate = certificate ? certificate : res.connection.getPeerCertificate();

      res.on('data', body => {
        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|LCOAL_CERT] ${res.connection.getCertificate().subject.CN} ${res.connection.getCertificate().fingerprint}`);
        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|REMOTE_CERT] ${certificate.subject.CN} ${certificate.fingerprint}`);
        console.log(`[REQ:${url}] ${res.connection.remoteAddress} ${cipher.version} ${cipher.name}`);
        console.log(`[RES:${url}] ${res.statusCode}\n${JSON.stringify(JSON.parse(body.toString()), null, 2)}`);

        resolve([res.statusCode, body]);
      })
    }).on('error', e => {
      reject(e)
    }).end()
  })
}