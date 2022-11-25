const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup", {
    layout: "startpage",
    isSignup: true,
  });
});

// POST /auth/signup
router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage: "please, fill out all forms",
      layout: "startpage",
    });
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "password must contain 6 or more signs",
      layout: "startpage",
    });
  }

  //   ! This regular expression checks password for special characters and minimum length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }
  */

  // Create a new user - start by hashing the password
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    // const user = await User.create({ username, email, passwordHash });

    req.session.user = await User.create({ username, email, passwordHash });
    req.session.isAuthenticated = true;

    res.redirect(`/${username}`);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { 
        errorMessage: err.message, 
        layout: "startpage" 
      });
    } else if (err.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage: "username is already taken.",
        layout: "startpage",
      });
    } else {
      console.log(err);
      next(err);
    }
    // next(err)
  }
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", {
    layout: "startpage",
    isLogin: true,
  });
});

// POST /auth/login
router.post("/login", isLoggedOut, async (req, res, next) => {
  const { email, password } = req.body;

  // Check that username, email, and password are provided
  if (email === "" || password === "") {
    return res.status(400).render("auth/login", {
      errorMessage: "All fields are mandatory.",
      layout: "startpage",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "wrong password length",
      layout: "startpage",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (null === user) {
      return res.render("auth/login", {
        errorMessage: "user does not exists",
        layout: "startpage",
      });
    }

    const isValidatedUser = bcrypt.compareSync(password, user.passwordHash);

    if (isValidatedUser) {
      req.session.user = user.toObject();
      // Remove the password field
      delete req.session.user.password;

      // return res.redirect(`/${user.username}`);
      return res.redirect(`/peatches`);
    } else {
      console.log("wrong password");
      req.session.user = user.toObject();
      // Remove the password field
      delete req.session.user.password;

      return res.status(400).render("auth/login", {
        errorMessage: "Wrong credentials.",
        layout: "startpage",
      });
      // res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
