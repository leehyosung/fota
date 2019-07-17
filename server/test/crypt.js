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

// firmware.3 signature
// ZTrYyoozcSXJ4Q7AMf43+Bzz5VY5IM7ubHH6QwD9aknmoMJObYnCB4jFSVgo14L83dEyywBgOcFRWzjxphR52Ew6iQOE1nNsVr5gAyHIo+4A1f+5F1XWjWvez0WwMC3ggLspYjR7HuKoUiOKD9zxt1fZ938pDd6Rf01r+vbMDj/Isu85TCKZDhRw4QHp/YEExNvKkU9wjSZkna2AIKAMBK0lV7IGsx5bIi7sw3+Vv0Zp613kFDxHdA0PjOaEI5SvIYv9BYNseOsVNp3c0n1DInXqJle5LIsav87Lox/8uzpvNoNsy3vxt5Rfb9YdCYaaQe2LP75uDyDxyuqzvxWKVg==