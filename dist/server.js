'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nedb = require('nedb');

var _nedb2 = _interopRequireDefault(_nedb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseJSON(json) {
  json = JSON.stringify(json);
  return JSON.parse(json, function (k, v) {
    return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' || isNaN(v) || v === '' ? v : parseFloat(v, 10);
  });
}

var Server = function () {
  function Server(port, token) {
    var _this = this;

    _classCallCheck(this, Server);

    this.token = token;
    this.databases = {};

    this.app = (0, _express2.default)();
    this.app.use((0, _compression2.default)());

    this.app.use(_bodyParser2.default.urlencoded({
      extended: true
    }));

    this.app.listen(port, '127.0.0.1', function () {
      console.log('Database listening at port ' + port);
    });

    this.app.use(function (request, response, next) {
      if (request.headers.authorization === _this.token) {
        next();
      } else {
        response.status(403);
        response.end();
      }
    });

    this.app.get('/api/find', function (request, response) {
      var query = parseJSON(request.query);
      _this.loadDB(query.__database, function () {
        var db = query.__database;
        delete query.__database;

        _this.databases[db].find(query || {}, function (err, res) {
          response.end(JSON.stringify({
            err: err ? err.toString() : '',
            data: res
          }));
        });
      });
    });

    this.app.post('/api/insert', function (request, response) {
      var body = parseJSON(request.body);
      _this.loadDB(body.__database, function () {
        var db = body.__database;
        delete body.__database;

        _this.databases[db].insert(body || {}, function (err) {
          response.end(JSON.stringify({
            err: err ? err.toString() : ''
          }));
        });
      });
    });

    this.app.post('/api/update', function (request, response) {
      var body = parseJSON(request.body);
      _this.loadDB(body.__database, function () {
        var db = body.__database;
        delete body.__database;

        _this.databases[db].update(body.query || {}, body.data || {}, body.options || {}, function (err) {
          response.end(JSON.stringify({
            err: err ? err.toString() : ''
          }));
        });
      });
    });

    this.app.post('/api/remove', function (request, response) {
      var body = parseJSON(request.body);
      _this.loadDB(body.__database, function () {
        var db = body.__database;
        delete body.__database;

        _this.databases[db].remove(body.query || {}, body.options || {}, function (err) {
          response.end(JSON.stringify({
            err: err ? err.toString() : ''
          }));
        });
      });
    });
  }

  _createClass(Server, [{
    key: 'loadDB',
    value: function loadDB(db, cb) {
      if (this.databases[db] == null) {
        this.databases[db] = new _nedb2.default({ filename: 'data/' + db + '.db' });
        this.databases[db].loadDatabase(cb);
        this.databases[db].persistence.compactDatafile();
      } else {
        cb();
      }
    }
  }]);

  return Server;
}();

exports.default = Server;