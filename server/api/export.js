const router = require('express').Router()
const request = require('request'); // "Request" library

router.get('/', (req, res, next) => {
  console.log(req.query);
})


module.exports = router