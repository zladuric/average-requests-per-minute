/**
 * Module exports
 */

module.exports = averageRequestsPerMinute;

/**
 * Reponse time:
 *
 * Adds the `X-Response-Time` header displaying the response
 * duration in milliseconds.
 *
 * @param {object} options
 * @param {function} options.handler Handler to be called every `freq` requests.
 * @param {number} [options.inverval=60] Inverval in seconds
 * @return {function}
 * @api public
 */

function averageRequestsPerMinute(options) {

  var opts = options || {};

  var handler = options.handler;
  if (typeof handler !== 'function') {

    throw new Error('`handler` function is a mandatory parameter.');
  }
  var interval = options.interval || 60;

  if (isNaN(interval)) {

    throw new Error('`interval` should be a number.');
  }
  var _interval = interval * 1000;
  var queue = [];

  setInterval(function() {

    var time = new Date();
    time.setMilliseconds(time.getMilliseconds() - _interval)
    queue = queue.filter(function(date) {

      return date >= time;
    });

    handler(queue.length)
  }, _interval);

  return function requestsPerMinute(req, res, next) {

    queue.push(new Date());
    next();
  }
}
