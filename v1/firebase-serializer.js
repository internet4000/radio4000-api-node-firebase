var {buildCloudinaryUrl} = require('./cloudinary-adapter.js');

function convertHasMany(fromObject) {
	if (!fromObject) return;
	return Object.keys(fromObject);
}

function serializeChannel (channel, channelId) {
	if (!channel) return;
	channel.type = 'channel';
	channel.id = channelId;
	channel.tracks = convertHasMany(channel.tracks);
	channel.favoriteChannels = convertHasMany(channel.favoriteChannels);
	// var images = Object.keys(channel.images || {});
	// channel.image = buildCloudinaryUrl(images[images.length -1]);
	// delete channel.images;
	return channel;
}

function serializeTrack (track ,trackId) {
	if (!track) return;
	track.id = trackId;
	track.type = 'track';
	return track;
}

function serializeImage (image, imageId) {
	if (!image) return;
	image.src = buildCloudinaryUrl(image.src);
	image.id = imageId;
	return image;
}

module.exports = {serializeChannel, serializeTrack, serializeImage};
