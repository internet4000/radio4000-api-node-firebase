const functions = require('firebase-functions')
const app = require('./src/app')

exports.api = functions.https.onRequest(app)
