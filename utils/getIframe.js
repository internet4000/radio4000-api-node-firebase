const fs = require('fs')

export default function (slug, R4PlayerScriptUrl) {
	const path = process.cwd() + '/templates/embed.html'
	const buffer = fs.readFileSync()

	return buffer
		.toString()
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', R4PlayerScriptUrl)
}
