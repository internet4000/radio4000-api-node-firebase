const createDOMPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const config = require('../../config')
const noEndpoint = require('../_utils/no-endpoint')
const getIframe = require('../_utils/get-iframe')

module.exports = (req, res) => {
    // Prepare stuff for XSS
    const window = new JSDOM('').window
    const DOMPurify = createDOMPurify(window)

    const slug = req.query.slug

    if (!slug) return noEndpoint(res)

    // Prevent XSS
    const safeSlug = DOMPurify.sanitize(slug)
    res.status(200).send(getIframe(safeSlug, config.playerScriptURL))
}
