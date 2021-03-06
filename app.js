require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
// const LocalStrategy = require("./configs/passport/local.strategy").Strategy;
// // const MongoStore = require("connect-mongo")(session);
// const bcrypt = require("bcryptjs");

// enables database connection
require("./configs/database/db.setup");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// use CORS to allow access to this API from the frontend application
// CORS -> Cross-Origin Resource Sharing
app.use(
  cors({
    credentials: true,
    // this is the port where our react app is running
    // array of domains we accept the cookies from
    origin: [
      "http://localhost:3000",
      "http://apis.berkeley.edu/coolclimate/footprint-defaults/"
    ]
    // origin: "*",
    // methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    // origin: (origin, cb) => {
    //   if (!origin) return cb(null, true);
    //   if (allowedOrigins.indexOf(origin) === -1) {
    //     let msg =
    //       "The CORS policy for this site does not allow access from the specified Origin.";
    //     return cb(new Error(msg), false);
    //   }
    //   return cb(null, true);
    // },
    // "Access-Control-Request-Headers": "*"
    // options: {
    //   Access-Control-Request-Method: "DELETE",
    //   Access-Control-Request-Headers: ["origin", "x-requested-with"],
    //   Origin: "*"
    // }
  })
);

// SESSION:
app.use(
  session({
    secret: "my-amazing-secret-blah",
    resave: true,
    saveUninitialized: true // don't save any sessions that doesn't have any data in them
  })
);

// 🚨🚨🚨 must come after the sessions 🚨🚨🚨
require("./configs/passport/passport.setup")(app);
app.use((req, res, next) => {
  console.log(
    "the req. user in app.js  ############################### ",
    req.user
  );
  next();
});

// ./configs/passport/local.strategy AND ./configs/passport/serializers are not needed cuz they r required in passport.setup;

//initialize passport and passport-sessions
// we already require it
// app.use(passport.initialize());
// app.use(passport.session());

// default value for title local
app.locals.title = "Make an Impact!";

//require routes:
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

app.use("/", require("./routes/categories.routes"));

app.use("/", require("./routes/act.routes"));

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
