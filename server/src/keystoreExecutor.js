'use strict'

const config = require('./config')

process.send(config.get(process.argv[2], process.argv[3]))

process.exit(0)