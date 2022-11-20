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
      address: { street, houseNr, city, zipCode, country },
    },
  } = user;

  res.render("user/profile", {
    username,
    email,
    profile: {
      firstName,
      lastName,
      userpic,
      address: { street, houseNr, city, zipCode, country },
    },
  });
});

router.post("/:username/profile", async (req, res, next) => {
  const { username } = req.params;
  const { email, firstName, lastName, userpic, street, houseNr, city, zipCode, country } = req.body;

  try {
    req.session.user = await User.findOneAndUpdate(
      { username },
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
            country,
          },
        },
      },
      {
        new: true,
      }
    );

    res.status(201).redirect("back");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
