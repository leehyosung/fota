'use strict'

module.exports = process

function process() {
  return {
    statusCode: 200,
    body: {
      returnCd: 200,
      returnMsg: 'success',
      version: '1.0.0'
    }
  }
}