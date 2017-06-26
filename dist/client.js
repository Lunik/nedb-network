'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(database, host, port, token) {
    _classCallCheck(this, Client);

    this.db = database;
    this.host = host;
    this.port = port;
    this.token = token;
  }

  _createClass(Client, [{
    key: 'find',
    value: function find(query, cb) {
      cb = cb || function () {};

      query['__database'] = this.db;
      _request2.default.get({
        url: 'http://' + this.host + ':' + this.port + '/api/find',
        headers: {
          Authorization: this.token
        },
        qs: query
      }, function (err, res, body) {
        if (err || res.statusCode === 403) {
          if (res && res.statusCode === 403) {
            console.error('Unauthorized 403');
            cb(null, []);
          } else {
            cb(err, []);
          }
        } else {
          try {
            body = JSON.parse(body);
            if (body.err) {
              cb(body.err, []);
            } else {
              cb(null, body.data);
            }
          } catch (err) {
            cb(err, []);
          }
        }
      });
    }
  }, {
    key: 'insert',
    value: function insert(data, cb) {
      cb = cb || function () {};

      data['__database'] = this.db;
      _request2.default.post({
        url: 'http://' + this.host + ':' + this.port + '/api/insert',
        headers: {
          Authorization: this.token
        },
        form: data
      }, function (err, res, body) {
        if (err || res.statusCode === 403) {
          if (res && res.statusCode === 403) {
            cb('Database request unauthorized 403');
          } else {
            cb(err);
          }
        } else {
          try {
            body = JSON.parse(body);
            if (body.err) {
              cb(body.err);
            } else {
              cb(null);
            }
          } catch (err) {
            cb(err);
          }
        }
      });
    }
  }, {
    key: 'update',
    value: function update(query, data, options, cb) {
      cb = cb || function () {};

      _request2.default.post({
        url: 'http://' + this.host + ':' + this.port + '/api/update',
        headers: {
          Authorization: this.token
        },
        form: {
          query: query,
          data: data,
          options: options,
          __database: this.db
        }
      }, function (err, res, body) {
        if (err || res.statusCode === 403) {
          if (res && res.statusCode === 403) {
            cb('Database request unauthorized 403');
          } else {
            cb(err);
          }
        } else {
          try {
            body = JSON.parse(body);
            if (body.err) {
              cb(body.err);
            } else {
              cb(null);
            }
          } catch (err) {
            cb(err);
          }
        }
      });
    }
  }, {
    key: 'remove',
    value: function remove(query, options, cb) {
      cb = cb || function () {};

      _request2.default.post({
        url: 'http://' + this.host + ':' + this.port + '/api/remove',
        headers: {
          Authorization: this.token
        },
        form: {
          query: query,
          options: options,
          __database: this.db
        }
      }, function (err, res, body) {
        if (err || res.statusCode === 403) {
          if (res && res.statusCode === 403) {
            cb('Database request unauthorized 403');
          } else {
            cb(err);
          }
        } else {
          try {
            body = JSON.parse(body);
            if (body.err) {
              cb(body.err);
            } else {
              cb(null);
            }
          } catch (err) {
            cb(err);
          }
        }
      });
    }
  }]);

  return Client;
}();

exports.default = Client;