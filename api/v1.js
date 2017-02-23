var express = require('express');
var firebase = require('firebase');
var router = express.Router()
// var cloudinary = require('cloudinary');

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

var cloudinaryConfig = {
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};

firebase.initializeApp(firebaseConfig);

var notAnEndpoint = function (req, res) {
  res.status(500).json({ error: 'Impossible to request this endpoint' });
};

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
  var channels = firebase.database().ref('/channels');
  channels.once('value').then(snapshot => {
		res.json(snapshot.val());
  });
});

router.get('/channels/:channelSlug', function (req, res) {
  var ref = firebase.database().ref('channels');
  var slug = req.params.channelSlug;
  console.log( "slug", slug );
  ref.orderByChild('slug').equalTo(slug).once('value').then(snapshot => {
		res.send(snapshot.val());
  }).catch(() => {
		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  var ref = firebase.database().ref(`tracks/${req.params.trackId}`);
  ref.once('value').then(snapshot => {
		res.send(snapshot.val());
  }).catch(() => {
		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
  // TODO: make cloudinary request
  var ref = firebase.database().ref(`images/${req.params.imageId}`);
  ref.once('value').then(snapshot => {
		res.send(snapshot.val());
  }).catch(() => {
		res.status(500).json({ error: 'Data does not exist' });
  });
});

module.exports = router;
