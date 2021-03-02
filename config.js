const {NODE_ENV} = process.env

let apiURL, // URL of this application
    databaseURL, // Firebase database URL
    stripePrivateKey,
    stripePublicKey

// CDN URL to the radio4000-player script
const playerScriptURL = 'https://cdn.jsdelivr.net/npm/radio4000-player@latest/dist/radio4000-player.min.js'

apiURL = 'http://localhost:4001'
databaseURL = 'https://radio4000-staging.firebaseio.com/'

if (NODE_ENV === 'production') {
    apiURL = 'https://api.radio4000.com'
    databaseURL = 'https://radio4000.firebaseio.com/'
}

module.exports = {
    apiURL,
    databaseURL,
    playerScriptURL
}
