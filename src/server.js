'use strict'

import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import Datastore from 'nedb'

function parseJSON (json) {
  json = JSON.stringify(json)
  return JSON.parse(json, function (k, v) {
    return (typeof v === 'object' || isNaN(v) || v === '') ? v : parseFloat(v, 10)
  })
}

export default class Server {
  constructor (port, token) {
    this.token = token
    this.databases = {}

    this.app = express()
    this.app.use(compression())

    this.app.use(bodyParser.urlencoded({
      extended: true
    }))

    this.app.listen(port, '127.0.0.1', () => {
      console.log(`Database listening at port ${port}`)
    })

    this.app.use((request, response, next) => {
      if (request.headers.authorization === this.token) {
        next()
      } else {
        response.status(403)
        response.end()
      }
    })

    this.app.get('/api/find', (request, response) => {
      var query = parseJSON(request.query)
      this.loadDB(query.__database, () => {
        var db = query.__database
        delete query.__database

        this.databases[db].find(query || {}, (err, res) => {
          response.end(JSON.stringify({
            err: err ? err.toString() : '',
            data: res
          }))
        })
      })
    })

    this.app.post('/api/insert', (request, response) => {
      var body = parseJSON(request.body)
      this.loadDB(body.__database, () => {
        var db = body.__database
        delete body.__database

        this.databases[db].insert(body || {}, (err) => {
          response.end(JSON.stringify({
            err: err ? err.toString() : ''
          }))
        })
      })
    })

    this.app.post('/api/update', (request, response) => {
      var body = parseJSON(request.body)
      this.loadDB(body.__database, () => {
        var db = body.__database
        delete body.__database

        this.databases[db].update(body.query || {},
          body.data || {},
          body.options || {}, (err) => {
            response.end(JSON.stringify({
              err: err ? err.toString() : ''
            }))
          })
      })
    })

    this.app.post('/api/remove', (request, response) => {
      var body = parseJSON(request.body)
      this.loadDB(body.__database, () => {
        var db = body.__database
        delete body.__database

        this.databases[db].remove(body.query || {},
          body.options || {}, (err) => {
            response.end(JSON.stringify({
              err: err ? err.toString() : ''
            }))
          })
      })
    })
  }

  loadDB (db, cb) {
    if (this.databases[db] == null) {
      this.databases[db] = new Datastore({ filename: `data/${db}.db` })
      this.databases[db].loadDatabase(cb)
      this.databases[db].persistence.compactDatafile()
    } else {
      cb()
    }
  }
}
