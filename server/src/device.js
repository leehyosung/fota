'use strict'

const https = require('https')
const crypto = require('crypto')

const Keystore = require('./Keystore')
const interactor = require('./interactor')

const keystore = new Keystore('gateway')

printGuide()
interactor(onInput)

let certificate = null;

async function request(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8443,
      path: url,
      method: 'GET',

      cert: keystore.certificate(),
      key: keystore.privateKey(),
      ca: keystore.certificateOfCa(),
      passphrase: keystore.passphraseOfPrivateKey(),

      servername: keystore.peerCommonName(), //Should be the same with server certificate's CN

      rejectUnauthorized: true,
    }

    https.request(options, res => {
      const cipher = res.connection.getCipher()

      certificate = certificate ? certificate : res.connection.getPeerCertificate()

      res.on('data', body => {
        console.log(`[LCOAL CERT] ${res.connection.getCertificate().subject.CN} ${res.connection.getCertificate().fingerprint}`)
        console.log(`[REMOTE CERT] ${certificate.subject.CN} ${certificate.fingerprint}`)
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

      console.log(`\nresult of signature verification : ${resultOfVerification}`)
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