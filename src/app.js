const express = require('express')
const got = require('got')
const pkg = require('../package.json')
const getIframe = require('./utils/get-iframe')
const getOEmbed = require('./utils/get-oembed')


/*
 * start Express server
 * */

const app = express()


/*
 * Global variables +
 * set URL path for api, `embed.` + `api.` calls
 * when serving for `production` or `development` (localhost *)
 * */

const {NODE_ENV, PORT = 3000} = process.env

let R4PlayerScriptUrl = 'https://unpkg.com/radio4000-player'
let host = `http://localhost:${PORT}`
let R4ApiRoot = 'https://radio4000-staging.firebaseio.com/'

if (NODE_ENV === 'production') {
	host = `https://api.radio4000.com`
	R4ApiRoot = 'https://radio4000.firebaseio.com/'
}


/*
 * Create documentation
 * for existing enpoints, but wrong path
 * */

function notEndpointPath(req, res, usage = '') {
	res.status(404).json({
		message: 'NOT FOUND',
		usage: host + req.path + usage
	})
}


/*
 * Routes
 * */

app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the Radio4000 api',
		documentationUrl: pkg.homepage,
		iframeUrl: host + '/iframe',
		oembedUrl: host + '/oembed'
	})
})

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	const usage = `?slug={radio4000-channel-slug}`
	if (!slug) return notEndpointPath(req, res, usage)
	res.send(getIframe(slug, R4PlayerScriptUrl))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	const usage = '?slug={radio4000-channel-slug}'
	if (!slug) return notEndpointPath(req, res, usage)

	getChannelBySlug(slug).then(response => {
		const channels = JSON.parse(response.body)
		const id = Object.keys(channels)[0]
		let channel = channels[id]
		channel.id = id
		if (!channel) return notEndpointPath(req, res, usage)
		const embedHtml = getOEmbed(host, channel)
		res.send(embedHtml)
	}).catch(error => {
		res.status(500).send({
			'message': `Could not fetch channel from ${R4ApiRoot}`,
			'code': 500,
			'internalError': error
		})
	})
})

function getChannelBySlug(slug) {
	const url = `${R4ApiRoot}channels.json?orderBy="slug"&equalTo="${slug}"`
	return got(url, {
		timeout: 6000,
		retries: 1
	})
}


/*
 * Run server
 * */

app.listen(PORT, function () {
	console.log(`[+] running on port ${PORT}`);
})

module.exports = app
