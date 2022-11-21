// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// ℹ️ Session middleware for authentication
// https://www.npmjs.com/package/express-session
const session = require("express-session");

// ℹ️ MongoStore in order to save the user session in the database
// https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo");

const handlebars = require("express-handlebars");

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.engine(
    "hbs",
    handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
    })
  );

  app.set("views", path.join(__dirname, "../views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  // Handles access to the public folder
  // app.use("/:username", express.static(path.join(__dirname, "..", "/public")))
  app.use(express.static(path.join(__dirname, "..", "/public")));
  app.use("/:username/profile", express.static(path.join(__dirname, "..", "/public")))
  app.use("/peatches", express.static(path.join(__dirname, "..", "/public")))
  
  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));

  // disables ETag in order to provide HTTP 200 after serving page after reload
  app.disable("etag");
};
