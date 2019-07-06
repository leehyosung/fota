'use strict'

const https = require('https')
const fs = require('fs')
const path = require('path')
const url = require('url')

const bizlogic = require('./bizlogic')

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

  console.log(`[REQ:${urlParsed.pathname}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`)

  try {
    switch (urlParsed.pathname) {
      case '/version':
        finalize(res, bizlogic.version())
        break

      case '/firmware':
        finalize(res, bizlogic.firmware(urlParsed.query.version))
        break

      case '/':
        finalize(res, {
          statusCode: 200,
          body: 'hello 2'
        })
        break

      default:
        finalize(res, {
          statusCode: 404,
          body: `Invalid Path : ${urlParsed.pathname}`
        })
        break
    }
  } catch (e) {
    console.error(e)

    finalize(res, {
      statusCode: 500,
      body: 'Internal Server Error'
    })
  }
}).listen(port)

console.log('2JO-SOTA server started successfully.')

function finalize(res, result) {
  res.writeHead(result.statusCode)
  res.end(JSON.stringify(result.body))
}