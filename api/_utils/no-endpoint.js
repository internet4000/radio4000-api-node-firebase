// Returns 404 with an object that explains usage
// Used for existing endpoints with wrong params

function noEndpoint(res) {
    res.status(404).json({
	message: 'NOT FOUND',
	documentationUrl: 'https://github.com/internet4000/radio4000-api'
    })
}

module.exports = noEndpoint
