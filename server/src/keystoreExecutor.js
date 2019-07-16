'use strict'

const config = require('./config')

config.apply()

const service = process.argv[2]
const key = process.argv[3]
const passphrase = process.argv[4]

// console.debug(`service : ${service} | key : ${key} | passphrase : ${passphrase}`)

let ret = config.get(service, key, passphrase)

// console.log(`ret : ${ret}`)

console.debug(`[PID:${process.pid}|PPID:${process.ppid}|UID:${process.getuid()}|KEY] ${key} ${ret}`)

process.send(ret)

process.exit(0)