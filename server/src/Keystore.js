'use strict'

const config = require('./config')

module.exports = class Keystore {
  constructor(service) {
    if (['server', 'gateway', 'device1', 'device2'].includes(service) === false) {
      throw new Error(`Invalid module name : ${service}`)
    }

    this.service = service
    this.get = global.config.separateProcess ? config.getAsync : config.get
  }

  async certificate() {
    return this.get(this.service, 'certificate')
  }

  async certificateOfCa() {
    return this.get(this.service, 'certificateOfCa')
  }

  async privateKey() {
    return this.get(this.service, 'privateKey')
  }

  async passphraseOfPrivateKey() {
    return (await this.get(this.service, 'passphraseOfPrivateKey')).toString()
  }

  async peerCommonName() {
    return (await this.get(this.service, 'peerCommonName')).toString()
  }
}