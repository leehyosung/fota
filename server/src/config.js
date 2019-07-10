'use strict'

const fs = require('fs')
const path = require('path')

module.exports.get = (service, key) => {
  switch (key) {
    case 'certificate':
      return fs.readFileSync(path.join(__dirname, `../../cert/${service}/certificate.pem`))

    case 'privateKey':
      return fs.readFileSync(path.join(__dirname, `../../cert/${service}/privatekey.pem`))

    case 'certificateOfCa':
      return fs.readFileSync(path.join(__dirname, `../../cert/ca/certificate.pem`))

    case 'passphraseOfPrivateKey':
      return service

    case 'peerCommonName':
      switch (service) {
        case 'gateway':
          return '2jo-server'
        case 'device1':
          return '2jo-gateway'
        case 'device2':
          return '2jo-gateway'
        default:
          throw new Error(`Invalid service name : ${service}`)
      }
      break

    default:
      throw new Error(`Invalid key name : ${key}`)
  }
}