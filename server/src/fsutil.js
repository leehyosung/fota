'use strict'

const fs = require('fs')
const path = require('path')

module.exports.rmdir = rmdir
module.exports.cpdir = cpdir
module.exports.chmoddir = chmoddir
module.exports.refreshDistDir = refreshDistDir

function rmdir(dir) {
  let list = fs.readdirSync(dir)

  for (let i = 0; i < list.length; i++) {
    let filename = path.join(dir, list[i])
    let stat = fs.statSync(filename)

    if (filename === '.' || filename === '..') {
      // DO NOTHING
    } else if (stat.isDirectory()) {
      rmdir(filename)
    } else {
      fs.unlinkSync(filename)
    }
  }

  fs.rmdirSync(dir)
}

function cpdir(src, dest, directoryNameToSkip = '') {
  let exists = fs.existsSync(src)
  let stats = exists && fs.statSync(src)
  let isDirectory = exists && stats.isDirectory()

  if (directoryNameToSkip !== '' && src.endsWith(directoryNameToSkip)) {
    return
  }

  if (exists && isDirectory) {
    fs.mkdirSync(dest)

    fs.readdirSync(src).forEach(childItemName => {
      cpdir(path.join(src, childItemName),
        path.join(dest, childItemName), directoryNameToSkip)
    })
  } else {
    fs.writeFileSync(dest, fs.readFileSync(src))
  }
}

function chmoddir(src) {
  let exists = fs.existsSync(src)

  fs.chmodSync(src, '777')

  let stats = exists && fs.statSync(src)
  let isDirectory = exists && stats.isDirectory()
  if (exists && isDirectory) {
    fs.readdirSync(src).forEach(function (childItemName) {
      chmoddir(path.join(src, childItemName))
    })
  }
}

function refreshDistDir() {
  let distPath = path.join(__dirname, '../../dist')

  if (fs.existsSync(distPath)) {
    rmdir(distPath)
  }

  fs.mkdirSync(distPath)
}