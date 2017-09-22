// Global config that respects the node environment
const functions = require('firebase-functions')

const {NODE_ENV} = process.env

let apiURL, // URL of this application
	databaseURL, // Firebase database URL
	stripePrivateKey,
	stripePublicKey

// CDN URL to the radio4000-player script
const playerScriptURL = 'https://unpkg.com/radio4000-player'

apiURL = 'http://localhost:4001/radio4000-staging/us-central1/api'
databaseURL = 'https://radio4000-staging.firebaseio.com/'
stripePrivateKey = functions.config().stripe.private_key
stripePublicKey = functions.config().stripe.public_key

if (NODE_ENV === 'production') {
	apiURL = 'https://api.radio4000.com'
	databaseURL = 'https://radio4000.firebaseio.com/'
	stripePrivateKey = functions.config().stripe.production_private_key
	stripePublicKey = functions.config().stripe.production_public_key
}

module.exports = {
	apiURL,
	databaseURL,
	playerScriptURL,
	stripePrivateKey,
	stripePublicKey
}
