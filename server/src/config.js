'use strict'

const fs = require('fs')
const path = require('path')
const keys = require('../../config/keys.json')
const crypto = require('crypto')

module.exports.getAsync = async (service, key) => {
  return new Promise((resolve, reject) => {
    try {
      const currentUserId = process.geteuid()

      process.seteuid(0)

      require('child_process').fork(path.join(__dirname, './keystoreExecutor.js'), [service, key], { uid: global.config.keystoreUserId })
        .on('message', message => {
          resolve(Buffer.from(message))
        })

      process.seteuid(currentUserId)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.get = (service, key) => {
  switch (key) {
    case 'certificate':
      return fs.readFileSync(path.join(__dirname, `../../cert/${service}/certificate.pem`))

    case 'privateKey':
      return fs.readFileSync(path.join(__dirname, `../../cert/${service}/privatekey.pem`))

    case 'certificateOfCa':
      return fs.readFileSync(path.join(__dirname, `../../cert/ca/certificate.pem`))

    case 'passphraseOfPrivateKey':
      return keys.passphrase[service]

    case 'peerCommonName':
      switch (service) {
        case 'gateway':
          return keys.cn['server']
        case 'device1':
          return keys.cn['gateway']
        case 'device2':
          return keys.cn['gateway']
        default:
          throw new Error(`Invalid service name : ${service}`)
      }
      break

    default:
      throw new Error(`Invalid key name : ${key}`)
  }
}

module.exports.apply = () => {
  global.config = require('../config.json')

  if (global.config.mode !== 'debug') {
    console.debug = () => {}
  }
}