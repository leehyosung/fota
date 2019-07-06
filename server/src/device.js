'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')
const crypto = require('crypto')

const interactor = require('./interactor')

printGuide()
interactor(onInput)

function request(url) {
  return new Promise((resolve, reject) => {
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

      res.on('data', body => {
        console.log(`[REQ:${url}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`)
        console.log(`[RES:${url}] ${res.statusCode} ${body.toString()}`)

        resolve([res.statusCode, body])
      })
    })

    req.on('error', e => {
      console.error(e);
      reject(e)
    });

    req.end()
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
    let [statusCode, body] = await request('/' + input)

    if (statusCode === 200 && input.startsWith('firmware')) {
      const res = JSON.parse(body)

      const binary = Buffer.from(res.firmware.data, 'base64')
      const hash = res.firmware.data !== '' ? crypto.createHash('sha256').update(binary).digest('base64') : ''

      console.log('')
      console.log(`firmware hash in res : ${res.firmware.hash}`)
      console.log(`firmware hash made   : ${hash}`)
    }
  }

  printGuide()
}

function validate(input) {
  // TODO : validation code
  return true
}