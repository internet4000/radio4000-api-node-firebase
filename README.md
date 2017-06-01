This is a Express.js `json` node API for creating iframe and oEmbeds for Radio4000 channels.


# Endpoints (json)


## /iframe

`/iframe?slug={radio4000-channel-slug}`

Will return an `html` document with an instance of the [radio4000-vue-player](github.com/internet4000/radio4000-player-vue).

This endpoint has been created to provide a `url` `/iframe?slug={radio4000-channel-slug}` to be used in html `<iframe src="{/iframe..}"` elements and therefore render a radio4000 player to be embed (the same way a Youtube video can be embed on any page).

This endpoint has for primary user the other endpoint `/oembed` from this same api.

The file used to render the player is located here: `/templates/embed.html`.


## /oembed

`/oembed?slug={radio4000-channel-slug}`

Will return an `ojbect` following the [oEmbed spec](http://oembed.com/)

It uses the data from [api.radio4000.com](https://api.radio4000.com)

```json
{
version: "1.0",
type: "rich",
provider_name: "Radio4000",
provider_url: "https://radio4000.com/",
author_name: "200ok",
author_url: "https://radio4000.com/200ok/",
title: "200ok",
description: "Textures, drums, breaks and grooves #am to #pm",
thumbnail_url: "https://assets.radio4000.com/radio4000-icon.png",
html: "<iframe width="320" height="400" src="https://embed.radio4000.com/iframe?slug=200ok" frameborder="0"></iframe>",
width: 320,
height: 400
}
```

This endpoint has for primary user [radio4000.com](https://radio4000.com). The data it returns is used to generate some of the meta tags composing each radio detail page composing radio4000.com.

```html
<link rel="alternate" type="application/json+oembed" href="https://embed.radio4000.com/oembed?slug={channel-slug}" title="{channel-title}">
```

Exemples: [http://oembed.com/#section5](http://oembed.com/#section5)
