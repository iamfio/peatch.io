const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    layout: "startpage",
    isIndex: true,
    user: req.session.user,
  });
});

module.exports = router;
