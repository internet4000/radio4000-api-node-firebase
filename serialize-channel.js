var convertHasMany = function (fromObject) {
	return Object.keys(fromObject);
}

module.exports = function serializeChannel (channel, channelId) {
	channel.id = channelId;
	channel.tracks = convertHasMany(channel.tracks);
	channel.favoriteChannels = convertHasMany(channel.favoriteChannels);
	channel.images = convertHasMany(channel.images);
	return channel;
}
