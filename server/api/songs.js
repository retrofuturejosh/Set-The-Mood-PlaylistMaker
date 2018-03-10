const router = require("express").Router();
const fetchTags = require("./APIFuncs").fetchTags;
const findSong = require("./APIFuncs").findSong;

module.exports = router;

router.get("/find/:searchTerm", (req, res, next) => {
  let searchTerm = req.params.searchTerm;
  findSong(searchTerm)
    .then(options => {
      res.json(options);
    })
    .catch(err => console.log(err));
});
