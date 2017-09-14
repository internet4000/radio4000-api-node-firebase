// Returns 404 with an object that explains usage
// Used for existing endpoints with wrong params

const config = require('./config')

function noEndpoint(req, res, usage = '') {
	res.status(404).json({
		message: 'NOT FOUND',
		usage: config.apiURL + req.path + usage
	})
}

module.exports = noEndpoint