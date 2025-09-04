const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
   res.render("auth/sign-in.ejs")
});

router.get("/sign-out", (req, res) => {
   req.session.destroy();
   res.redirect("/");
})

router.post("/sign-up", async (req, res) => {
  let { username, password, confirmPassword } = req.body;

  //check if user exists
  const userExists = await User.findOne({ username: username })

  if (userExists) {
    return res.status(400).send("user already exists")
  }

  //check if passwords match
  if (password !== confirmPassword){
   return res.status(400).send("Passwords didn't match, pease try again")
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  password = hashedPassword;

  //create user
  const user = await User.create({username, password});
  res.status(200).redirect("/auth/sign-in")

});

router.post("/sign-in", async (req, res) => {
   let { username, password } = req.body;
   if (!userExists) {
      return res.status(400).send("This user does not exist! Please try again or sign up.")
   }

   //Check password
   const validPassword = bcrypt.compareSync(password, userExists.password)

   if (!validPassword) {
      return res.status(400).send("Incorrect password, try again")
   }

   //Create session
   req.session.user = {
      username: username
   }
   res.redirect("/");
})

module.exports = router;
