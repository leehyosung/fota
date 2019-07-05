'use strict'

const readline = require('readline')

module.exports = startConsole

function startConsole(onInput) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('line', input => input.toLowerCase() === 'quit' ? rl.close() : onInput(input))
    .on('close', () => {
      console.log('bye!')
      process.exit()
    })
}