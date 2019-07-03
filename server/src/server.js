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
  passphrase: 'server',
  minVersion: 'TLSv1.3'
};

const port = 8443

https.createServer(options, (req, res) => {
  let ret = {
    statusCode: 200,
    body: 'hello world'
  }

  try {
    const urlParsed = url.parse(req.url, true)

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

function finalize(res, result) {
  res.writeHead(result.statusCode)
  res.end(JSON.stringify(result.body))
}