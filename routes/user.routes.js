const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();

const User = require("../models/User.model");

router.get("/:username", (req, res, next) => {
  res.render("user/dashboard", {
    user: req.session.user,
  });
});

router.get("/:username/profile", async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  const {
    email,
    profile: {
      firstName,
      lastName,
      userpic,
      address: { street, houseNr, city, zipCode, contry },
    },
  } = user;

  res.render("user/profile", {
    username,
    email,
    profile: {
      firstName,
      lastName,
      userpic,
      address: { street, houseNr, city, zipCode, contry },
    },
  });
});

router.post("/:username/profile", async (req, res, next) => {
  const { email, firstName, lastName, userpic, street, houseNr, city, zipCode, contry } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username: req.session.user.username },
      {
        email,
        profile: {
          firstName,
          lastName,
          userpic,
          address: {
            street,
            houseNr,
            city,
            zipCode,
            contry,
          },
        },
      },
      {
        new: true,
      }
    );
    req.session.user = user;
    res.status(201).redirect("back");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
