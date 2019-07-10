'use strict'

const fs = require('fs')
const path = require('path')

module.exports = class Keystore {
  constructor(module) {
    if (['server', 'gateway', 'device1', 'device2'].includes(module) === false) {
      throw new Error(`Invalid module name : ${module}`)
    }

    this.module = module
  }

  certificate() {
    return fs.readFileSync(path.join(__dirname, `../../cert/${this.module}/certificate.pem`))
  }

  certificateOfCa() {
    return fs.readFileSync(path.join(__dirname, `../../cert/ca/certificate.pem`))
  }

  privateKey() {
    return fs.readFileSync(path.join(__dirname, `../../cert/${this.module}/privatekey.pem`))
  }

  passphraseOfPrivateKey() {
    return this.module
  }

  peerCommonName() {
    switch (this.module) {
      case 'gateway':
        return '2jo-server'
      case 'device1':
        return '2jo-gateway'
      case 'device2':
        return '2jo-gateway'
      default:
        throw new Error(`Invalid module name : ${this.module}`)
    }
  }
}