var firebase = require('firebase');
var {serializeChannel, serializeTrack, serializeImage} = require('./firebase-serializer.js');

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

function apiGetImage(imageId) {
	return apiGet(`images/${imageId}`).then(snapshot => {
		var image = snapshot.val();
		return serializeImage(image, imageId);
  })
}

function apiGetTrack(trackId) {
	return apiGet(`tracks/${trackId}`).then(snapshot => {
		var track = snapshot.val();
		return serializeTrack(track, trackId);
  })
}

// channel slug or id?
function apiGetChannel(channelSlug) {
	return apiQuery('channels','slug', channelSlug).then(snapshot => {
		var val = snapshot.val();
		var channelId = Object.keys(val)[0];
		var channel = val[channelId];
		return serializeChannel(channel, channelId);
  }).catch(e => {
		console.log("apigGetChannel error", e);
  });
}

function apiGetChannelTracks(channelSlug) {
	return apiGetChannel(channelSlug).then(channel => {
		return apiQuery('tracks', 'channel', channel.id).then(snapshot => {
			var tracks = snapshot.val();
			var serializedTracks = Object.keys(tracks).map(trackId => serializeTrack(tracks[trackId], trackId));
			return serializedTracks;
		});
	});
};

function apiGetChannels() {
  return apiGet('channels').then(snapshot => {
		var val = snapshot.val();
		var channels = Object.keys(val).map(channelId => serializeChannel(val[channelId], channelId));
		return channels;
  })
}

function apiGetChannelsFiltered(filters) {
	var filter = Object.keys(filters)[0];
	var search = filters[filter];
  return apiQuery('channels', filter, search).then(snapshot => {
		var val = snapshot.val();
		var channels = Object.keys(val).map(channelId => serializeChannel(val[channelId], channelId));
		return channels;
  })
}

module.exports = {
	apiGet,
	apiQuery,
	apiGetImage,
	apiGetTrack,
	apiGetChannel,
	apiGetChannels,
	apiGetChannelTracks,
	apiGetChannelsFiltered
};
