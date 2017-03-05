'use strict'

const r = require('rethinkdb')
const co = require('co')
const Promise = require('bluebird')

const defaults = {
  port: '28015',
  host: 'localhost',
  db: 'shabbatDb'
}

class Db {
  constructor (options) {
    options = options || {}
    this.port = options.port || defaults.port
    this.host = options.host || defaults.host
    this.db = options.db || defaults.db
  }

  // Connect Method
  connect (callback) {
    this.connection = r.connect({
      port: this.port,
      host: this.host
    })

    this.connected = true

    let db = this.db
    let connection = this.connection

    let setup = co.wrap(function * () {
      let conn = yield connection

      let dbList = yield r.dbList().run(conn)
      if (dbList.indexOf(db) === -1) {
        yield r.dbCreate(db).run(conn)
      }

      let tableList = yield r.db(db).tableList().run(conn)
      if (tableList.indexOf('customerData') === -1) {
        yield r.db(db).tableCreate('customerData').run(conn)
      }

      if (tableList.indexOf('products') === -1) {
        yield r.db(db).tableCreate('products').run(conn)
      }

      return conn
    })

    return Promise.resolve(setup()).asCallback(callback)
  }

  // Method disconnect
  disconnect (callback) {
    if (!this.connected) {
      return Promise.reject(new Error('Should by disconnected')).asCallback(callback)
    }

    this.connected = false
    Promise.resolve(this.connection).then(conn => conn.close())
  }

  // Method saveCustomer
  saveCustomer () {
  }
}

module.exports = Db
