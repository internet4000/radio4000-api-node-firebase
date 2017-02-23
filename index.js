var express = require('express');
var app = express();
var firebase = require('firebase');
var cloudinary = require('cloudinary');
var env = require('./env.json');

var firebaseConfig = {
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    databaseURL: env.firebaseDatabaseURL
};

var cloudinaryConfig = {
    firebaseDatabaseURL: env.firebaseDatabaseURL,
    cloudinaryApiKey: env.cloudinaryApiKey,
    cloudinaryApiSecret: env.cloudinaryApiSecret
};

firebase.initializeApp(firebaseConfig);

var notAnEndpoint = function (req, res) {
    res.status(500).json({ error: 'Impossible to request this endpoint' });
};

app.get('/', function (req, res) {
    // TODO: send some doczz
    res.json({
	"documentationUrl": "https://github.com/internet4000",
	"hello": "Welcome to the Radio4000 API."
    });
});

app.get('/channels', function (req, res) {
    // TODO: remove tracks in reponse (impossible at firebase query)
    var channels = firebase.database().ref('/channels');
    channels.once('value').then(snapshot => {
	res.json(snapshot.val());
    });
});

app.get('/channels/:channelSlug', function (req, res) {
    var ref = firebase.database().ref('channels');
    var slug = req.params.channelSlug;
    console.log( "slug", slug );
    ref.orderByChild('slug').equalTo(slug).once('value').then(snapshot => {
	res.send(snapshot.val());
    }).catch(() => {
	res.status(500).json({ error: 'Data does not exist' });
    });
});

app.get('/tracks', notAnEndpoint);

app.get('/tracks/:trackId', function (req, res) {
    var ref = firebase.database().ref(`tracks/${req.params.trackId}`);
    ref.once('value').then(snapshot => {
	res.send(snapshot.val());
    }).catch(() => {
	res.status(500).json({ error: 'Data does not exist' });
    });
});

app.get('/images', notAnEndpoint);

app.get('/images/:imageId', function (req, res) {
    // TODO: make cloudinary request
    var ref = firebase.database().ref(`images/${req.params.imageId}`);
    ref.once('value').then(snapshot => {
	res.send(snapshot.val());
    }).catch(() => {
	res.status(500).json({ error: 'Data does not exist' });
    });
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
