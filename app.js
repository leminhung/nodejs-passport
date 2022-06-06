require("dotenv").config({ path: "./configs/.env" });

const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");

const app = express();
const connectDB = require("./configs/database");
connectDB();

// Passport Config
require("./configs/passport")(passport);

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user.route");

const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  session({
    saveUninitialized: true,
    secret: process.env.KEY_SESSION,
    cookie: {
      maxAge: 1000 * 20,
    },
    resave: true,
  })
);

// init passport
app.use(passport.initialize());
// init passport with session
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
