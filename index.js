require('dotenv').config();
var express = require('express');
// var is = require('type-is');
var app = express();
var apiV1 = require('./v1/api.js');

// app.use(function(req, res, next) {
// 	var hasAnyMediaType = is.is(mediaType, ['*']);
// 	var hasAcceptHeader = req.get('Accept');

// 	if (hasAnyMediaType) {
// 		// 415 Unsupported Media Type, if any media type in request
// 		res.status(415);
// 	} else if (hasAcceptHeader) {
// 		// 406 Not Acceptable
// 		res.status(406);
// 	}

//   res.set('Content-Type', 'application/vnd.api+json');
//   next();
// });

app.get('/', function (req, res) {
  res.json({
		"message": "Welcome to the Radio4000 API.",
		"documentationUrl": "https://github.com/internet4000/radio4000-api-docs",
		"latest": "v1"
  });
});

app.use('/v1', apiV1);

app.listen(3000, function () {
  console.log('[+] Set up app on Port 3000!');
});
