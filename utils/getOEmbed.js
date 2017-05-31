module.exports = function (embedApiRoot, { slug, title, body }) {
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
		'html': `<iframe width="320" height="400" src="${embedApiRoot}/iframe?slug=${slug}" frameborder="0"></iframe>`,
		'width': 320,
		'height': 400
	})
}
