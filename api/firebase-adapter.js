var firebase = require('firebase');

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

firebase.initializeApp(firebaseConfig);

function apiGet(endpoint) {
	return (
		firebase.database().ref(endpoint)
			.once('value')
	)
}

function apiQuery(endpoint, prop, query) {
	return (
		firebase.database().ref(endpoint)
			.orderByChild(prop).equalTo(query)
			.once('value')
	)
}

module.exports = {apiGet, apiQuery};
