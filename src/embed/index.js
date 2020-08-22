const express = require('express')
const createDOMPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const config = require('../config')
const noEndpoint = require('../utils/no-endpoint')
const getIframe = require('../utils/get-iframe')

const route = express.Router()

// Prepare stuff for XSS
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

route.get('/', function(req, res) {
	const slug = req.query.slug

	if (!slug) return noEndpoint(res)

	// Prevent XSS
	const safeSlug = DOMPurify.sanitize(slug)
	res.send(getIframe(safeSlug, config.playerScriptURL))
})

module.exports = route
