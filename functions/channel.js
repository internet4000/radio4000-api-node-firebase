const admin = require('firebase-admin')
const slugify = require('@sindresorhus/slugify')

const deleteChannelFollowersReferences = async (dbRootRef, channelId, channelPublic) => {
	if (!channelId || !channelPublic) return

	let channelFollowersRef = dbRootRef.child(`/channelPublics/${channelPublic}/followers`)
	let channelFollowersSnap
	try {
		channelFollowersSnap = await channelFollowersRef.once('value')
	} catch (error) {
		console.error('Error getting channel.followers')
	}

	const followers = channelFollowersSnap.val()

	if (!followers || !followers.length) return

	let updates = {}
	Object.keys(followers).forEach(followerId => {
		updates[`/channels/${followerId}/favoriteChannels/${channelId}`] = null
	})

	return dbRootRef.update(updates)
}

const getUniqueChannelSlug = async (channelData) => {
	let {title, slug} = channelData
	slug = slugify(slug || title)
	let channelsRef = admin.database().ref(`/channels`)

	const channelWithSameSlug = await channelsRef
		.orderByChild('slug')
		.equalTo(slug)
		.once(snapshot => snapshot.val())

	if (channelWithSameSlug && channelWithSameSlug.length) {
		let randomString = Math.random().toString(36).substring(7);
		return `${slug}-${randomString}`
	} else {
		return slug
	}
}


/*
	 a channel is created
*/
const handleChannelCreate = async (snapshot, context) => {
	const newChannel = snapshot.val()
	const {id: channelId} = context.params
	const {auth} = context

	if (!auth) {
		console.error('Channel create called without auth')
		return
	}

	const {uid} = auth

	if (!channelId || !uid) {
		console.error('Channel create called without channelId or auth.uid')
		return
	}

	// find current-user at ref: /users/:currentUser
	let userChannelRef = snapshot.ref
	let dbRootRef = userChannelRef.parent.parent

	// validate slug, or generate it
	let channelSlug
	try {
		channelSlug = await getUniqueChannelSlug(newChannel)
	}

	try {
		await userChannelRef.update({
			slug: channelSlug,
			created: admin.database.ServerValue.TIMESTAMP,
			updated: admin.database.ServerValue.TIMESTAMP
		})
	} catch (error) {
		console.error('Error setting slug')
	}

	// find current-user at ref: /users/:currentUser
	let userRef = dbRootRef.child(`/users/${uid}`)

	// on user add .channels[channelId]: true
	try {
		await userRef.child(`channels/${channelId}`).set(true)
	} catch (error) {
		console.error('Error settting user.channels[channelId]')
	}

	// new /channelPublics/
	let channelPublicsRef = dbRootRef.child('/channelPublics')

	// add channelPublic.channel = channelId
	let channelPublic
	try {
		channelPublic = await channelPublicsRef.push({
			channel: channelId
		})
	} catch (error) {
		console.error('Error setting channelPublic.channel')
	}

	// add channel.channelPublic = channelPublic.id
	try {
		await userChannelRef.child('channelPublic').set(channelPublic.key)
	} catch (error) {
		console.error('Error setting channel.channelPublic')
	}
}

/*
	 update channel
 */
const handleChannelUpdate = async (change, context) => {
	const {id: channelId} = context.params
	const {auth} = context

	if (!auth) {
		console.error('Channel update called without auth')
		return
	}

	const {uid} = auth

	if (!channelId || !uid) {
		console.error('Channel update called without channelId or auth.uid')
		return
	}

	let userChannelRef = change.after.ref
	const newValue = change.after.val()
	const previousValue = change.before.val()

	if (!newValue.slug || newValue.slug !== previousValue.slug) {
		// validate slug, or generate it
		let channelSlug
		try {
			channelSlug = await getUniqueChannelSlug(newValue)
		}

		try {
			await userChannelRef.update({
				slug: channelSlug
			})
		} catch (error) {
			console.error('Error setting slug from channelData')
		}
	}
}


/*
	 when a channel is deleted
 */
const handleChannelDelete = async (change, context) => {
	const channel = change.val()
	const {id: channelId} = context.params
	const {auth} = context

	let channelPublic
	if (channel) {
		channelPublic = channel.channelPublic
	}

	if (!auth) {
		console.error('Channel delete called without auth')
		return
	}

	const {uid} = auth

	if (!channelId || !uid) {
		console.error('Channel delete called without channelId or auth.uid')
		return
	}

	// find current-user at ref: /users/:currentUser
	let userChannelRef = change.ref
	let dbRootRef = userChannelRef.parent.parent

	if (channelPublic) {
		try {
			await deleteChannelFollowersReferences(dbRootRef, channelId, channelPublic)
		} catch (error) {
			console.error('Error deleting channel\'s followers.favorite[channelId] refs')
		}
	}

	// find current-channel-public at ref: /channelPublic/:channel.channelPublic
	let channelPublicRef = dbRootRef.child(`/channelPublics/${channelPublic}`)
	try {
		await channelPublicRef.set(null)
	} catch (error) {
		console.error('Error deleting /channelPublics/:channel.channelPublic')
	}

	// find current-user at ref: /users/:currentUser
	let userRef = dbRootRef.child(`/users/${uid}`)
	try {
		await userRef.child(`/channels/${channelId}`).set(null)
	} catch (error) {
		console.error('Error removing channel on user')
	}

}


module.exports = {
	handleChannelCreate,
	handleChannelUpdate,
	handleChannelDelete
}
