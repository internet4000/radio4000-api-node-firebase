import test from 'ava';
import getIframe from '../../src/utils/get-iframe.js';

test('iframe: it fails without 2 params', t => {
	t.throws(() => getIframe())
});

test('iframe: slug & script placeholder replaced in template', t => {
	const html = getIframe('200ok', 'https://test.com')
	const replacedSlug = html.indexOf('##CHANNEL_SLUG##')
	const replacedScript = html.indexOf('##PLAYER_SCRIPT_URL##')
	// "238" tests the length of the HTML snippet.
	t.is(html.length, 238)
	t.is(replacedSlug, -1)
	t.is(replacedScript, -1)
});
