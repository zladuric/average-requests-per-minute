# average-requests-per-minute

Quick-and-dirty avereage-reqs-per-min handler. I've based it on [Response time]
(https://www.npmjs.com/package/response-time).

This module returns a middleware that counts requests per minute (or other
interval). It triggers a handler every `interval` seconds.

Disclaimer: it's very simple, trivial, keeps things in memory, and does not
verify all the parameters. It is not tested well (yet), so use at your own
risk.

## Installation

```sh
$ npm install average-requests-per-minute
```

## API


### averageRequestsPerMinute(options)

Create a middleware that takes up to three parameters parameter, `handler`,
`inverval` and `freq`.

#### Options

The options object holds mandatory `handler` and optional `count` and `freq`
params.

##### handle

Handler is a simple function called every `inverval` seconds with `numRequests`.

##### inverval

`inverval` param (default `60`) in seconds represents interval to track.


## Examples

### express/connect

```js
let express = require('express');
let reqsPerMin = require('average-requests-per-minute');

let app = express();

app.use(reqsPerMin({

  handler: num => console.log(`Last minute there were ${num} requests.`)
}));

app.get('/',(req, res) => res.send('hello, world!'));
```

Or with a different interval:

```s
let middleware = require('average-requests-per-minute');

let app = express();

app.use(middleware({

  inverval: 600,
  handler: num => console.log(`There were ${num} requests in the last 10 minutes.`)
}));

app.use((req, res) => res.send('Hello world.'));
```

## TODO

- add tests for everything
- verify params


## License

[MIT](LICENSE)
