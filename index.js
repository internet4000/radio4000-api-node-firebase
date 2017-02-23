require('dotenv').config();
var express = require('express');
var app = express();
var apiV1 = require('./api/v1.js');


app.get('/', function (req, res) {
    // TODO: send some doczz
    res.json({
	"documentationUrl": "https://github.com/internet4000/radio4000-api-docs",
	"hello": "Welcome to the Radio4000 API."
    });
});

app.use('/api/v1', apiV1);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
