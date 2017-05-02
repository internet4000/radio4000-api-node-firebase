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
		.then(channel => {
			let c = channel.body
			// c = JSON.parse(channel)
			// console.log(c)
			res.send({
				test: c,
				'version': '1.0',
				'type': 'rich',
				'provider_name': 'Radio4000',
				'provider_url': 'https://radio4000.com.com/',
				'author_name': c.title,
				'author_url': `https://radio4000.com/${slug}/`,
				'title': c.title,
				'description': c.body,
				'thumbnail_url': `https://radio4000.com/apple-touch-icon.png`,
				'html': `<iframe width='320' height'400' src='https://oembed.radio4000.com/iframe?slug=${slug}'></iframe>`,
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
