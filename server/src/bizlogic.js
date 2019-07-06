'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

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

function firmware(requestVersion) {
  const [, firmwarePath] = firmwareInfo(requestVersion)

  let binary = firmwarePath ? fs.readFileSync(firmwarePath) : undefined

  return {
    statusCode: binary ? 200 : 404,
    body: {
      firmware: {
        version: requestVersion,
        data: binary ? binary.toString('base64') : '',
        hash: binary ? crypto.createHash('sha256').update(binary).digest('base64') : '',
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