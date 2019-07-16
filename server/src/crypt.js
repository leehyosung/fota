'use strict'

const crypto = require('crypto')

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt

function decrypt(ciphertext, passphrase) {
  const decipher = crypto.createDecipher('aes-256-cbc', passphrase)

  let result = decipher.update(ciphertext, 'base64', 'utf8')

  return result += decipher.final('utf8')
}

function encrypt(plaintext, passphrase) {
  const cipher = crypto.createCipher('aes-256-cbc', passphrase)

  let result = cipher.update(plaintext, 'utf8', 'base64')

  return result += cipher.final('base64')
}