'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const Keystore = require('./Keystore')

module.exports.version = version
module.exports.firmware = firmware

function version() {
  return {
    statusCode: 200,
    body: {
      version: firmwareInfo()[0]
    }
  }
}

async function firmware(requestVersion) {
  const [version, firmwarePath] = firmwareInfo(requestVersion)

  let binary = firmwarePath ? fs.readFileSync(firmwarePath) : undefined

  return {
    statusCode: binary ? 200 : 404,
    body: {
      firmware: {
        version: version,
        data: binary ? binary.toString('base64') : '',
        signature: binary ? (await signature(binary)) : '',
      }
    }
  }
}

function firmwareInfo(requestVersion) {
  const files = fs.readdirSync(path.join(__dirname, '../../firmware'))

  let fileName, version = 0

  if (requestVersion) {
    const filePath = path.join(__dirname, `../../firmware/firmware.${requestVersion}`)

    return fs.existsSync(filePath) ? [requestVersion.toString(), filePath] : [requestVersion.toString(), undefined]
  } else {
    files.forEach(element => {
      const tokens = element.split('.')

      if (tokens[0] !== 'firmware') {
        return
      }

      const num = parseInt(tokens[1])
      if (num > version) {
        version = num
        fileName = element
      }
    })

    return [version.toString(), path.join(__dirname, '../../firmware/', fileName)]
  }
}

async function signature(data) {
  const keystore = new Keystore('server')

  const sign = crypto.createSign('SHA256')

  sign.write(data)
  sign.end()

  const privateKey = crypto.createPrivateKey({
    key: await keystore.privateKey(),
    passphrase: await keystore.passphraseOfPrivateKey()
  })

  return sign.sign(privateKey, 'base64')
}