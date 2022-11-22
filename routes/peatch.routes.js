const Peatch = require("../models/Peatch.model");
const User = require("../models/User.model");

const router = require("express").Router();

const { isLoggedIn, isLoggedOut } = require("../middleware");

router.get("/", async (req, res, next) => {
  try {
    const currentUser = req.session.user;

    const peatches = await Peatch.find().where({ members: currentUser._id }).populate(["owner", "members"]).lean();

    res.render("peatches/index", {
      peatches,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/new", (req, res) => {
  res.render("peatches/new", {
    isActive: true,
  });
});

router.post("/new", async (req, res, next) => {
  const userId = req.session.user._id;
  const { topic, description } = req.body;

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
    const { topic, description, owner, members } = await Peatch.findOne({ _id: peatchId })
      .populate(["owner", "members"])
      .lean();

    res.render("peatches/peatch", {
      peatchId,
      topic,
      description,
      owner,
      members,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:peatchId/invite", async (req, res, next) => {
  const { peatchId } = req.params;

  try {
    const peatch = await Peatch.findOne({ _id: peatchId });

    res.render("peatches/invite", {
      peatchId,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:peatchId/invite", async (req, res, next) => {
  const { peatchId } = req.params;
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    await Peatch.findByIdAndUpdate({ _id: peatchId }, { $push: { members: user } }, { new: true });

    res.redirect(`/peatches/${peatchId}`);
  } catch (err) {
    next(err);
  }
});

router.post("/:peatchesId/add", async (req, res, next) => {});

// Reject user from current Peatch
router.post("/:peatchId/reject-user/:username", async (req, res, next) => {
  const { peatchId, username } = req.params;

  res.json({ message: "user successfully rejected from current peatch" });
});

module.exports = router;
