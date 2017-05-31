const fs = require('fs')

exports.getIframe = (slug) => {
	const scriptUrl = 'https://rawgit.com/internet4000/radio4000-player-vue/master/dist/radio4000-player.min.js'

	var buffer = fs.readFileSync(process.cwd() + '/templates/embed.html')

	return buffer
		.toString()
		.replace('##CHANNEL_SLUG##', slug)
		.replace('##PLAYER_SCRIPT_URL##', scriptUrl)
}
