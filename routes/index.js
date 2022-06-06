const express = require("express");
const router = express.Router();

const {
  forwardAuthenticated,
  ensureAuthenticated,
} = require("../configs/auth");

router.get("/", forwardAuthenticated, (req, res, next) => {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  res.render("dashboard", {
    user: req.user,
  });
});

module.exports = router;
