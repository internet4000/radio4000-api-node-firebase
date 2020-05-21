const handleChannelDelete = (snapshot, context) => {
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
}

const handleChannelCreate = (snapshot, context) => {
	const channel = snapshot.val()
	const {channelId} = context.params

	// find current-user at ref: /users/:currentUser

	// if user.channels.length > 0; return

	// add user.channels[channelId]: true

	// create new /channelPublics/

	// add channelPublic.channel = channelId
	// add channel.channelPublic = channelPublic.id
}

module.exports = {
	handleChannelCreate,
	handleChannelDelete
}
