'use strict'

const https = require('https')
const url = require('url')

const Keystore = require('./Keystore')
const bizlogic = require('./bizlogic')

const keystore = new Keystore('server', true)

require('./config').apply()

run()

async function run() {
  const port = 8443

  https.createServer((await options()), async (req, res) => {
    const urlParsed = url.parse(req.url, true)

    const cipher = req.connection.getCipher()
    const cert = req.connection.getPeerCertificate(true)

    console.debug(`[PID:${process.pid}|UID:${process.getuid()}|LCOAL_CERT] ${req.connection.getCertificate().subject.CN} ${req.connection.getCertificate().fingerprint}`)
    console.debug(`[PID:${process.pid}|UID:${process.getuid()}|REMOTE_CERT] ${cert.subject.CN} ${cert.fingerprint}`)
    console.log(`[REQ:${urlParsed.pathname}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`)

    try {
      switch (urlParsed.pathname) {
        case '/version':
          finalize(res, bizlogic.version())
          break

        case '/firmware':
          finalize(res, (await bizlogic.firmware(urlParsed.query.version)))
          break

        case '/':
          finalize(res, {
            statusCode: 200,
            body: 'hello 2jo'
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
}

async function options() {
  const ret = {
    cert: await keystore.certificate(),
    key: await keystore.privateKey(),

    // This is necessary only if using client certificate authentication. : true
    requestCert: true,
    rejectUnauthorized: true,

    // This is necessary only if the client uses a self-signed certificate.
    ca: [(await keystore.certificateOfCa())],
    passphrase: await keystore.passphraseOfPrivateKey(),
    minVersion: 'TLSv1.3',
  }

  return ret
}

function finalize(res, result) {
  res.writeHead(result.statusCode)
  res.end(JSON.stringify(result.body))
}