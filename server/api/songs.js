const router = require('express').Router()
const fetchTags = require('./starting').fetchTags

module.exports = router

router.get('/', (req, res, next) => {
    console.log('!!!!!! REQ QUERY IS ', req.query)
  fetchTags(req.query.artist, req.query.song, req.query.num)
    .then(tags => {
        console.log('TAGS ARE ', tags)
        res.json(tags)
    })
    .catch(next)
})