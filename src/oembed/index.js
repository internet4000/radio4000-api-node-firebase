const express = require('express')
const got = require('got')
const config = require('../config')
const noEndpoint = require('../utils/no-endpoint')
const getOEmbed = require('../utils/get-oembed')

const route = express.Router()

function getChannelBySlug(slug) {
	const url = `${config.databaseURL}/channels.json?orderBy="slug"&equalTo="${slug}"`
	return got(url, {
		timeout: 6000,
		retries: 1
	})
}

route.get('/', (req, res) => {
	const slug = req.query.slug

	if (!slug) return noEndpoint(res)

	getChannelBySlug(slug).then(response => {
		const channels = JSON.parse(response.body)
		const id = Object.keys(channels)[0]
		const channel = channels[id]

		if (!channel) return noEndpoint(res)

		channel.id = id
		const embedHtml = getOEmbed(channel)
		res.send(embedHtml)
	}).catch(err => {
		res.status(500).send({
			message: `Could not fetch channel "${slug}"`,
			code: 500,
			internalError: err
		})
	})
})

module.exports = route
