const request = require('request-promise'); // "Request" library

const secret = require('../../secrets')

const client_id = secret.spotifyClientId; // Your client id
const client_secret = secret.spotifyClientSecret; // Your secret

// your application requests authorization
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

function getSpotifyToken() {
  return request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('I GOT A NEW TOKEN')
      return body;
    }
  })
  .then(body => {
    let token = body.access_token;
    return token;
  })
  .catch(error => {
    console.log('error in getSpotifyToken function ', error)
  })
}


function searchSpotify(trackName, artist, token) {
  let options = {
    url: `https://api.spotify.com/v1/search?q=track:${trackName}%20artist:${artist}&type=track`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  return request.get(options, (error, response, body) => {
    return body
  })
  .then(body => {
    if (body.tracks.items.length) {
      let trackData = body.tracks.items[0]
      let image = trackData.album.images[0]
      let returnArtist = trackData.artists[0].name
      let fullArtistObj = trackData.artists[0]
      let returnTrack = trackData.name
      let trackID = trackData.id
      let songURL = trackData.external_urls
      let preview = trackData.preview_url
      let returnData = {
          artist: returnArtist,
          track: returnTrack,
          trackID,
          url: songURL,
          previewURL: preview,
          image
        }
      // console.log(returnData)
      return returnData
    } else {
      return 'error: track not found'
    }
  })
  .catch(error => {
    console.log('error in searchSpotify function ', error)
  })
}

module.exports = {
  searchSpotify,
  getSpotifyToken
}