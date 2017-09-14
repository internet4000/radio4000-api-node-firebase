const fs = require('fs')
const config = require('./config')

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

module.exports = function (slug) {
	if (!slug || !config.playerScriptURL) {
		throw Error('missing slug or playerScriptURL')
	}

	return html
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', config.playerScriptURL)
}
