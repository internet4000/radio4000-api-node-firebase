var express = require('express');
var {serializeChannel, serializeTrack, serializeImage} = require('./firebase-serializer.js')
var {apiGetImage, apiGetTrack, apiGetChannel, apiGetChannelTracks, apiGetChannels, apiGet, apiQuery} = require('./firebase-adapter.js')
var router = express.Router();

function notAnEndpoint(req, res) {
  res.status(404).json({ message: 'Impossible to request this endpoint' });
};

function handleError(res) {
  return (e) => {
		console.log(e);
		res.status(404).json({ message: 'Data does not exist', error: e.message });
  };
}

router.get('/', function (req, res) {
	res.redirect('/');
});

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
	apiGetChannels().then(res.json).catch(handleErrpr(res));
});

router.get('/channels/:channelSlug', function (req, res) {
	apiGetChannel(req.params.channelSlug).then(res.json).catch(handleError(res));
});

router.get('/channels/:channelSlug/tracks', function (req, res) {
	apiGetChannelTracks(req.params.channelSlug).then(res.json).catch(handleError(res));
});

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  apiGetTrack(req.params.trackId).then(res.json).catch(handleError(res));
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
	apiGetImage(req.params.imageId).then(res.json).catch(handleError(res));
});

module.exports = router;
