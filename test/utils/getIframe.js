import test from 'ava';
import getIframe from '../../utils/getIframe.js';

test('iframe: it fails without 2 params', t => {
	t.throws(() => getIframe())
});

test('iframe: slug & script placeholder replaced in template', t => {
	const iframe = getIframe('200ok', 'https://test.com')
	const replacedSlug = iframe.indexOf('##CHANNEL_SLUG##')
	const replacedScript = iframe.indexOf('##PLAYER_SCRIPT_URL##')
	t.is(iframe.length, 185)
	t.is(replacedSlug, -1)
	t.is(replacedScript, -1)
});
