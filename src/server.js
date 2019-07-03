'use strict'

const https = require('https');
const fs = require('fs');
const path = require('path')
const url = require('url')

const version = require('./version')
const firmware = require('./firmware')

const options = {
  cert: fs.readFileSync('cert/server/certificate.pem'),
  key: fs.readFileSync('cert/server/privatekey.pem'),
  passphrase: 'server',
  minVersion: 'TLSv1.3'
};

const port = 8443

https.createServer(options, (req, res) => {
  let ret = null

  let urlParsed = url.parse(req.url, true)

  switch (urlParsed.pathname) {
    case '/version':
      ret = version()
      break

    case '/firmware':
      ret = firmware(urlParsed.query.version)
      break

    default:
      ret = {
        statusCode: 200,
        body: 'hello world'
      }
      break
  }

  finalize(res, ret)
}).listen(port);

function finalize(res, result) {
  res.writeHead(result.statusCode)
  res.end(JSON.stringify(result.body))
}