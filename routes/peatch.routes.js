const Peatch = require("../models/Peatch.models");
const User = require("../models/User.model");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("peatches/index", {
    isDashboard: true,
  });
});

router.get("/new", (req, res) => {
  res.render("peatches/new", {
    isActive: true,
  });
});

router.post("/new", async (req, res, next) => {
  const userId = req.session.user._id;
  const { topic, description } = req.body;

  console.log({ topic, description, userId });

  try {
    const user = await User.findById({ _id: userId });

    const peatch = await Peatch.create({
      topic,
      description,
      owner: user,
      members: [user],
    });

    res.redirect(`/peatches/${peatch.id}`);
  } catch (err) {
    next(err);
  }
});

router.get("/:peatchId", async (req, res, next) => {
  const { peatchId } = req.params;

  try {
    const { topic, description, owner, members } = await Peatch.findOne({ _id: peatchId }).populate("owner").lean();

    res.render("peatches/peatch", {
      topic,
      description,
      owner,
      members,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
