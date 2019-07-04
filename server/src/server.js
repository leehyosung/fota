'use strict'

const https = require('https')
const fs = require('fs')
const path = require('path')
const url = require('url')

const version = require('./version')
const firmware = require('./firmware')

const options = {
  cert: fs.readFileSync(path.join(__dirname, '../../cert/server/certificate.pem')),
  key: fs.readFileSync(path.join(__dirname, '../../cert/server/privatekey.pem')),

  // This is necessary only if using client certificate authentication. : true
  requestCert: true,
  rejectUnauthorized: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [fs.readFileSync(path.join(__dirname, '../../cert/ca/certificate.pem'))],
  passphrase: 'server',
  minVersion: 'TLSv1.3'
};

const port = 8443

https.createServer(options, (req, res) => {
  const urlParsed = url.parse(req.url, true)

  const cipher = req.connection.getCipher()

  console.log(`REQ | ${req.connection.remoteAddress} | ${urlParsed.pathname} | ${cipher.version} | ${cipher.name}`)

  let ret = {
    statusCode: 200,
    body: 'hello world'
  }

  try {
    switch (urlParsed.pathname) {
      case '/version':
        ret = version()
        break

      case '/firmware':
        ret = firmware(urlParsed.query.version)
        break

      default:
        break
    }
  } catch (e) {
    console.error(e)

    ret = {
      statusCode: 500,
      body: e.message
    }
  }

  finalize(res, ret)
}).listen(port)

console.log('2JO-SOTA server started successfully.')

function finalize(res, result) {
  res.writeHead(result.statusCode)
  res.end(JSON.stringify(result.body))
}