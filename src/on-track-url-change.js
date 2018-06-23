const functions = require('firebase-functions')
const admin = require('firebase-admin');
const getYoutubeId = require('./utils/youtube-url-to-id.js')

/*
	To test the execution of this function
	you can run `yarn firebase:shell`
	and use the following mockup call
	
	onTrackUrlChange({before: 'youtu.be/xIaco5AQrUQ', after: 'https://www.youtube.com/watch?v=OkR7UNnQU6c' })
*/

const onTracksChange = (snapshot, context) => {
	// console.log('snapshot: ', snapshot)
	// console.log('context: ', context)
	
	let db = admin.database();

	let newUrl = snapshot.after.val()
	let providerId = getYoutubeId(newUrl)
	let providerName = 'youtube'
	
	// abort if no ID in provider URL
	if(!providerId) {
		return false
	}
	
	const ref = db.ref(`/providerTracks/${providerName}:${providerId}/tracks/${context.params.trackId}`);

	return ref.set(true);
}

module.exports = onTracksChange

/*
Model `providerTrack`:
- tracks: list of tracks that reference this providerTrack
- discogsReleaseId: id of this track's release on discogs
*/
