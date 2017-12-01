const router = require('express').Router()
module.exports = router

router.use('/songs', require('./songs'))

router.use('/playlist', require('./playlist'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
