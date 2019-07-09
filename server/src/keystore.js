'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

module.exports.certificate = certificate
module.exports.certificateOfCa = certificateOfCa
module.exports.privateKey = privateKey
module.exports.passphraseOfPrivateKey = passphraseOfPrivateKey

function certificate() {
  return fs.readFileSync(path.join(__dirname, '../../cert/server/certificate.pem'))
}

function certificateOfCa() {
  return fs.readFileSync(path.join(__dirname, '../../cert/ca/certificate.pem'))
}

function privateKey() {
  return fs.readFileSync(path.join(__dirname, '../../cert/server/privatekey.pem'))
}

function passphraseOfPrivateKey() {
  return 'server'
}