import test from 'ava'
import getIframe from '../../src/utils/get-iframe.js'

test('iframe: it fails without arguments', t => {
	t.throws(() => getIframe())
})

test('iframe: slug & script placeholder replaced in template', t => {
	const html = getIframe('200ok')
	const replacedSlug = html.indexOf('##CHANNEL_SLUG##')
	const replacedScript = html.indexOf('##PLAYER_SCRIPT_URL##')
	
	t.is(replacedSlug, -1)
	t.is(replacedScript, -1)
})
