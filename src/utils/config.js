// Global config that respects the node environment
const functions = require('firebase-functions');

const {NODE_ENV, PORT = 3000} = process.env

// The URL of this application
let apiURL = `http://localhost:${PORT}`

// The Firebase database URL
let databaseURL = 'https://radio4000-staging.firebaseio.com/'

// The CDN URL to the radio4000-player script
const playerScriptURL = 'https://unpkg.com/radio4000-player'

// stripe
let stripeSecretKey = functions.config().stripe.secret_key;
let stripePublicKey = functions.config().stripe.public_key;

if (NODE_ENV === 'production') {
	apiURL = `https://api.radio4000.com`
	databaseURL = 'https://radio4000.firebaseio.com/'
	stripeSecretKey = functions.config().stripe_production.secret_key;
	stripePublicKey = functions.config().stripe_production.public_key;
}

module.exports = {
	apiURL,
	databaseURL,
	playerScriptURL,
	port: PORT,
	stripeSecretKey,
	stripePublicKey
}
