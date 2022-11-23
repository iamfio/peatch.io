const User = require("../models/User.model");
const Peatch = require("../models/Peatch.model");

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
  const { topic, description } = req.body;
  const user = req.session.user;

  try {
    const peatch = await Peatch.create({
      topic,
      description,
      owner: user,
      members: [user],
    });

    res.redirect(`/peatches/${peatch.id}`);
  } catch (err) {
    // console.log(err.message)
    next(err.message);
  }
});

router.post("/:peatchId/vote", async (req, res, next) => {
  const { peatchId } = req.params;

  try {
    const peatch = await Peatch.findById({ _id: peatchId });
    const proposals = peatch.proposals;

    res.json({
      proposals,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:peatchId/add", async (req, res, next) => {
  const { peatchId } = req.params;
  const { text } = req.body;

  try {
    await Peatch.findOneAndUpdate(
      { _id: peatchId },
      {
        $push: {
          proposals: {
            text,
            creator: req.session.user,
          },
        },
      },
      { new: true }
    );

    res.redirect(`/peatches/${peatchId}`);
  } catch (err) {
    next(err);
  }
});

router.get("/:peatchId", async (req, res, next) => {
  const { peatchId } = req.params;

  try {
    const { topic, description, owner, members, proposals } = await Peatch.findById({ _id: peatchId })
      .populate(["owner", "members", "proposals", "proposals.creator"])
      .lean();

    res.render("peatches/peatch", {
      peatchId,
      topic,
      description,
      owner,
      members,
      proposals,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:peatchId/invite", async (req, res, next) => {
  const { peatchId } = req.params;

  try {
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
    if (!username) {
      res.render("peatches/invite", {
        peatchId,
        errorMessage: "please provide valid username",
      });
    }
    const user = await User.findOne({ username });

    if (!user) {
      res.render("peatches/invite", {
        peatchId,
        errorMessage: "user does not exist",
      });
    }
    const peatch = await Peatch.findOne({ _id: peatchId }).populate("members");
    const inMembers = peatch.members.find((member) => member.username === user.username);

    if (inMembers?.username !== user?.username) {
      peatch.update({ $push: { members: user } }).exec();
      res.redirect(`/peatches/${peatchId}`);
    } else {
      res.render("peatches/invite", {
        peatchId,
        errorMessage: "User is already on the list",
      });
    }
  } catch (err) {
    next(err);
  }
});

// Reject user from current Peatch
router.post("/:peatchId/reject-user/:username", async (req, res, next) => {
  const { peatchId, username } = req.params;

  res.json({ message: "user successfully rejected from current peatch" });
});

module.exports = router;
