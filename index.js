const fs = require('fs')
const path = require('path')
const express = require('express')
const got = require('got')

const app = express()

function getIframe(slug) {
	var buffer = fs.readFileSync(process.cwd() + '/embed.html')
	return buffer
		.toString()
		.replace('SLUGMENOT', slug)
}

function notAnEndpoint(req, res) {
	res.status(404).json({message: 'NOT FOUND'})
}

app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the radio4000-embed-api.',
		documentationUrl: 'https://github.com/Internet4000/radio4000-embed-api'
	})
})

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	if (!slug) return notAnEndpoint(req, res)
	res.send(getIframe(slug))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	if (!slug) return notAnEndpoint(req, res)
	const url = `https://api.radio4000.com/v1/channels?slug=${slug}`
	return got(url)
		.then(response => {
			const channel = JSON.parse(response.body)[0]
			if (!channel) return notAnEndpoint(req, res)
			console.log(req.headers.host)
			res.send({
				'version': '1.0',
				'type': 'rich',
				'provider_name': 'Radio4000',
				'provider_url': 'https://radio4000.com/',
				'author_name': channel.title,
				'author_url': `https://radio4000.com/${slug}/`,
				'title': channel.title,
				'description': channel.body,
				'thumbnail_url': `https://radio4000.com/apple-touch-icon.png`,
				'html': `<iframe width="320" height="400" src="//${req.headers.host}/iframe?slug=${slug}"></iframe>`,
				'width': 320,
				'height': 400
			})
		})
		.catch(next)
})

app.listen(process.env.port || 3000, function () {
	console.log('[+] Set up app on port 3000');
})

module.exports = app
