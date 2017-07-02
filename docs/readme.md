# API URL
- Dev endpoint [https://r4-api.now.sh](https://r4-api.now.sh)
- (Future) Live endpoint [https://api.radio4000.com](https://api.radio4000.com)

# References

Check [here for te API source code](https://github.com/internet4000/radio4000-api).
If you have any comment please open an issue on the present document.

# Version prefix
`v1` is the latest version of the API.
`/v1/:endpoint`: to query available endpoints.

# Endpoints
- `/` (GET): link to this document
- `/channels` (GET): all channels data
- `/channels?queryParam.filterMethod=value`: filtered list of channel
  - queryParam: any value of the channel (e.g. `title` or `slug`)
  - filterMethod (optional)
    - `contains` [string]: the query parameter should be contained by the channel value
    - `icontains` [string]: same but case insensitive
    - `starts_with` [string]: the query parameter should be the start of the channel value
    - `gt` [integer]: the query parameter should be greater than the value
    - by default it will search for the exact value
  - value: a string for your search
- `/channels/:channelId` (GET): specific channel data
- `/channels/:channelId/tracks` (GET): specific channel tracks data
- `/tracks/:trackId` (GET): specific track data
- `/images/:imageId` (GET): specific image data

# Examples

- `channels?title.icontains=radio`: channel with a title containing (case insensitive) "radio"
- `channels?tracks.gt=500`: channels with more than 500 tracks

# Models
## channel
- `id [string]`: if for this channel
- `body [string]`: user description for this channel
- `slug [string]`: user generated unique identifier for a channel. It is used for its URL.
- `title [string]`: user chosen name for this channel
- `created [integer]`: timestamp, creation date for this channel
- `updated [integer]`: timestamp, last time this channel was updated (when a new track is added)
- `favoriteChannels [list]`: ids of channels added as favorite by this channel
- `images [list]`: ids to images models on Radio4000
- `isFeatured [boolean]`: is the channel featured on Radio4000's homepage
- `link [string]`: one external link chosen by the channel owner
- `tracks [list]`: list of track ids that are owned by this channel

## track
- `id [string]`: id for this track
- `title [string]`: user title for the track
- `body [string]`: user description for this track
- `channel [string]`: channel id of the channel owning this track
- `created [integer]`: timestamp, creation date fot this track
- `url [string]`: full URL to the track ressource on the content provider's website
- `ytid [string]`: id if the track as defined by the content provider

## image
- `id [string]`: id for this image
- `channel [string]`: id of the channel that owns this image
- `created [integer]`: timestamp, creation date for this image
- `src [string]`: full URL pointing to the image ressource