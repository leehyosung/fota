const fs = require('fs')
const path = require('path')

const {
  encrypt,
  decrypt
} = require('../src/crypt')

const service = 'device1'
const password = 'U2FsdGVkX1/mlkh3PZxZh4vWZneN4LyUsfLUZEUPDQg='
// "U2FsdGVkX1/mlkh3PZxZh4vWZneN4LyUsfLUZEUPDQg="
// const plain = fs.readFileSync(path.join(__dirname, `../../cert/${service}/privatekey.pem`)).toString('utf8')

// console.log(plain)

const cipher = encrypt('device1', password)
// "YUG7d8Mf/f7RAXwUJdPIbg=="
console.log(cipher)

const decrypted = decrypt(cipher, password)

console.log(decrypted)