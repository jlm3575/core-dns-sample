const request = require('request');
const express = require('express')
const app = express()
const port = 3000

function proxyRequest(res, url) {
  let responseBody
  request(url, function (error, response, body) {
    if (error) {
      console.log(error)
      responseBody = 'An unexpected error occured fetching ' + url + '. Check logs for details.'
    } else {
      console.log('Successfully fetched ' + url + ' with status: ', response.statusCode);
      responseBody = body
    }

    res.write(responseBody)
    res.end()
  })
}

app.get('/', (req, res) => {
  proxyRequest(res, 'http://affinipay.com')
})

app.get('/hello', (req, res) => {
  console.log('Saying hello back!')
  res.write('Hello!')
  res.end()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// function start() {
//   http.get(url, (res, req) => {
//     console.log('GET ' + url + ':' + res.statusCode)
//     console.log('HEADERS:' + JSON.stringify(res.headers))
//     console.log('\n')
//     setTimeout(start, 1000)
//   }).on('error', (e) => {
//     console.error(`Got error: ${e.message}`)
//     setTimeout(start, 1000)
//   })
// }
//
// start()


//   const creq = http.request(options || {}, function(cres) {
//     cres.setEncoding('utf8');
//     cres.on('data', function(chunk){
//       res.write(chunk);
//     });
//
//     cres.on('close', function(){
//       res.end();
//     });
//
//     cres.on('end', function(){
//       res.end();
//     });
//
//   }).on('error', function(e) {
//     console.log(e.message);
//     res.end();
//   });
//
//   creq.end();
// }

// function fetchExternalUrl () {
//
//   // http.get('https://www.neworleanssants.com', (res, req) => {
//   //   console.log('GET ' + url + ':' + res.statusCode)
//   //   console.log('HEADERS:' + JSON.stringify(res.headers))
//   //   console.log('\n')
//   //   setTimeout(start, 1000)
//   // }).on('error', (e) => {
//   //   console.error(`Got error: ${e.message}`)
//   //   setTimeout(start, 1000)
//   // })
// }
