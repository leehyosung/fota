'use strict'

const path = require('path')

const config = require('./config')


module.exports = class Keystore {
  constructor(service, async = false) {
    if (['server', 'gateway', 'device1', 'device2'].includes(service) === false) {
      throw new Error(`Invalid module name : ${service}`)
    }

    this.service = service
    this.async = async
  }

  async certificate() {
    return this.async ? this.__keyAsync('certificate') : config.get(this.service, 'certificate')
  }

  async certificateOfCa() {
    return this.async ? this.__keyAsync('certificateOfCa') : config.get(this.service, 'certificateOfCa')
  }

  async privateKey() {
    return this.async ? this.__keyAsync('privateKey') : config.get(this.service, 'privateKey')
  }

  async passphraseOfPrivateKey() {
    return this.async ? (await this.__keyAsync('passphraseOfPrivateKey')).toString() : config.get(this.service, 'passphraseOfPrivateKey')
  }

  async peerCommonName() {
    return this.async ? (await this.__keyAsync('peerCommonName')).toString() : config.get(this.service, 'peerCommonName')
  }

  __keyAsync(key) {
    return new Promise(resolve => {
      require('child_process').fork(path.join(__dirname, './keystoreExecutor.js'), [this.service, key])
        .on('message', message => {
          resolve(Buffer.from(message))
        })
    })
  }
}