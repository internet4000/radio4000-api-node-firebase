const express = require('express')
const got = require('got')
const pkg = require('./package.json')
const getIframe = require('./utils/getIframe')
const getOEmbed = require('./utils/getOEmbed')


/*
 * start Express server
 * */

const app = express()


/*
 * Global variables +
 * set URL path for api, `embed.` + `api.` calls
 * when serving for `production` or `development` (localhost *)
 * */

let HTTPPrefix
let R4ApiRoot

// default, overriden in RADIO4000_LOCAL
let R4PlayerScriptUrl = 'https://unpkg.com/radio4000-player'

const {
	RADIO4000_LOCAL,
	NODE_ENV
} = process.env

if(RADIO4000_LOCAL) {
	console.warn(`[+] api.radio400.com proxied: ${R4ApiRoot}`)
	R4ApiRoot = 'http://localhost:4001/v1'
	HTTPPrefix = 'http://'
	R4PlayerScriptUrl = 'http://localhost:5000/dist/radio4000-player.js'
} else if (NODE_ENV === 'production') {
	R4ApiRoot = 'https://api.radio4000.com/v1'
	HTTPPrefix = 'https://'
} else {
	// defaults to dev, with remote api.r4 (ofc local embed.r4)
	R4ApiRoot = 'https://api.radio4000.com/v1'
	HTTPPrefix = 'http://'
}


/*
 * Create documentation
 * for existing enpoints, but wrong path
 * */

function notEndpointPath(req, res, usage = '') {
	const path = req.path || '';
	const host = req.headers.host;

	const embedApiDynamicUrl = HTTPPrefix + host + path;
	res.status(404).json({
		message: 'NOT FOUND',
		usage: embedApiDynamicUrl + usage
	})
}


/*
 * Routes
 * */

app.get('/', function (req, res) {
	const host = req.headers.host;
	const url = HTTPPrefix + host;

	res.json({
		message: 'Welcome to the radio4000-embed-api.',
		documentationUrl: pkg.homepage,
		iframeUrl: url + '/iframe',
		oembedUrl: url + '/oembed'
	})
})

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	const usage = '?slug={radio4000-channel-slug}'

	if (!slug) return notEndpointPath(req, res, usage)

	res.send(getIframe(slug, R4PlayerScriptUrl))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	const embedApiRoot = HTTPPrefix + req.headers.host;
	const usage = '?slug={radio4000-channel-slug}'

	// show usage if missing param
	if (!slug) return notEndpointPath(req, res, usage)

	getChannelBySlug(slug).then(response => {
		const channel = JSON.parse(response.body)[0]

		if (!channel) return notEndpointPath(req, res, usage)

		const embedHtml = getOEmbed(embedApiRoot, channel)
		res.send(embedHtml)
	}).catch(error => {
		res.status(500).send({
			'message': 'Could not fetch api.radio4000.com',
			'code': 500,
			'internalError': error
		})
	})
})

function getChannelBySlug(slug) {
	// request api.radio4000.com
	const dataApiPath = `${R4ApiRoot}/channels?slug=${slug}`
	return got(dataApiPath, {
		timeout: 6000,
		retries: 1
	})
}


/*
 * Run server
 * */

app.listen(process.env.port || 4003, function () {
	console.log('[+] Set up app on port 4003');
})

module.exports = app
