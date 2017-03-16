require('dotenv').config();
var express = require('express');
var cors = require('cors');
var apiV1 = require('./v1/api.js');

var app = express();

app.use(cors());

app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the Radio4000 API.',
		documentationUrl: 'https://github.com/internet4000/radio4000-api-docs',
		latestVersion: 'v1'
	});
});

app.use('/v1', apiV1);

app.listen(3000, function () {
	console.log('[+] Set up app on port 3000');
});

module.exports = app;
