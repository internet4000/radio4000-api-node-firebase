const functions = require('firebase-functions')
const app = require('./src/app')

const {database} = functions

exports.api = functions.https.onRequest(app)

// a channel is deleted
exports.handleChannelDelete = database.ref('/channels/{channelId}')
	.onDelete((snapshot, context) => {
		const channel = snapshot.val()
		const {channelId} = context.params

		return snapshot.ref.parent.parent.child(`/channelPublics/${channel.channelPublic}/followers`)
									 .once('value')
									 .then(followersSnap => {
										 const followers = followersSnap.val()
										 if (!followers) return
										 let updates = {}
										 Object.keys(followers).forEach(followerId => {
											 updates[`/channels/${followerId}/favoriteChannels/${channelId}`] = null
										 })
										 return snapshot.ref.parent.parent.update(updates)
									 })
	})
