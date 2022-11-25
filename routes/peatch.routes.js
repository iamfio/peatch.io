const router = require("express").Router();

const User = require("../models/User.model");
const Peatch = require("../models/Peatch.model");
const mongoose = require("mongoose");

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

    await User.findByIdAndUpdate({ _id: user._id }, { $push: { peatches: peatch } });

    res.redirect(`/peatches/${peatch.id}`);
  } catch (err) {
    next(err.message);
  }
});

router.post("/:peatchId/vote", async (req, res, next) => {
  const { peatchId } = req.params;
  const { votes } = req.body;
  const sessionUser = req.session.user;

  try {
    const user = await User.findById({ _id: sessionUser._id }).populate(["votedFor"]);
    const peatch = await Peatch.findById({ _id: peatchId }).populate([
      "proposals",
      "proposals.votedBy",
      "proposals._id",
    ]);
    const proposals = peatch.proposals;

    proposals.forEach((prop) => {
      const userIdsVotedForThisProposal = prop.votedBy.map((el) => el._id.toString());

      if (votes?.includes(prop._id.toString())) {
        if (!userIdsVotedForThisProposal.includes(sessionUser._id)) {
          prop.votedBy.push(sessionUser);
          user.votedFor.push(prop);
        }
      }

      if (prop.votedBy.length > 0) {
        prop.votes = prop.votedBy.length;
      }
    });

    user.save();
    peatch.save();

    res.redirect(`/peatches/${peatch.id}`);
  } catch (err) {
    next(err.message);
  }
});

router.post("/:peatchId/add", async (req, res, next) => {
  const { peatchId } = req.params;
  const { text } = req.body;

  if (text.length === 0) {
    res.render("peatches/peatch", {
      errorMessage: "please enter your proposal",
    });
  }

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
  const currentUser = req.session.user;

  try {
    const { topic, description, owner, members, proposals } = await Peatch.findById({ _id: peatchId })
      // .populate(["owner", "members", ])
      .populate(["owner", "members", "proposals", "proposals.creator"])
      .lean();

    res.render("peatches/peatch", {
      currentUser,
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
      peatch.updateOne({ $push: { members: user } }).exec();
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
