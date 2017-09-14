import test from 'ava'
import getOEmbed from '../../src/utils/get-oembed.js'

test('getOEmbed: it returns an object with 12 keys', t => {
	const channel = {
		slug: '200ok',
		title: '200ok',
		body: 'oijoijoij'
	}
	const embed = getOEmbed(channel)

	t.is(Object.keys(embed).length, 12)
})


test('getOEmbed: it works with !channel.body', t => {
	const channel = {
		slug: 'detecteve',
		title: 'detecteve'
	}
	const embed = getOEmbed(channel)
	const embedToString = JSON.stringify(embed)
	const noUndefined = embedToString.indexOf('undefined')
	
	t.is(noUndefined, -1)
})
