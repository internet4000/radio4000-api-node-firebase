require('dotenv').config()

const express = require('express')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./utils/config')
const billings = require('./billings')
const embed = require('./embed')
const oembed = require('./oembed')


// Start Express server
const app = express()
app.use(cors())
app.use(bodyParser.json())


/*
	 If we want to run the server outside of firebase's function servers
	 we'll need a service account, to have the right authorization
	 to connect as admin to our firebase instance.

	 const serviceAccount = require("./serviceAccountKey.json")
	 admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://radio4000-staging.firebaseio.com"
	 });
*/

/*
	 When used on firebase servers, we just need to pull the config
	 and run the server that way:
	 $ firebase serve --only functions
	 source: https://firebase.google.com/docs/functions/local-emulator
*/

admin.initializeApp(functions.config().firebase);


// Routes
app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the Radio4000 api',
		documentationUrl: 'https://github.com/internet4000/radio4000-api',
		databaseUrl: config.databaseURL,
		apiUrl: config.apiURL,
		billingsUrl: config.apiURL + '/billings',
		embedUrl: config.apiURL + '/embed',
		oembedUrl: config.apiURL + '/oembed'
	})
})
app.use('/billings', billings)
app.use('/embed', embed)
app.use('/oembed', oembed)


// Run server
app.listen(config.port, function () {
	console.log(`Radio4000 API running on port ${config.port}`);
})

module.exports = app
