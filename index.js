const functions = require('firebase-functions')
const app = require('./src/app')
const onTrackUrlChange = require('./src/on-track-url-change')

// Public API for Radio4000
exports.api = functions.https.onRequest(app)

// Listen to every track change
exports.onTrackUrlChange =
	functions.database.ref('/tracks/{trackId}/url')
	.onWrite(onTrackUrlChange)
