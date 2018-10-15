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
  proxyRequest(res, 'http://my-external-service')
})

app.get('/hello', (req, res) => {
  console.log('Saying hello back!')
  res.write('Hello!')
  res.end()
})

app.listen(port, () => console.log(`Example app listening on host port ${port}!`))
