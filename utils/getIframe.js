const fs = require('fs')

exports.getIframe = (slug, R4PlayerScriptUrl) => {

	var buffer = fs.readFileSync(process.cwd() + '/templates/embed.html')

	return buffer
		.toString()
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', R4PlayerScriptUrl)
}
