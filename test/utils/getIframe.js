import test from 'ava';
import getIframe from '../../utils/getIframe.js';

test('iframe: it generates one', t => {
	t.throws(() => getIframe())
});

test('iframe: slug & script placeholder replaced in template', t => {
	const iframe = getIframe('200ok', 'https://test.com')
	const replacedSlug = iframe.indexOf('##CHANNEL_SLUG##')
	const replacedScript = iframe.indexOf('##PLAYER_SCRIPT_URL##')
	t.is(replacedSlug, -1)
	t.is(replacedScript, -1)
});
