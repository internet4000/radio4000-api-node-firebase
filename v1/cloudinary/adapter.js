var rootUrl = 'https://res.cloudinary.com/radio4000/image/upload/q_50,w_200,h_200,c_thumb,c_fill,fl_lossy/';

function buildCloudinaryUrl(imageSrc) {
	return `${rootUrl}${imageSrc}`;
}

module.exports = {buildCloudinaryUrl};
