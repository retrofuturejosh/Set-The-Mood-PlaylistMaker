const router = require("express").Router();
const fetchTags = require("./APIFuncs").fetchTags;
const findSong = require("./APIFuncs").findSong;

module.exports = router;

router.get("/", (req, res, next) => {
  if (req.query.tags) {
    fetchTags(req.query.artist, req.query.song, req.query.num)
      .then(tags => {
        if (!tags.length) tags = ["NOT FOUND"];
        res.json(tags);
      })
      .catch(next);
  } else res.json(["NOT FOUND"]);
});
