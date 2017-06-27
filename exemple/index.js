/**
 * Created by lunik on 27/06/2017.
 */

var Database = require('../dist/index')

const Token = 'MON_TOKEN'

var server = new Database.Server(8080, Token, '/tmp')

var client = new Database.Client('ma_db', 'localhost', 8080, Token)

client.insert({
  id: 42,
  title: 'TITLE',
  somedata: 'Banana'
}, function (err) {
  console.log(err)
  client.find({
    id: 42
  }, function (err, obj) {
    console.log(obj)
    client.remove({
      id: 42
    }, {}, function (err) {
      console.log(err)
    })

  })
})