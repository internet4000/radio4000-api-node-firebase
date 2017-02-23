var convertHasMany = function (fromObject) {
	if (!fromObject) {
		return;
	}
	return Object.keys(fromObject);
}

function serializeChannel (channel, channelId) {
	channel.type = 'channel';
	channel.id = channelId;
	channel.tracks = convertHasMany(channel.tracks);
	channel.favoriteChannels = convertHasMany(channel.favoriteChannels);
	channel.images = convertHasMany(channel.images);
	return channel;
}

function serializeTrack (track ,trackId) {
	track.id = trackId;
	track.type = 'track';
	return track;
}

module.exports = {serializeChannel, serializeTrack};
