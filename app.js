require("dotenv").config();

const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const store = session.MemoryStore();

app.use(
  session({
    saveUninitialized: false,
    secret: process.env.KEY_SESSION,
    cookie: {
      maxAge: 1000 * 20,
    },
    resave: true,
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/status", (req, res) => {
  res.status(200).json({
    msg: "hello Hung",
  });
});

app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      data: {
        name: "Hung dz",
        msg: "Dang nhap thanh cong!",
      },
    });
  }
  res.status(200).json({
    data: {
      err: "Chua dang nhap thanh cong",
    },
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {
    try {
      res.json({
        data: res.body,
      });
    } catch (error) {
      res.json({
        err: error.stack,
      });
    }
  }
);

const user = {
  username: "minhung",
  password: "123456",
};

passport.use(
  new LocalStrategy((username, password, done) => {
    if (username === user.username && password === user.password) {
      return done(null, {
        username,
        password,
        active: true,
      });
    }
    done(null, false);
  })
);

passport.serializeUser((use, done) => done(null, user.username));
passport.deserializeUser((username, done) => {
  if (username === user.username) {
    return done(null, user.username);
  }
  done(null, false);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
