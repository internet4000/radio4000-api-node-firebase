const deleteChannelFollowersReferences = async (dbRootRef, channelPublic) => {
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
	console.log('updates', updates)

	return dbRootRef.update(updates)
}


/*
	 when a channel is deleted
*/

const handleChannelDelete = async (snapshot, context) => {
	const channel = snapshot.val()
	const {channelPublic} = channel
	const {id: channelId} = context.params
	const {auth} = context

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
	let userChannelRef = snapshot.ref
	let dbRootRef = userChannelRef.parent.parent

	if (channelPublic) {
		try {
			await deleteChannelFollowersReferences(dbRootRef, channelPublic)
		} catch (error) {
			console.error('Error deleting channel\'s followers.favorite[channelId] refs')
		}
	}
}

const handleChannelCreate = async (snapshot, context) => {
		const channel = snapshot.val()
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

module.exports = {
	handleChannelCreate,
	handleChannelDelete
}
