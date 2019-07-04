'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')

const options = {
  hostname: 'localhost',
  port: 8443,
  path: '/',
  method: 'GET',

  cert: fs.readFileSync(path.join(__dirname, '../../cert/device1/certificate.pem')),
  key: fs.readFileSync(path.join(__dirname, '../../cert/device1/privatekey.pem')),
  ca: fs.readFileSync(path.join(__dirname, '../../cert/ca/certificate.pem')),
  passphrase: 'device1',

  checkServerIdentity: (servername, cert) => {
    return undefined
  },
  // servername: '2jo',
}

const req = https.request(options, (res) => {
  res.on('data', (data) => {
    console.log(data.toString())
    process.stdout.write(data)
  })
})

req.end()