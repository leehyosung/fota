const fs = require('fs')
const path = require('path')

const {
  encrypt,
  decrypt
} = require('../src/crypt')


const password = 'server'
const plain = fs.readFileSync(path.join(__dirname, `../../firmware/firmware.3`)).toString('base64')

console.log(plain)

let cipher = encrypt(plain, password)
// "YUG7d8Mf/f7RAXwUJdPIbg=="
console.log(cipher)
fs.writeFileSync(path.join(__dirname, `../../firmware/firmware.enc.3`), cipher)

cipher = fs.readFileSync(path.join(__dirname, `../../firmware/firmware.enc.3`)).toString()

const decrypted = decrypt(cipher, password)

console.log(decrypted)

console.log(plain === decrypted)