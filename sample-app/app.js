const http = require('http')
const url = 'core-dns-sample-external.default.svc.cluster.local'

function start() {
  http.get({
    hostname: url,
    port: 80,
    path: '/',
    agent: false  // create a new agent just for this one request
  }, (res, req) => {
    console.log('GET ' + url + ':' + res.statusCode)
    setTimeout(start, 1000)
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    setTimeout(start, 1000)
  })
}

start()
