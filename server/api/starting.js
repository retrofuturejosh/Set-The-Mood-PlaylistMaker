const fetch = require('node-fetch');
var stringSimilarity = require('string-similarity');

const key = '7f90381d161b96c5c9ab23371d5cc781'

const googleQueryURL = 'http://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=' //then the term

const fetchStringOne = 'http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist='
const fetchStringTwo = '&track='
const fetchStringThree = '&api_key=' + key + '&format=json'

const fetchInfoOne = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + key + '&artist='
const fetchInfoTwo = '&track='
const fetchInfoThree = '&format=json'

const fetchTagsOne = 'http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist='
const fetchTagsTwo = '&track='
const fetchTagsThree = '&api_key=' + key + '&format=json'

const fetchSongsByTagOne = 'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag='
const fetchSongsByTagTwo = '&api_key=' + key + '&format=json'

const fetchArtistSearchOne = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' 
const fetchArtistSearchTwo = '&api_key=' + key + '&format=json'

const findSongOne = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=' 
const findSongTwo = '&api_key=' + key + '&format=json'

function fetchTrackInfo(artist, track){
    const fetchInfoAPIURL = fetchInfoOne + artist + fetchInfoTwo + track + fetchInfoThree
    console.log(fetchInfoAPIURL, 'comare with http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=7f90381d161b96c5c9ab23371d5cc781&artist=cher&track=believe&format=json', )
    return fetch(fetchInfoAPIURL)
    .then(res => res.json())
    .then(body => {
        if (body.track){
            return {track: body.track.name, artist: body.track.artist.name, album: body.track.album.title}
        }
        return body
    })
    .catch(err => console.log(err))
}

function findSong(searchTerm){
    let findSongAPIURL = findSongOne + searchTerm + findSongTwo
    return fetch(findSongAPIURL)
    .then(res => res.json())
    .then(body => {
        return body.results.trackmatches.track.map(track => {
            return {track: track.name, artist: track.artist}
        })
    })
    .catch(err => console.log(err))   
}

function googleQuery(searchTerm){
    let parsedResults = []
    let query = googleQueryURL + searchTerm
    return fetch(query)
    .then(res => res.text())
    .then(results => {
        parseString(results, function (err, result) {
            if (result.toplevel){
            parsedResults = result.toplevel.CompleteSuggestion.map(suggestion => {
                return suggestion.suggestion[0].$.data
            })
        }
        });
        if (parsedResults.length) return parsedResults
        else return 'Nothing found'
    })
    .catch(err => console.log(err))  
}


function searchForArtist(artist){
    let fetchArtistsAPIURL = fetchArtistSearchOne + artist + fetchArtistSearchTwo
    return fetch(fetchArtistsAPIURL)
    .then(res => res.body)
    .then(body => {
        return body.results.artistmatches.artist.map(artist => {
            return artist.name
        })
    })
    .catch(err => console.log(err))   
}

function fetchTags(artistName, trackName, num){
    let fetchTagsString = fetchTagsOne + artistName + fetchTagsTwo + trackName + fetchTagsThree
    let returnArr = []
    return fetch(fetchTagsString)
        .then(res => res.json())
        .then(body => {
            for (let i = 0; i < 40; i++){
                if (body.toptags && body.toptags.tag && body.toptags.tag[i] !== undefined){
                    if (returnArr.length){
                        let checkThese = [...returnArr]
                        let flag = false
                        checkThese.forEach(tag => {
                            let similarity = stringSimilarity.compareTwoStrings(body.toptags.tag[i].name, tag.name);
                            if (similarity > 0.69){
                                // console.log(`similarity between ${body.toptags.tag[i].name} & ${tag.name} is ${similarity}`)                                
                                flag = true
                            }
                        })
                        if (!flag && returnArr.length < 20) returnArr.push({name: body.toptags.tag[i].name, count: body.toptags.tag[i].count})
                    } else returnArr.push({name: body.toptags.tag[i].name, count: body.toptags.tag[i].count})
                }
            }
            // if (!returnArr.length) return ['NOT FOUND']
            return returnArr
        }).catch(err => console.log(err)
        );
}

function fetchSimilarSongs(artistName, trackName){
    let fetchString = fetchStringOne + artistName + fetchStringTwo + trackName + fetchStringThree
    let returnArr = []
    return fetch(fetchString)
    .then((res)=> res.json())
    .then(function(body) {
        body.similartracks.track.forEach(function(track, i){
            if (track.match > .2){
                returnArr.push({relation: 'similar song', name: track.name, artist: track.artist.name, match: track.match})
            }
        })
        return returnArr
    }).catch(err => console.log(err)
    );
}

function fetchSongsByTag(tag){
    let fetchSongsByTagString = fetchSongsByTagOne + tag + fetchSongsByTagTwo
    let returnArr = []
    return fetch(fetchSongsByTagString)
    .then(res => res.json())
    .then(body => {
        body.tracks.track.forEach(track => {
            returnArr.push({relation: 'same tag', name: track.name, artist: track.artist.name, tag: tag})
        })
        return returnArr
    })
    .catch(err => console.log(err))
}

function tagsToPopulate(){
    let args = [].slice.call(arguments);
    let returnArr = args.map(tag => {
        return fetchSongsByTag(tag)
    })
    return returnArr
}


module.exports = {
    fetchTags,
    tagsToPopulate,
    fetchSimilarSongs,
    searchForArtist,
    googleQuery,
    findSong,
    fetchSongsByTag
}




//TESTING THE FUNCTIONS

// const artist = 'don maclean'
// const song = "american pie"


// findSong('britney spear toxic')

// let googlePromise = googleQuery('brtny')
// googlePromise.then(result => console.log(result))


// searchForArtist(artist)
// .then(artists => {
//     console.log(artists)
// })

// let potentialMatches = []
// let tags = []


// let retrieveTagsPromise = fetchTags(artist, song, 4)


// let createdTagPromises

// let songsMatchedByTag = retrieveTagsPromise.then(tags => {
//     return tagsToPopulate(tags)
// })
// .then(tagPromises => {
//     return Promise.all(tagPromises)
// })
// .then(songs => {
//     potentialMatches = potentialMatches.concat(...songs)
//     return songs
// })


// songsMatchedByTag.then(songs => {
//     return fetchSimilarSongs(artist, song)
// })
// .then(moreMatches => {
//     potentialMatches = potentialMatches.concat(moreMatches)
//     return potentialMatches
// })
// .then(potentialMatches => {
//     return potentialMatches.map(song => {
//         return fetchTags(song.artist, song.name, 10)
//         .then(tags => {
//             song.tagsArr = tags
//             return song
//         })
//     })
// })
// .then(songsPromises => {
//     return Promise.all(songsPromises)
// })
// .then(songs => {
//     potentialMatches = songs
//     console.log(potentialMatches)
//     return potentialMatches
// })




