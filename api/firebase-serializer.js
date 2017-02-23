var {buildCloudinaryUrl} = require('./cloudinary-adapter.js');

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
	channel.images = convertHasMany(channel.images).map();
	return channel;
}

function serializeTrack (track ,trackId) {
	track.id = trackId;
	track.type = 'track';
	return track;
}

function serializeImage (image, imageId) {
	image.src = buildCloudinaryUrl(image.src);
	image.id = imageId;
	return image;
}

module.exports = {serializeChannel, serializeTrack, serializeImage};
