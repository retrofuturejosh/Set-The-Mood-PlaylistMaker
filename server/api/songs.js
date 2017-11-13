const router = require('express').Router()
const fetchTags = require('./starting').fetchTags
const findSong = require('./starting').findSong

module.exports = router

router.get('/', (req, res, next) => {
    if (req.query.tags) {
        fetchTags(req.query.artist, req.query.song, req.query.num)
        .then(tags => {
            if (!tags.length) tags = ['NOT FOUND']
            console.log('TAGS ARE ', tags)
            res.json(tags)
        })
        .catch(next)
    } else res.json(['NOT FOUND'])
})

router.get('/find/:searchTerm', (req, res, next) => {
    let searchTerm = req.params.searchTerm
    findSong(searchTerm)
    .then(options => {
        console.log('OPTIONS ARE ', options)
        res.json(options)
    })
    .catch(err => console.log(err))
})