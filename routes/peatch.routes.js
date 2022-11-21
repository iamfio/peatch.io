const Peatch = require("../models/Peatch.models");
const User = require("../models/User.model");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const peaches = await Peatch.find().populate("owner").lean();

    console.log(peaches);

    res.render("peatches/index", {
      peaches,
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

  console.log("peatchID: ", peatchId);

  try {
    const peatch = await Peatch.findOne({ _id: peatchId });
    console.log(peatch);

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

    console.log(user);

    res.redirect(`/peatches/${peatchId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
