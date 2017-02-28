var firebase = require('firebase');
var {serializeChannel, serializeTrack, serializeImage} = require('./serializer.js');

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

var FILTERS = {
  "contains": (channel, val) => channel.indexOf(val) > -1,
	"icontains": (channel, val) => channel.toLowerCase().indexOf(val.toLowerCase()) > -1,
  "starts_with": (channel, val) => channel.startsWith(val),
}

function apiGetChannelsFiltered(filters) {
  var filterFun = function(filter, val) {
    return function(channel) {
      var query = filter.split(".");

      if (query.length == 1) {
        return channel[filter] == val;
      }

      if (query.length == 2) {
        var elem = channel[query[0]];

        if (!elem) {
          return false;
        }

        return FILTERS[query[1]](elem, val);
      }
      throw Error(`${filter} is not a valid filter.`);
    }
  }
  return apiGetChannels().then(channels =>
    Object.keys(filters).reduce(
      (channels, filter) => channels.filter(filterFun(filter, filters[filter])),
      channels)
  );
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
