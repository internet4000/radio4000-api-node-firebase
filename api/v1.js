var express = require('express');
var {serializeChannel, serializeTrack, serializeImage} = require('./firebase-serializer.js')
var {apiGet, apiQuery} = require('./firebase-adapter.js')
var router = express.Router();

var notAnEndpoint = function (req, res) {
  res.status(500).json({ error: 'Impossible to request this endpoint' });
};

router.get('/', function (req, res) {
	res.redirect('/');
});

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
  apiGet('channels').then(snapshot => {
		var val = snapshot.val();
		var channels = Object.keys(val).map(channelId => serializeChannel(val[channelId], channelId));
		res.json(channels);
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
	});
});

router.get('/channels/:channelSlug', function (req, res) {
	var slug = req.params.channelSlug;
	apiQuery('channels','slug', slug).then(snapshot => {
		var val = snapshot.val();
		var channelId = Object.keys(val)[0];
		var channel = val[channelId];
		res.send(serializeChannel(channel, channelId));
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
  });
});

// router.get('/channels/:channelSlug', function (req, res) {
// 	var slug = req.params.channelSlug;
// 	apiQuery('channels','slug', slug).then(snapshot => {
// 		var val = snapshot.val();
// 		var channelId = Object.keys(val)[0];
// 		var channel = val[channelId];
// 		res.send(serializeChannel(channel, channelId));
//   }).catch(e => {
// 		console.log( e );

// 		res.status(500).json({ error: 'Data does not exist' });
//   });
// });

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  apiGet(`tracks/${req.params.trackId}`).then(snapshot => {
		var track = snapshot.val();
		var trackId = Object.keys(track);
		res.send(serializeTrack(track, req.params.trackId));
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
  apiGet(`images/${req.params.imageId}`).then(snapshot => {
		var image = snapshot.val();
		res.send(serializeImage(image, req.params.imageId));
  }).catch(e => {
		console.log( e );

		res.status(500).json({ error: 'Data does not exist' });
  });
});

module.exports = router;
