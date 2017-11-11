const router = require('express').Router()
const fetchSongs = require('./starting').fetchSongsByTag
const fetchTags = require('./starting').fetchTags
const fetchSimilar = require('./starting').fetchSimilarSongs
var stringSimilarity = require('string-similarity');

module.exports = router

router.get('/', (req, res, next) => {
    console.log('!!!!!! REQ QUERY IS ', req.query)
    let tagsArr = []
    let chosenTags = []
    for (tag in req.query){
        tagsArr.push(req.query[tag])
        if (tag.slice(0, 4) !== 'more') chosenTags.push(req.query[tag])
    }
    let songPromises = tagsArr.map(tag => {
        return fetchSongs(tag)
    })
    let similarPromise = fetchSimilar(req.query.artist, req.query.track)
    Promise.all([...songPromises, similarPromise])
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
                    track.matchStrength = (track.matchTags.length) * 4
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
        let finalMatchOptions = trackOptions.sort((a, b) => {
            return b.matchStrength > a.matchStrength
        })
        // console.log(finalMatchOptions)
        let sameArtistCheck = {}
        let finalMatches = []
        for (let i = 0; i < 250; i++){
            if (finalMatches.length === 50) break
            let checkOption = finalMatchOptions[i]
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
        console.log(finalMatches)
        res.json(finalMatches)
    })
})