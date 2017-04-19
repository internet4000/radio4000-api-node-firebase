const fs = require('fs')
const express = require('express')
var app = express()
var path = require('path')

function getIframe(slug) {
	var buffer = fs.readFileSync(process.cwd() + '/embed.html')
	return buffer
		.toString()
		.replace('SLUGMENOT', slug)
}

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	if (!slug) return res.send(666, 'nop')
	res.send(getIframe(slug))
})

app.get('/oembed', (req, res) => {
	const slug = req.query.slug
	if (!slug) return res.send(666, 'nop')
	const iframeHTML = `<iframe width="320" height"400" src="https://oembed.radio4000.com/iframe?slug=${slug}"></iframe>`
	res.send({
		"version": "1.0",
		"type": "rich",
		"provider_name": "Radio4000",
		"provider_url": "https://radio4000.com.com/",
		"author_name": "Radio Yes!",
		"author_url": "https://radio4000.com/radio-yes/",
		"title": "Radio Yes!",
		"description": "Filled with good, jazzy songs",
		"thumbnail_url": "https://radio4000.com/apple-touch-icon.png",
		"html": iframeHTML,
		"width": 320,
		"height": 400
	})
})

app.listen(3000, function () {})

module.exports = app