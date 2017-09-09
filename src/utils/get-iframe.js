const fs = require('fs')

const html = `
	<!doctype html>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<body style="margin: 0">
	<style>
		html, body, radio4000-player {height: 100%;}
	</style>
	<radio4000-player slug="##CHANNEL_SLUG##" channel-slug="##CHANNEL_SLUG##"></radio4000-player>
	<script src="##PLAYER_SCRIPT_URL##" async></script>
`

module.exports = function (slug, R4PlayerScriptUrl) {
	if (!slug || !R4PlayerScriptUrl) {
		throw Error('missing slug or R4PlayerScriptUrl')
	}

	return html
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', R4PlayerScriptUrl)
}
