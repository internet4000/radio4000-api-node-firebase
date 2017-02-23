var express = require('express');
var firebase = require('firebase');
var {serializeChannel, serializeTrack} = require('./firebase-serializer.js')
var router = express.Router();
// var cloudinary = require('cloudinary');

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

firebase.initializeApp(firebaseConfig);

var notAnEndpoint = function (req, res) {
  res.status(500).json({ error: 'Impossible to request this endpoint' });
};

router.get('/', function (req, res) {
	res.redirect('/');
});

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
  var channels = firebase.database().ref('/channels');
  channels.once('value').then(snapshot => {
		var val = snapshot.val();
		var channels = Object.keys(val).map(channelId => serializeChannel(val[channelId], channelId));
		res.json(channels);
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
	});
});

router.get('/channels/:channelSlug', function (req, res) {
  var ref = firebase.database().ref('channels');
  var slug = req.params.channelSlug;
  ref.orderByChild('slug').equalTo(slug).once('value').then(snapshot => {
		var val = snapshot.val();
		var channelId = Object.keys(val)[0];
		var channel = val[channelId];
		res.send(serializeChannel(channel, channelId));
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  var ref = firebase.database().ref(`tracks/${req.params.trackId}`);
  ref.once('value').then(snapshot => {
		var track = snapshot.val();
		var trackId = Object.keys(track);
		res.send(serializeTrack(track, req.params.trackId));
  }).catch(() => {
		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
  // TODO: make cloudinary request
	var rootUrl = 'https://res.cloudinary.com/radio4000/image/upload/q_50,w_200,h_200,c_thumb,c_fill,fl_lossy/';
  var ref = firebase.database().ref(`images/${req.params.imageId}`);
  ref.once('value').then(snapshot => {
		var image = snapshot.val();
		let src = image.src;
		let newSrc = `${rootUrl}${src}`;
		image.src = newSrc;
		res.send(image);
  }).catch(() => {
		res.status(500).json({ error: 'Data does not exist' });
  });
});

module.exports = router;
