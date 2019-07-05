'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

module.exports = process

function process(ver) {
  const firmware = getFirmware()

  return {
    statusCode: 200,
    body: {
      returnCd: 200,
      returnMsg: 'success',
      firmware: {
        ...getFirmware()
      }
    }
  }
}

function getFirmware() {
  let binary = fs.readFileSync(path.join(__dirname, '../../firmware/firmware.v1'))

  return {
    version: '1',
    data: binary.toString('base64'),
    hash: crypto.createHash('sha256').update(binary).digest('base64'),
  }
}