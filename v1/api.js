var express = require('express');
var {serializeChannel, serializeTrack, serializeImage} = require('./firebase-serializer.js')
var {apiGetImage, apiGetTrack, apiGetChannel, apiGetChannelTracks, apiGetChannels, apiGet, apiQuery} = require('./firebase-adapter.js')
var router = express.Router();

var notAnEndpoint = function (req, res) {
  res.status(500).json({ error: 'Impossible to request this endpoint' });
};

router.get('/', function (req, res) {
	res.redirect('/');
});

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
	apiGetChannels().then(channels => {
		res.json(channels);
	}).catch(e => {
		console.log( e );
		res.status(500).json({ error: 'Data does not exist' });
	});
});

router.get('/channels/:channelSlug', function (req, res) {
	apiGetChannel(req.params.channelSlug).then(channel => {
		res.json(channel);
	}).catch(e => {
		console.log( e );
		res.status(500).json({
			message: 'Data does not exist',
			error: e.message
		});
	});
});

router.get('/channels/:channelSlug/tracks', function (req, res) {
	apiGetChannelTracks(req.params.channelSlug).then(tracks => {
		res.json(tracks);
	}).catch(e => {
		console.log( e );
		res.status(500).json({ error: 'Data does not exist' });
  });
});

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  apiGetTrack(req.params.trackId).then(track => res.json(track))
		.catch(e => {
			console.log( e );
			res.status(500).json({ error: 'Data does not exist' });
		});
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
	apiGetImage(req.params.imageId).then(image => res.json(image)).catch(e => {
		console.log( e );
		res.status(500).json({ error: 'Data does not exist' });
  });
});

module.exports = router;
