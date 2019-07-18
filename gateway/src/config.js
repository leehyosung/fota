'use strict'

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keys = require('../../config/keys.json');
const crypt = require('./crypt');

module.exports.getAsync = async (service, key, passphrase) => {
  return new Promise((resolve, reject) => {
    try {
      const currentUserId = process.geteuid()

      process.seteuid(0)

      require('child_process').fork(path.join(__dirname, './keystoreExecutor.js'), [service, key, passphrase], {
          uid: global.config.keystoreUserId
        })
        .on('message', message => {
          resolve(Buffer.from(message))
        });

      process.seteuid(currentUserId)
    } catch (e) {
      reject(e)
    }
  })
};

module.exports.get = (service, key, passphrase) => {
  switch (key) {
    case 'certificate':
      return crypt.decrypt(fs.readFileSync(path.join(__dirname, `../../cert/${service}/certificate.pem.enc`)).toString('utf8'), passphrase);

    case 'privateKey':
      return crypt.decrypt(fs.readFileSync(path.join(__dirname, `../../cert/${service}/privatekey.pem.enc`)).toString('utf8'), passphrase);

    case 'certificateOfCa':
      return fs.readFileSync(path.join(__dirname, `../../cert/ca/certificate.pem`))

    case 'passphraseOfPrivateKey':
      return crypt.decrypt(keys[service]['passphraseOfPrivateKey'], passphrase)

    case 'peerCommonName':
      switch (service) {
        case 'gateway':
          return crypt.decrypt(keys['server']['commonName'], passphrase)
        case 'device':
          return crypt.decrypt(keys['gateway']['commonName'], passphrase)
        default:
          throw new Error(`Invalid service name : ${service}`)
      }
      break;

    default:
      throw new Error(`Invalid key name : ${key}`)
  }
};

module.exports.apply = () => {
  global.config = require('../config.json')[process.argv[2]];

  if (global.config.mode !== 'debug') {
    console.debug = () => {}
  }
};