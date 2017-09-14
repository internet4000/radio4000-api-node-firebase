const config = require('./config')

module.exports = function ({ slug, title, body }) {
	if (!body) {
		body = ''
	}
	return ({
		'version': '1.0',
		'type': 'rich',
		'provider_name': 'Radio4000',
		'provider_url': 'https://radio4000.com/',
		'author_name': title,
		'author_url': `https://radio4000.com/${slug}/`,
		'title': title,
		'description': body,
		'thumbnail_url': `https://assets.radio4000.com/radio4000-icon.png`,
		'html': `<iframe width="320" height="400" src="${config.apiURL}/embed?slug=${slug}" frameborder="0"></iframe>`,
		'width': 320,
		'height': 400
	})
}
