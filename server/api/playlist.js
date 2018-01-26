const router = require('express').Router()
const fetchSongs = require('./APIFuncs').fetchSongsByTag
const fetchTags = require('./APIFuncs').fetchTags
const fetchSimilar = require('./APIFuncs').fetchSimilarSongs
const stringSimilarity = require('string-similarity');
const fetch = require('node-fetch');
const youTubeSearch = require('youtube-search')
const secrets = require('../../secrets')
const searchSpotify = require('./spotifyFuncs').searchSpotify
const getSpotifyToken = require('./spotifyFuncs').getSpotifyToken

const APIKEY = process.env.google || secrets.googleKey

const youTubeOpts  = {
    maxResults: 10,
    key: APIKEY,
    type: 'video',
    videoEmbeddable: true,
    videoSyndicated: true
  };

module.exports = router

router.get('/', (req, res, next) => {
    let finalPlaylist = []
    let tagsArr = []
    let chosenTags = []
    let playListWithSpotifyData = []
    let token

    let tokenPromise = getSpotifyToken()

    for (tag in req.query){
        tagsArr.push(req.query[tag])
        if (tag.slice(0, 4) !== 'more') chosenTags.push(req.query[tag])
    }
    let songPromises = tagsArr.map(tag => {
        return fetchSongs(tag)
    })
    let similarPromise = fetchSimilar(req.query.artist, req.query.track)

    let megaPromise = Promise.all([...songPromises, similarPromise])
    .then(trackOptions => {
        return trackOptions.map(trackSet => {
            return trackSet.map(track => {
                if (track) {
                let tagPromise = fetchTags(track.artist, track.name, 10)
                return tagPromise.then(tags => {
                    if (tags && track){
                    tags.forEach(tag => {
                        chosenTags.forEach(chosenTag => {
                            let similarity = stringSimilarity.compareTwoStrings(tag.name, chosenTag)
                            if (similarity > 0.5){
                                if (chosenTag.matchTags) track.matchTags.push(tag)
                                else track.matchTags = [tag]        
                            }
                        })
                        if (tag != req.query.artist && tag != req.query.track) {
                            tagsArr.forEach(moreTag => {
                                let secondarySimilarity = stringSimilarity.compareTwoStrings(tag.name, moreTag)
                                if (secondarySimilarity > 0.5){
                                    if (track.halfMatches) track.halfMatches.push(tag)
                                    else track.halfMatches = [tag]        
                                }
                            })
                        }
                    })
                }
                if (track.matchTags){
                    track.matchStrength = (track.matchTags.length) * 10
                } else track.matchStrength = 0
                if (track.halfMatches){
                    track.matchStrength += (track.halfMatches.length)
                }
                    return track
                })
            } 
            })
        })
    })
    .then(trackOptionsWithData => {
        const mergedTrackOptions = [].concat.apply([], trackOptionsWithData);
        return Promise.all(mergedTrackOptions)
    })
    .then(trackOptions => {
        let redundantCheck = {}
        let redundantFreeTrackOptions = trackOptions.filter(trackOption => {
            if (redundantCheck[trackOption.name]) return false
            else redundantCheck[trackOption.name] = true
            return true
        })
        let finalMatchOptions = trackOptions.sort((a, b) => {
            return b.matchStrength - a.matchStrength
        })
        let sameArtistCheck = {}
        let songCheck = []
        let finalMatches = []
        for (let i = 0; i < 250; i++){
            if (finalMatches.length === 50) break
            let checkOption = finalMatchOptions[i]
            let checkSong = checkOption.name
            let alreadyChosen = false
            if (checkOption.matchTags && !checkOption.matchTags.length) continue
            songCheck.forEach(song => {
                let similarSongCheck = stringSimilarity.compareTwoStrings(song, checkSong)
                if (similarSongCheck > 0.5) alreadyChosen = true
            })
            if (alreadyChosen) continue
            songCheck.push(checkSong)
            let checkArtist = checkOption.artist
                if (sameArtistCheck[checkArtist]){
                    sameArtistCheck[checkArtist] += 1
                    if (sameArtistCheck[checkArtist] > 5) null
                    else {
                        finalMatches.push(checkOption)
                    }
                } else {
                    sameArtistCheck[checkArtist] = 1             
                    finalMatches.push(checkOption)
                }
        }
        let youTubePromise = finalMatches.map(finalSong => {
            return new Promise((resolve, reject) => {
                youTubeSearch(`${finalSong.name} ${finalSong.artist} official`, youTubeOpts, function(err, results) {
                    if(err) reject(err);
                    if (results && results.length && results[0].id !== undefined) {
                    finalSong.youtubeid = results[0].id
                    }
                    resolve(finalSong)
                  })
            })
        })
        return Promise.all(youTubePromise)
    })
    .then(playlist => {
      finalPlaylist = playlist
    })
    .catch(error => console.log(error))


    tokenPromise
    .then(returnToken => {
        token = returnToken
    })

    Promise.all([megaPromise, tokenPromise])
    .then(data => {
      let spotifyPromise = finalPlaylist.map(finalSong => {
        return searchSpotify(finalSong.name, finalSong.artist, token)
        .then(result => {
          if(typeof result === 'string') finalSong.spotifyID = null;
          else {
            finalSong.spotifyID = result.trackID
          }
          playListWithSpotifyData.push(finalSong)
        })
        .catch(error => console.log(error))
        })
        return Promise.all(spotifyPromise)
      })
    .then(playlist => {
        let final = {}
        playlist = playListWithSpotifyData.filter(track => {
            if (track.youtubeid) return true
            return false
        })
        final.playlistArr = shuffle(playlist)
        final.youTubeURL= 'https://www.youtube.com/watch_videos?video_ids='
        playlist.forEach(track => {
            if (track.youtubeid) {
            final.youTubeURL += track.youtubeid + ','
            }
        })
        final.youTubeURL = final.youTubeURL.slice(0, -1)
        res.json(final)
    })
    .catch(error => console.log(error))
  })

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }