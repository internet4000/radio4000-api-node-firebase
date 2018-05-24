const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const functions = require('firebase-functions')

const config = require('./config')
const billings = require('./billings')
const embed = require('./embed')
const oembed = require('./oembed')
const backup = require('./backup')

/* Start Express server */
const app = express()
app.use(cors())
app.use(bodyParser.json())

/* Routes */
app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the Radio4000 api',
		documentationUrl: 'https://github.com/internet4000/radio4000-api',
		databaseUrl: config.databaseURL
	})
})
app.use('/billings', billings)
app.use('/embed', embed)
app.use('/oembed', oembed)
app.use('/backup', backup)

module.exports = app
