const express = require('express')
const got = require('got')
const pkg = require('./package.json')
const { getIframe } = require('./utils/getIframe')
const { getOEmbed } = require('./utils/getOEmbed')


/*
 * start Express server
 * */

const app = express()


/*
 * Global variables +
 * set URL path for api, `embed.` + `api.` calls
 * when serving for `production` or `development` (localhost *)
 * */

let HTTPPrefix;
let R4ApiRoot;

const { RADIO4000_LOCAL,
				RADIO4000_DEV,
				RADIO4000_PROD } = process.env;

if(RADIO4000_LOCAL) {
	console.warn(`[+] api.radio400.com proxied: ${R4ApiRoot}`)
	R4ApiRoot = 'http://localhost:4001/v1'
	HTTPPrefix = 'http://'
} else if (RADIO4000_DEV && !RADIO4000_LOCAL)  {
	R4ApiRoot = 'https://api.radio4000.com/v1'
	HTTPPrefix = 'http://'
} else {
	R4ApiRoot = 'https://api.radio4000.com/v1'
	HTTPPrefix = 'https://'
}


/*
 * Create documentation
 * for existing enpoints, but wrong path
 * */

function notEndpointPath(req, res, usage = '') {
	const path = req.path;
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

	res.send(getIframe(slug))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	const embedApiRoot = HTTPPrefix + req.headers.host;

	// show usage if missing param
	if (!slug) {
		const usage = '?slug={radio4000-channel-slug}'
		return notEndpointPath(req, res, usage)
	}

	getChannelBySlug(slug).then(response => {
		const channel = JSON.parse(response.body)[0]

		console.log('channel', channel)
		if (!channel) return notEndpointPath(req, res)

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
		timeout: 4000,
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
