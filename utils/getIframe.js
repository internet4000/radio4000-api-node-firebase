const fs = require('fs')

exports.getIframe = (slug) => {
	const { RADIO4000_LOCAL,
					RADIO4000_DEV,
					RADIO4000_PROD } = process.env;

	var scriptUrl;

		if (RADIO4000_LOCAL) {
			scriptUrl = 'http://localhost:5000/dist/radio4000-player.js'
		} else {
			scriptUrl = 'https://rawgit.com/internet4000/radio4000-player-vue/master/dist/radio4000-player.min.js'
		}

	var buffer = fs.readFileSync(process.cwd() + '/templates/embed.html')

	return buffer
		.toString()
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', scriptUrl)
}
