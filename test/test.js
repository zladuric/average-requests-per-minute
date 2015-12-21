
var assert = require('assert');
var http = require('http');
var request = require('supertest');
var reqsPerMinute = require('..')

describe('reqsPerMinute()', function () {

  it('should call the function after `inverval=1` requests', function (done) {

    var server = createServer({

      handler: function(num) {

        assert.equal(typeof num, 'number');
        assert.equal(num, 2);
        done();
      },
      interval: 1
    });

    setTimeout(function() {

      request(server)
      .get('/')
      .end(function() {

        request(server)
        .get('/')
        .end(function() {

        });
      });
    }, 200);
  });

  it('should let old requests expire', function(done) {

    this.timeout(2400);
    var first;
    var server = createServer({

      handler: function(num) {

        assert.equal(typeof num, 'number');
        if (!first) {

          assert.equal(num, 1);
          first = true;
        } else {

          assert.equal(num, 2);
          done();
        }
      },
      interval: 1
    });

    // make one early request.
    setTimeout(function() {

      request(server)
      .get('/')
      .end(function() {

      });
    }, 200);
    // Make two later requests

    setTimeout(function() {

      request(server)
      .get('/')
      .end(function() {

        request(server)
        .get('/')
        .end(function() {

        });
      });
    }, 1200);
  });
})

function createServer(opts, fn) {
  var _reqs = reqsPerMinute(opts)
  return http.createServer(function (req, res) {
    _reqs(req, res, function (err) {
      setTimeout(function () {
        fn && fn(req, res)
        res.statusCode = err ? (err.status || 500) : 200
        res.end(err ? err.message : 'OK')
      }, 10)
    })
  })
}
