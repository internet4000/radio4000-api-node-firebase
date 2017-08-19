require('dotenv').config()
const express = require('express')
const stripe = require('stripe')
const admin = require('firebase-admin')
const serviceAccount = require("./serviceAccountKey.json")
const bodyParser = require('body-parser')
const got = require('got')
const cors = require('cors')
const pkg = require('./package.json')
const getIframe = require('./utils/getIframe')
const getOEmbed = require('./utils/getOEmbed')


const keyPublishable = process.env.PUBLISHABLE_KEY;
/* const keySecret = process.env.SECRET_KEY;*/
const keySecret = 'sk_test_F2Qx73O5Q4ggCF46ueqhte3c';

console.log('keySecret', keySecret)


/*
 * start Express server
 * */

const app = express()
const stripeApp = stripe(keySecret);
const jsonParser = bodyParser.json()
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://radio4000-staging.firebaseio.com"
});

/* TODO: Says that can be used instead of serviceAccount and
	 admin.initalizeApp({credentials, databaseURL...})
*/
/* admin.initializeApp(functions.config().firebase);*/


/*
 * Global variables +
 * set URL path for api, `embed.` + `api.` calls
 * when serving for `production` or `development` (localhost *)
 * */

const {NODE_ENV, PORT = 3000} = process.env

let R4PlayerScriptUrl = 'https://unpkg.com/radio4000-player'
let R4ApiRoot = 'https://radio4000-staging.firebaseio.com/'
let HTTPPrefix = 'http://'
if (NODE_ENV === 'production') {
	R4ApiRoot = 'https://radio4000.firebaseio.com/'
}


/*
 * Create documentation
 * for existing enpoints, but wrong path
 * */

function notEndpointPath(req, res, usage = '') {
	const host = req.headers.host;
	let url = `${HTTPPrefix}${req.headers.host}`;
	if (NODE_ENV === 'production') {
		url = 'https://api.radio4000.com'
	}

	res.status(404).json({
		message: 'NOT FOUND',
		usage: url + usage
	})
}


/*
 * Routes
 * */

app.get('/', function (req, res) {
	let url = `${HTTPPrefix}${req.headers.host}`;
	if (NODE_ENV === 'production') {
		url = 'https://api.radio4000.com'
	}
	res.json({
		message: 'Welcome to the Radio4000 api',
		documentationUrl: pkg.homepage,
		iframeUrl: url + '/iframe',
		oembedUrl: url + '/oembed'
	})
})

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	const usage = '?slug={radio4000-channel-slug}'
	if (!slug) return notEndpointPath(req, res, usage)
	res.send(getIframe(slug, R4PlayerScriptUrl))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	const embedApiRoot = HTTPPrefix + req.headers.host;
	const usage = '?slug={radio4000-channel-slug}'

	// show usage if missing param
	if (!slug) return notEndpointPath(req, res, usage)

	getChannelBySlug(slug).then(response => {
		const channels = JSON.parse(response.body)
		const id = Object.keys(channels)[0]
		let channel = channels[id]
		channel.id = id
		if (!channel) return notEndpointPath(req, res, usage)
		const embedHtml = getOEmbed(embedApiRoot, channel)
		res.send(embedHtml)
	}).catch(error => {
		res.status(500).send({
			'message': `Could not fetch channel from ${R4ApiRoot}`,
			'code': 500,
			'internalError': error
		})
	})
})

function getChannelBySlug(slug) {
	const url = `${R4ApiRoot}channels.json?orderBy="slug"&equalTo="${slug}"`
	return got(url, {
		timeout: 6000,
		retries: 1
	})
}

/* Card object received
	 card: {
	 id: 'card_1AsEzGCSxcuHyPxSi2JYkGHM',
	 object: 'card',
	 address_city: null,
	 address_country: null,
	 address_line1: null,
	 address_line1_check: null,
	 address_line2: null,
	 address_state: null,
	 address_zip: null,
	 address_zip_check: null,
	 brand: 'Visa',
	 country: 'US',
	 cvc_check: 'pass',
	 dynamic_last4: null,
	 exp_month: 2,
	 exp_year: 2044,
	 funding: 'credit',
	 last4: '4242',
	 metadata: {},
	 name: 'hu@hu.hu',
	 tokenization_method: null
	 }
 */

app.post('/payments', jsonParser, function (req, res) {
	const data = req.body
  if (!data) return res.sendStatus(400)

	const amount = 1400;
	const { stripeCard, radio4000ChannelId } = data;

	const newCustomer = {
    email: stripeCard.name,
    source: stripeCard.id
  }

	console.log('@payments:data', data)
	console.log('@payments:newCustomer', newCustomer);

  stripeApp.customers.create(newCustomer).then(customer => {
		console.log('@customers.create:customer', customer);

		const charge = {
			customer: customer.id,
			source: customer.default_source,
			amount: 1400,
			currency: "eur",
			description: "Radio4000 Premium",
		}

		stripeApp.charges.create(charge).then(answer => {
			console.log('@charges.charge:charge', charge)
			console.log('@charges.charge:answer', answer)

			if(answer.paid) {
				var db = admin.database();
				var ref = db.ref(`channels/${radio4000ChannelId}`);

				console.log('radio4000ChannelId', radio4000ChannelId)

				ref.child('isPremium')
					 .set(true)
					 .then(completion => {
						 console.log('@firebase:isPremium-completion', completion)
					 }).catch(completionError => {
						 console.log('@firebase:isPremium-c-error', completionError)
					 })
			} else {
				// send error response
				console.log('answer.paid', answer.paid)
			}
		}).catch(error => {
			console.log('error charges.create', error);
		});
	}).catch(error => {
		console.log('error customers.create', error);
	})
})


/*
 * Run server
 * */

app.listen(PORT, function () {
	console.log(`[+] running on port ${PORT}`);
})

module.exports = app
