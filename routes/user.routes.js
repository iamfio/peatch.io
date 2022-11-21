const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();

const User = require("../models/User.model");
const { cloudinary, uploader } = require("../config/cloudinary");

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
      userpicPath,
      address: { street, houseNr, city, zipCode, country },
    },
  } = user;

  console.log(user.profile.userpicPath);

  res.render("user/profile", {
    username,
    email,
    profile: {
      firstName,
      lastName,
      userpicPath,
      address: { street, houseNr, city, zipCode, country },
    },
  });
});

router.post("/:username/profile", uploader.single("userpic"), async (req, res, next) => {
  const { username } = req.params;
  const { email, firstName, lastName, street, houseNr, city, zipCode, country } = req.body;
  const userpic = req.file.originalname;
  const userpicPath = req.file.path;
  const userpicPublicId = req.file.filename;

  cloudinary.image(userpic, { width: 300, height: 300, crop: "fill" });

  console.log(req.file);
  try {
    req.session.user = await User.findOneAndUpdate(
      { username },
      {
        email,
        profile: {
          firstName,
          lastName,
          userpic,
          userpicPath,
          userpicPublicId,
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
