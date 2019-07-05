'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')
const interactor = require('./interactor')

printGuide()
interactor(onInput)

function request(url, onEnd) {
  const options = {
    hostname: 'localhost',
    port: 8443,
    path: url,
    method: 'GET',

    cert: fs.readFileSync(path.join(__dirname, '../../cert/device1/certificate.pem')),
    key: fs.readFileSync(path.join(__dirname, '../../cert/device1/privatekey.pem')),
    ca: fs.readFileSync(path.join(__dirname, '../../cert/ca/certificate.pem')),
    passphrase: 'device1',
    servername: '2jo-server', //Should be the same with server certificate's CN

    rejectUnauthorized: true,
  }

  const req = https.request(options, res => {
    const cipher = req.connection.getCipher()

    res.on('data', data => {
      console.log(`[REQ:${url}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`)
      console.log(`[RES:${url}] ${data.toString()}`)

      onEnd()
    })
  })

  req.on('error', e => {
    console.error(e);
    onEnd()
  });

  req.end()
}

function printGuide() {
  console.log(`\n---------------- 2JO device emulator! ----------------` +
    `\n[version] Type for the latest version checking.` +
    `\n[firmware] Type for downloading the latest firmware.` +
    `\n[quit] Type for exit.` +
    `\n------------------------------------------------------`)
}

function onInput(input) {
  switch (input.toLowerCase()) {
    case 'version':
      request('/version', printGuide)
      break

    case 'firmware':
      request('/firmware', printGuide)
      break

    default:
      console.log(`echo : ${input}`)
      break
  }
}