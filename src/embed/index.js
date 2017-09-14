const express = require('express')
const config = require('../utils/config')
const noEndpoint = require('../utils/no-endpoint')
const getIframe = require('../utils/get-iframe')

const route = express.Router();

route.get('/', function (req, res) {
	const slug = req.query.slug
	const usage = `?slug={radio4000-channel-slug}`

	if (!slug) return noEndpoint(req, res, usage)

	res.send(getIframe(slug, config.playerScriptURL))
})

module.exports = route