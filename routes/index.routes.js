const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    layout: "startpage",
    isIndex: true
  });
});

module.exports = router;
