const express = require('express');
const stripe = require('stripe')
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const billings = express.Router();

const keyPublishable = process.env.PUBLISHABLE_KEY;
/* const keySecret = process.env.SECRET_KEY;*/
const keySecret = 'sk_test_F2Qx73O5Q4ggCF46ueqhte3c';

const stripeApp = stripe(keySecret);

billings.get('/', function(req, res) {
	res.json({
		error: 'this endpoint does not exist, check usage on the documentation'
	})
});

billings.post('/', function (req, res) {
	const data = req.body
  if (!data || !data.stripeCard) return res.sendStatus(400)

	const amount = 1400;
	const { stripeCard, radio4000ChannelId } = data;

	const newCustomer = {
    email: stripeCard.email,
    source: stripeCard.id
  }

	console.log('@billings:data', data)
	console.log('@billings:newCustomer', newCustomer);

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

module.exports = billings;
