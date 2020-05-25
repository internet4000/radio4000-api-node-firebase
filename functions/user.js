const admin = require('firebase-admin')

/*
	 database actions
 */
const createUserSetting = async (userId) => {
	// create new /users/:newUser
	let userSettingsRef = admin.database().ref('/userSettings/')
	let userSettingRef = await userSettingsRef.push()
	userSettingRef.set({
		user: userId,
		signedUserAgreement: false,
		created: admin.database.ServerValue.TIMESTAMP
	})
	return userSettingRef
}

const createUser = async (userUid, userSettingsId) => {
	// create new /users/:newUser
	let userRef = admin.database().ref(`/users/${userUid}`)
	userRef.set({
		settings: userSettingsId,
		created: new Date()
	})
	return userRef
}

const getCurrentUser = async (userUid) => {
	if (!userUid) return
	let userRef = admin.database().ref(`/users/${userUid}`)
	return await userRef.once('value').then(dataSnapshot => {
		return dataSnapshot.val()
	})
}

const deleteUserChannels = async (userUid) => {
	const {channels} = await getCurrentUser(userUid)
	console.log('channels', channels)
	if (!channels) {
		return
	}
}

const deleteUserSetting = async (userUid) => {
	const {settings} = await getCurrentUser(userUid)
	console.log('settings', settings)
	if (!settings) {
		return
	}
	let settingsRef = admin.database().ref(`/userSettings/${settings}`)
	return settingsRef.remove()
}

const deleteUser = async (userUid) => {
	let userRef = admin.database().ref(`/users/${userUid}`)
	return userRef.remove()
}


/*
	 logic handlers
 */
// when new user, create a custom r4 user, to hide user id from channel
const handleUserCreate = async (user) => {
	const {uid: userId} = user
	if (!userId) {
		console.error('User was created without id')
		return
	}

	// create new /userSettings/:userSetting
	let userSetting
	try {
		userSetting = await createUserSetting(userId)
	} catch (error) {
		console.error('Error creating userSetting')
	}

	// create new r4 user at /users/:userId
	// with the same user id as its auth-unique-id (authUid)
	let r4User
	try {
		r4User = await createUser(userId, userSetting.key)
	} catch (error) {
		console.error('Error creating user')
	}

	try {
		await userSetting.set({
			user: r4User.key
		})
	} catch (error) {
		console.error('Error setting userSetting.user')
	}
}

const handleUserDelete = async (user) => {
	const {uid: userId} = user
	if (!userId) {
		console.error('User was deleted without id')
		return
	}
	// delete all user channels /users/:user.id/channels.*
	try {
		await deleteUserChannels(userId)
	} catch (error) {
		console.error('Error deleting user channels')
	}

	// delete user-settings /userSettings/:user.settings
	try {
		await deleteUserSetting(userId)
	} catch (error) {
		console.error('Error deleting user.userSetting')
	}

	// delete user itself /users/:user.id
	try {
		await deleteUser(userId)
	} catch (error) {
		console.error('Error deleting user')
	}
}

module.exports = {
	handleUserCreate,
	handleUserDelete
}
