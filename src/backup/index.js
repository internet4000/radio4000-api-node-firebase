const express = require('express')
const noEndpoint = require('../utils/no-endpoint')
const {createBackup} = require('radio4000-sdk')

const route = express.Router()

module.exports = route.get('/', (req, res) => {
	const slug = req.query.slug

	if (!slug) return noEndpoint(res)

	createBackup(slug)
		.then(backup => res.send(backup))
})

