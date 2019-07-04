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
  servername: '2jo-server', //Should be the same with server certificate's CN
}

const req = https.request(options, res => {
  const cipher = req.connection.getCipher()

  res.on('data', data => {
    console.log(`TLS version : ${cipher.version}`)
    console.log(`Cipher Name : ${cipher.name}`)

    console.log(data.toString())

    process.stdout.write(data)
  })
})

req.end()


// https://nodejs.org/api/tls.html
// There are only 5 TLSv1.3 cipher suites:

// 'TLS_AES_256_GCM_SHA384'
// 'TLS_CHACHA20_POLY1305_SHA256'
// 'TLS_AES_128_GCM_SHA256'
// 'TLS_AES_128_CCM_SHA256'
// 'TLS_AES_128_CCM_8_SHA256'