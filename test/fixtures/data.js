'use strict'

const uuid = require('uuid-base62')

const data = {
  getCustomer () {
    return {
      name: 'a random name',
      email: `foo@${uuid.v4()}.com`,
      phone: `${uuid.v4()}`,
      payment_sources: [{
        type: 'card',
        toke_id: `token_id_${uuid.v4()}`
      }]
    }
  }
}

module.exports = data
