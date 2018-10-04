const http = require('http')
const url = 'http://my-external-service'

function start() {
  http.get(url, (res, req) => {
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
