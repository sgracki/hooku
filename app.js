const express = require('express')
const app = express()

app.get('/test', function (req, res) {
  res.send('test')
})

app.get('/', function(req, res) {
    console.log("xdd");
    res.send("hello dud");
})

app.post('/webhook', () => {
    console.log("xdd");
    res.sendStatus(200)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})