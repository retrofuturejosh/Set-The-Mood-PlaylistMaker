const request = require('request-promise'); // "Request" library


const secret = require('../../secrets')
const client_id = secret.spotifyClientId; // Your client id
const client_secret = secret.spotifyClientSecret; // Your secret

let token;

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


function searchSpotify(trackName, artist) {
  let promise
  if (token) {
    searchWithToken(trackName, artist)
  } else {
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
    
        // use the access token to access the Spotify Web API
        token = body.access_token;
        return searchWithToken(trackName, artist)
      }
    })
    .then(data => {
      console.log(data)
    })
  }
}

function searchWithToken(trackName, artist) {
  let options = {
    url: `https://api.spotify.com/v1/search?q=track:${trackName}%20artist:${artist}&type=track`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  let returnInfo = request.get(options, (error, response, body) => {
    if (body.tracks.items.length) {
      let returnArtist = body.tracks.items[0].artists[0].name
      let returnTrack = body.tracks.items[0].name
      let trackID = body.tracks.items[0].id
      console.log(`${returnArtist} - ${returnTrack} & trackID is ${trackID}`)
    } else console.log('sorry, no track found')
  })
}

searchSpotify('Believe', 'Cher')