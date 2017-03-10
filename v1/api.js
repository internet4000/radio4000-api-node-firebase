var express = require('express');
var router = express.Router();
var {serializeChannel,
		 serializeTrack,
		 serializeImage} = require('./firebase/serializer.js');
var {apiGetImage,
		 apiGetTrack,
		 apiGetChannel,
		 apiGetChannelTracks,
		 apiGetChannels,
		 apiGetChannelsFiltered,
		 apiGet,
		 apiQuery} = require('./firebase/adapter.js');

function notAnEndpoint(req, res) {
  res.status(404).json({ message: 'Impossible to request this endpoint' });
};

function handleError(res) {
  return (e) => {
		console.log(e);
		res.status(404).json({ message: 'Data does not exist', error: e.message });
  };
}

function handleSuccess(res) {
  return (data) => res.json(data);
}

router.get('/', function (req, res) {
	res.redirect('/');
});

router.get('/channels', function (req, res) {
  // TODO: remove tracks in reponse (impossible at firebase query)
	var query = req.query;
	if (Object.keys(query).length) {
		apiGetChannelsFiltered(query).then(handleSuccess(res)).catch(handleError(res));
	} else {
		apiGetChannels().then(handleSuccess(res)).catch(handleError(res));
	}
});

router.get('/channels/:channelId', function (req, res) {
	apiGetChannel(req.params.channelId).then(handleSuccess(res)).catch(handleError(res));
});

router.get('/channels/:channelId/tracks', function (req, res) {
	apiGetChannelTracks(req.params.channelId).then(handleSuccess(res)).catch(handleError(res));
});

router.get('/tracks', notAnEndpoint);

router.get('/tracks/:trackId', function (req, res) {
  apiGetTrack(req.params.trackId).then(handleSuccess(res)).catch(handleError(res));
});

router.get('/images', notAnEndpoint);

router.get('/images/:imageId', function (req, res) {
	apiGetImage(req.params.imageId).then(handleSuccess(res)).catch(handleError(res));
});

module.exports = router;
