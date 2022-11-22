const { isAdmin } = require("../middleware");
const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    layout: "startpage",
    isIndex: true,
    user: req.session.user,
  });
});

router.get("/admin", isAdmin, async (req, res, next) => {
  try {
    const users = await User.find().lean();

    res.render("admin/index", {
      users,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
