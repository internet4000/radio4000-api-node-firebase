# Radio4000 Embed API

This is the API for creating iframe and oEmbeds for Radio4000 channels. It uses Node.js and Express.js.

## Endpoints

List of all available endpoints on https://embed.radio4000.com.

### /iframe

- `/iframe?slug={radio4000-channel-slug}`

Returns an `HTML` document with an instance of the [radio4000-vue-player](https://github.com/internet4000/radio4000-player-vue).

This endpoint is meant to be used as the `src` of our `<iframe>` embeds. To get the HTML for the iframe embed, visit the `/oembed` endpoint and see the `html` property. The HTML template returned is here: `/templates/embed.html`.

## /oembed

- `/oembed?slug={radio4000-channel-slug}`

Returns a `JSON` object following the [oEmbed spec](http://oembed.com/) for a Radio4000 channel.

With this, we can add a meta tag to each channel to get rich previews when the link is shared. Like this:

```html
<link rel="alternate" type="application/json+oembed" href="https://embed.radio4000.com/oembed?slug=200ok" title="200ok">
```

Here's an example of what is returned:

```json
{
  "version": "1.0",
  "type": "rich",
  "provider_name": "Radio4000",
  "provider_url": "https://radio4000.com/",
  "author_name": "200ok",
  "author_url": "https://radio4000.com/200ok/",
  "title": "200ok",
  "description": "Textures, drums, breaks and grooves #am to #pm",
  "thumbnail_url": "https://assets.radio4000.com/radio4000-icon.png",
  "html": "<iframe width=\"320\" height=\"400\" src=\"https://embed.radio4000.com/iframe?slug=200ok\" frameborder=\"0\"></iframe>",
  "width": 320,
  "height": 400
}
```

## Developing

Clone the repository, cd into it and install dependencies with `yarn install`. Then do `yarn run` to see which commands are available.

### Firebase

Make sure you have installed the Firebase tools:

1. `yarn global add firebase-tools`
2. `firebase login`

Then to start a server:

- `firebase serve --only functions,hosting`

This will start two local servers. One for functions, one for hosting.

To deploy it, run:

- `firebase deploy --only functions`
