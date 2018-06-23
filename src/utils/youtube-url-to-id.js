const youtubeRegex = require('youtube-regex')

const youtubeUrlToId = function(url) {
	const results = youtubeRegex().exec(url);
	if (!results) {
		return false;
	}
	return results[1];
}

module.exports =  youtubeUrlToId
