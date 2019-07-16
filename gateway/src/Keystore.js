'use strict'

const config = require('./config')

module.exports = class Keystore {
  constructor(service) {
    if (['server', 'gateway', 'device', 'device'].includes(service) === false) {
      throw new Error(`Invalid module name : ${service}`)
    }

    this.service = service;
    this.get = global.config.separateProcess ? config.getAsync : config.get;
  }

  async certificate() {
    return this.get(this.service, 'certificate', global.config.keystorePassword)
  }

  async certificateOfCa() {
    return this.get(this.service, 'certificateOfCa', global.config.keystorePassword)
  }

  async privateKey() {
    return this.get(this.service, 'privateKey', global.config.keystorePassword)
  }

  async passphraseOfPrivateKey() {
    return (await this.get(this.service, 'passphraseOfPrivateKey', global.config.keystorePassword)).toString()
  }

  async peerCommonName() {
    return (await this.get(this.service, 'peerCommonName', global.config.keystorePassword)).toString()
  }
}