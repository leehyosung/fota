'use strict'

const https = require('https')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const fsutil = require('./fsutil')
const Keystore = require('./Keystore')
const interactor = require('./interactor')

require('./config').apply()

printGuide()
interactor(onInput)

let certificate = null;
let downloadFilePath = null;

function sanitize(url) {
  if (url === '/firmware') {
    return url + `?source=${process.argv[2]}`
  } else if (url.startsWith('/firmware?')) {
    return url + `&source=${process.argv[2]}`
  } else {
    return url
  }
}

async function getOptions(url) {
  const keystore = new Keystore(process.argv[2])

  return {
    hostname: 'localhost',
    port: 8443,
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

async function request(url) {
  const options = await getOptions(url)

  return new Promise((resolve, reject) => {
    https.request(options, res => {
      const cipher = res.connection.getCipher()

      certificate = certificate ? certificate : res.connection.getPeerCertificate()

      res.on('data', body => {
        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|LCOAL_CERT] ${res.connection.getCertificate().subject.CN} ${res.connection.getCertificate().fingerprint}`)
        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|REMOTE_CERT] ${certificate.subject.CN} ${certificate.fingerprint}`)
        console.log(`[REQ:${url}] ${res.connection.remoteAddress} ${cipher.version} ${cipher.name}`)
        console.log(`[RES:${url}] ${res.statusCode}\n${JSON.stringify(JSON.parse(body.toString()), null, 2)}`)

        resolve([res.statusCode, body, certificate])
      })
    }).on('error', e => {
      reject(e)
    }).end()
  })
}

function printGuide() {
  const msg =
    `\n---------------- 2JO device emulator! ----------------------------------` +
    `\n[version] Type for the latest version checking.` +
    `\n[firmware] Type for downloading the latest firmware.` +
    `\n[firmware?version=?] Type for downloading the specific firmware version.` +
    `\n[quit or ctrl + C] Type for exit.` +
    `\n------------------------------------------------------------------------\n`

  console.log(msg)
}

async function onInput(input) {
  input = input.toLowerCase()

  if (validate(input) === false) {
    console.log(`Invalid input! : ${input}`)
  } else {
    let [statusCode, body, certificate] = await request('/' + input)

    if (statusCode === 200 && input.startsWith('firmware')) {
      const res = JSON.parse(body)

      const resultOfVerification = res.firmware.data === '' ? 'N/A' : verify(res.firmware.signature, Buffer.from(res.firmware.data, 'base64'), certificate)

      console.log(`\nResult of signature verification : ${resultOfVerification}`)

      downloadFilePath = save(res.firmware.version, res.firmware.data)

      console.log(`Downloaded firmware saved in '${downloadFilePath}`)
    }
  }

  printGuide()
}

function verify(signature, binary) {
  const verify = crypto.createVerify('SHA256');
  verify.update(binary);
  verify.end();

  const publicKey = {
    key: certificate.pubkey,
    format: 'der',
    type: 'spki'
  }

  return verify.verify(crypto.createPublicKey(publicKey), signature, 'base64')
}

function validate(input) {
  // TODO : validation code
  return true
}

function save(version, dataOfbase64) {
  const dir = path.join(__dirname, `../../downloaded`)

  if (fs.existsSync(dir)) {
    fsutil.rmdir(dir)
  }

  fs.mkdirSync(dir)

  const filepath = path.join(dir, `/firmware.${version}`)
  fs.writeFileSync(filepath, dataOfbase64, 'base64')

  fs.chmodSync(filepath, '744')

  return filepath
}