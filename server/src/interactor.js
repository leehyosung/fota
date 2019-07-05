'use strict'

const readline = require('readline')

module.exports = startConsole

async function startConsole(onInput) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('line', async input => {
      if (input.toLowerCase() === 'quit') {
        rl.close()
      } else {
        await onInput(input)
        rl.prompt()
      }
    })
    .on('close', () => {
      console.log('bye!')
      process.exit()
    })

  rl.prompt()
}