const http = require('http')
const url = 'http://core-dns-sample-external.default.svc.cluster.local'

function start() {
  http.get(url, (res, req) => {
    let html = ''
    res.on('data', (chunk) => {
      html += chunk
    })
    console.log('GET ' + url + ':' + res.statusCode)
    console.log('HEADERS:' + JSON.stringify(res.headers))
    console.log('\n')
    setTimeout(start, 1000)
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
    setTimeout(start, 1000)
  })
}

start()
