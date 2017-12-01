const router = require('express').Router()
const fetchTags = require('./starting').fetchTags

module.exports = router

router.get('/', (req, res, next) => {
    if (req.query.tags) {
        fetchTags(req.query.artist, req.query.song, req.query.num)
        .then(tags => {
            res.json(tags)
        })
        .catch(next)
    }
})