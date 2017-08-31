require('dotenv').config()
const express = require('express')
const stripe = require('stripe')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const bodyParser = require('body-parser')
const got = require('got')
const cors = require('cors')
const pkg = require('./package.json')
const getIframe = require('./utils/get-iframe')
const getOEmbed = require('./utils/get-oembed')


const keyPublishable = process.env.PUBLISHABLE_KEY;
/* const keySecret = process.env.SECRET_KEY;*/
const keySecret = 'sk_test_F2Qx73O5Q4ggCF46ueqhte3c';

/*
 * start Express server
 * */

const app = express()
const stripeApp = stripe(keySecret);
const jsonParser = bodyParser.json()
app.use(cors())


/*
	 If we want to run the server outside of firebase's function servers
	 we'll need a service account, to have the right authorization
	 to connect as admin to our firebase instance.

	 const serviceAccount = require("./serviceAccountKey.json")
	 admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://radio4000-staging.firebaseio.com"
	 });
*/

/*
	 When used on firebase servers, we just need to pull the config
	 and run the server that way:
	 $ firebase serve --only functions
	 source: https://firebase.google.com/docs/functions/local-emulator
*/

admin.initializeApp(functions.config().firebase);


/*
 * Global variables +
 * set URL path for api, `embed.` + `api.` calls
 * when serving for `production` or `development` (localhost *)
 * */

const {NODE_ENV, PORT = 3000} = process.env

let R4PlayerScriptUrl = 'https://unpkg.com/radio4000-player'
let host = `http://localhost:${PORT}`
let R4ApiRoot = 'https://radio4000-staging.firebaseio.com/'

if (NODE_ENV === 'production') {
	host = `https://api.radio4000.com`
	R4ApiRoot = 'https://radio4000.firebaseio.com/'
}


/*
 * Create documentation
 * for existing enpoints, but wrong path
 * */

function notEndpointPath(req, res, usage = '') {
	res.status(404).json({
		message: 'NOT FOUND',
		usage: host + req.path + usage
	})
}


/*
 * Routes
 * */

app.get('/', function (req, res) {
	res.json({
		message: 'Welcome to the Radio4000 api',
		documentationUrl: pkg.homepage,
		iframeUrl: host + '/iframe',
		oembedUrl: host + '/oembed'
	})
})

app.get('/iframe', function (req, res) {
	const slug = req.query.slug
	const usage = `?slug={radio4000-channel-slug}`
	if (!slug) return notEndpointPath(req, res, usage)
	res.send(getIframe(slug, R4PlayerScriptUrl))
})

app.get('/oembed', (req, res, next) => {
	const slug = req.query.slug
	const usage = '?slug={radio4000-channel-slug}'
	if (!slug) return notEndpointPath(req, res, usage)

	getChannelBySlug(slug).then(response => {
		const channels = JSON.parse(response.body)
		const id = Object.keys(channels)[0]
		let channel = channels[id]
		channel.id = id
		if (!channel) return notEndpointPath(req, res, usage)
		const embedHtml = getOEmbed(host, channel)
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
  if (!data || !data.stripeCard) return res.sendStatus(400)

	const amount = 1400;
	const { stripeCard, radio4000ChannelId } = data;

	const newCustomer = {
    email: stripeCard.email,
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

						 res.status(200).json({
							 message: 'charge sucess && channel.isPremium = true'
						 })

					 }).catch(completionError => {
						 console.log('@firebase:isPremium-c-error', completionError)
						 res.status(500).json({
							 message: 'charge error: card charged, but channel not upgraded to premium'
						 })
					 })
			} else {
				// send error response
				console.log('answer.paid', answer.paid)
				res.status(500).json({
					message: 'charge error, answer.paid = false'
				})
			}
		}).catch(error => {
			console.log('error charges.create', error);
			res.status(500).json({
				message: 'charge create error'
			})
		});
	}).catch(error => {
		console.log('error customers.create', error);
		res.status(500).json({
			message: 'customer create error'
		})
	})
})


/*
 * Run server
 * */

app.listen(PORT, function () {
	console.log(`[+] running on port ${PORT}`);
})

module.exports = app
