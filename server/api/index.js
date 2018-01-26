const router = require('express').Router()
module.exports = router

router.use('/songTags', require('./songTags'))

router.use('/playlist', require('./playlist'))

router.use('/songs', require('./songs'))

router.use('/spotifyAuth', require('./spotifyAuth'))

router.use('/export', require('./export'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
