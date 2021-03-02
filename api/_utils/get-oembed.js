const config = require('../../config')

module.exports = function({ slug, title, body, image }) {
    var thumbnailUrl;

    if (!body) {
	body = ''
    }

    if (image) {
	thumbnailUrl = `https://res.cloudinary.com/radio4000/image/upload/w_500,h_500,c_thumb,q_60,fl_lossy/${image}`
    } else {
	thumbnailUrl =  'https://assets.radio4000.com/icon.png'
    }


    return {
	version: '1.0',
	type: 'rich',
	provider_name: 'Radio4000',
	provider_url: 'https://radio4000.com/',
	author_name: title,
	author_url: `https://radio4000.com/${slug}/`,
	title: title,
	description: body,
	thumbnail_url: thumbnailUrl,
	html: `<iframe width="320" height="500" src="${config.apiURL}/embed?slug=${slug}" frameborder="0"></iframe>`,
	width: 320,
	height: 500
    }
}
