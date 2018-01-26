// const router = require('express').Router()
// const request = require('request'); // "Request" library

// router.get('/', (req, res, next) => {
//   console.log(req.query);
//   let access_token = req.query.access_token
//   let id = req.query.id

//   createPlaylist(id, access_token);
// })


// function createPlaylist(username, accessToken, callback) {
//   let opts = {
//     url: 'https://api.spotify.com/v1/users/' + username +
// 		'/playlists',
// 		data: JSON.stringify({
// 			'name': 'New Vibez Playlist',
// 			'public': false
// 		}),
// 		dataType: 'json',
// 		headers: {
// 			'Authorization': 'Bearer ' + accessToken,
// 			'Content-Type': 'application/json'
//     }
//   }
// 	request.post(opts, (error, response, body) =>{
//     console.log('response is ', response, 'body is ', body);
//   });
// }


// module.exports = router