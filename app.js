// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();
const isLoggedIn = require("./middleware/isLoggedIn");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "peatch.io";

app.locals.appTitle = projectName;

require("./config/session.config")(app);

// 👇 Start handling routes here
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/auth.routes"));
app.use("/", isLoggedIn, require("./routes/user.routes"));

app.use((req, res, next) => {
  res.locals.errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  next();
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
