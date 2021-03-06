'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const Keystore = require('./Keystore')
const crypt = require('./crypt')

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

async function firmware(requestVersion, source) {
  const [version, firmwarePath] = firmwareInfo(requestVersion)

  console.log(`[INFO:/firmware] version:${version} source:${source}`)

  const keystore = new Keystore(process.argv[2])

  let binary = firmwarePath ? fs.readFileSync(firmwarePath).toString() : undefined
  if (binary) {
    const passphrase = await keystore.passphraseOfPrivateKey()

    binary = crypt.decrypt(binary, passphrase)
  }

  return {
    statusCode: binary ? 200 : 404,
    body: {
      firmware: {
        version: version,
        data: binary ? binary : '',
        signature: binary ? (await signature(binary)).toString() : '',
        certificate: binary ? (await keystore.certificate()).toString() : '',
      }
    }
  }
}

function firmwareInfo(requestVersion) {
  const files = fs.readdirSync(path.join(__dirname, '../../firmware'))

  let fileName, version = 0

  if (requestVersion) {
    const filePath = path.join(__dirname, `../../firmware/firmware.enc.${requestVersion}`)

    return fs.existsSync(filePath) ? [requestVersion.toString(), filePath] : [requestVersion.toString(), undefined]
  } else {
    files.forEach(element => {
      const tokens = element.split('.')

      if (tokens[0] !== 'firmware') {
        return
      }

      const num = parseInt(tokens[2])
      if (num > version) {
        version = num
        fileName = element
      }
    })

    return [version.toString(), path.join(__dirname, '../../firmware/', fileName)]
  }
}

async function signature(data) {
  const keystore = new Keystore(process.argv[2])

  const sign = crypto.createSign('SHA256')

  sign.write(data)
  sign.end()

  const privateKey = crypto.createPrivateKey({
    key: await keystore.privateKey(),
    passphrase: await keystore.passphraseOfPrivateKey()
  })

  return sign.sign(privateKey, 'base64')
}