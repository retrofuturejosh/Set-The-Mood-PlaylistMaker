const getAPIdata = require('./starting')

const fetchTags = getAPIdata.fetchTags
const fetchSimilarSongs = getAPIdata.fetchSimilarSongs
const searchForArtist = getAPIdata.searchForArtist
const googleQuery = getAPIdata.googleQuery
const findSong = getAPIdata.findSong
//TAGSTOPOPULATE RETURNS AN ARRAY OF PROMISES
const tagsToPopulate = getAPIdata.tagsToPopulate


//MODULAR PARTS
let chosenTags = ['happy', 'rnb', 'wake-up song']
let artist = 'pharell'
let chosenSong = 'happy'


let potentialMatches = []
let getTagsPromise = fetchTags(artist, chosenSong, 10)

let potentialMatchesPromise = getTagsPromise.then(results => {
    return tagsToPopulate(...results)
})
.then(songPromises => {
    return Promise.all(songPromises)
})
.then(songs => {
    potentialMatches = potentialMatches.concat(...songs)
    let matchPromises = potentialMatches.map(song => {
        if (song.name.toLowerCase() !== chosenSong.toLowerCase()) {
            return fetchTags(song.artist, song.name, 25)
            .then(tags => {
                if (tags){
                tags.forEach(tag => {
                    if (chosenTags.includes(tag)){
                        if (song.tags) song.tags.push(tag)
                        else song.tags = [tag]
                    }
                })
            }
                if (song.tags) song.numTagMatches = song.tags.length
                else song.numTagMatches = 0
                return song
            })
            .catch(err => console.log(err))
        } else {
            song.numTagMatches = 0
            return song
        }
    })

    return matchPromises
})
.then(matchPromises => {
    return Promise.all(matchPromises)
})
.then(songs => {
    potentialMatches = songs.sort((a, b) => {
        return b.numTagMatches - a.numTagMatches
    })
})