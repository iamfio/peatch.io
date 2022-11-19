const router = require("express").Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  res.render("user/dashboard", {
    user: req.session.user
  });
});

module.exports = router;
