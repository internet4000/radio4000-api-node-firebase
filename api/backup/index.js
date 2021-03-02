const noEndpoint = require('../_utils/no-endpoint')
const {createBackup} = require('radio4000-sdk')

module.exports = (req, res) => {
    const slug = req.query.slug

    if (!slug) return noEndpoint(res)

    createBackup(slug)
	.then(backup => res.status(200).send(backup))
	.catch(error => {
	    res.status(500).send({
		message: `Could not fetch channel '${slug}'`,
		code: 500,
		internalError: error
	    })
	})
}
