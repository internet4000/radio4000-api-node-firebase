const config = require('../config')

module.exports = (req, res) => {
    res.json({
	message: 'Welcome to the Radio4000 api',
	documentationUrl: 'https://github.com/internet4000/radio4000-api',
	databaseUrl: config.databaseURL,
	channelsUrl: `${config.databaseURL}channels.json`,
	channelUrl: `${config.databaseURL}channels/{id}.json`,
	tracksUrl: `${config.databaseURL}tracks.json`,
	trackUrl: `${config.databaseURL}tracks/{id}.json`,
	channelEmbedUrl: `${config.apiURL}/embed?slug={slug}`,
	channelOEmbedUrl: `${config.apiURL}/oembed?slug={slug}`
    })
}
