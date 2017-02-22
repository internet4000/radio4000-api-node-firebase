var express = require('express');
var app = express();
var firebase = require('firebase');


var config = {
    apiKey: "AIzaSyDi6cxC167OWaliNMnZkE0BX1XP8ObwdnQ",
    authDomain: "radio4000-staging.firebaseapp.com",
    databaseURL: "https://radio4000-staging.firebaseio.com"
};

firebase.initializeApp(config);


app.get('/channels', function (req, res) {
    var channels = firebase.database().ref('/channels');
    channels.once('value').then(snapshot => {
	res.json(snapshot.val());
    });
})

app.get('/channels/:channelSlug', function (req, res) {
    var ref = firebase.database().ref('channels');
    var slug = req.params.channelSlug;
    console.log( "slug", slug );
    ref.orderByChild('slug').equalTo(slug).once('value').then(snapshot => {
	console.log( snapshot.val() );
	res.send(snapshot.val());
    });
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
