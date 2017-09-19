const functions = require('firebase-functions')
const app = require('./src/app.js')

exports.api = functions.https.onRequest(app)
