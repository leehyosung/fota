'use strict'

const config = require('./config')

config.apply()

const ret = config.get(process.argv[2], process.argv[3])

console.debug(`[PID:${process.pid}|PPID:${process.ppid}|UID:${process.getuid()}|KEY] ${process.argv[3]} ${ret}`)

process.send(ret)

process.exit(0)