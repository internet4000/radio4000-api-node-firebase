const fs = require('fs')

module.exports = function (slug, R4PlayerScriptUrl) {
	const path = process.cwd() + '/partials/embed.html'
	const buffer = fs.readFileSync(path)

	return buffer
		.toString()
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', R4PlayerScriptUrl)
}
