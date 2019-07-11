'use strict'

const config = require('./config')


module.exports = class Keystore {
  constructor(service, async = false) {
    if (['server', 'gateway', 'device1', 'device2'].includes(service) === false) {
      throw new Error(`Invalid module name : ${service}`)
    }

    this.async = async
    this.get = this.async ? config.getAsync : config.get
    this.service = service
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