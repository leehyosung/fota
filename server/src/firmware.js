'use strict'

module.exports = process

function process(ver) {
  return {
    statusCode: 200,
    body: {
      returnCd: 200,
      returnMsg: 'success',
      firmware: {
        version: ver,
        data: 'awefawefxdfbawerfawef'
      }
    }
  }
}