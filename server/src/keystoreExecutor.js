'use strict'

const fs = require('fs')
const path = require('path')
const config = require('./config')

const ret = extract(process.argv[2], process.argv[3])

process.send(ret)
process.exit(0)

function extract(service, key) {
  return config.get(service, key)
}