const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const fixtures = require('./fixtures')

const dbName = `Shabbat_${uuid.v4()}`
const db = new Db({db: dbName})

// ----------------- Test´s Hook´s---------------- //

test.before('connect db', async t => {
  await db.connect()
  t.true(db.connected, 'Should by connected')
})

test.after('Drop a database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test.after.always('Disconnect from database', async t => {
  await db.disconnect()
  t.false(db.connected)
})

// --------------------- Test´s -------------------- //

test('Should by a second test', async t => {
  let customer = fixtures.getCustomer()
  t.is(typeof db.saveCustomer, 'function', 'should by a function')
  let result = await db.saveCustomer(customer)

  t.is(result.name, customer.name)
  t.is(result.email, customer.email)
  t.is(result.phone, customer.phone)
  t.deepEqual(result.payment_sources, customer.payment_sources)
})
