const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load User model
const User = require("../models/User.model");
const { forwardAuthenticated } = require("../configs/auth");

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  const errors = [];
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all field!" });
  }

  if (password != password2) {
    errors.push({ msg: "Password do not match!" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at lease 6 characters!" });
  }

  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    errors.push({ msg: "Account already exist!" });
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }

  const newUser = new User({ name, email, password });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then((user) => {
          req.flash("success_msg", "You are now registered and can log in");
          res.redirect("/users/login");
        })
        .catch((err) => console.log(err));
    });
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You are now logged out");
  res.redirect("/users/login");
});

module.exports = router;
