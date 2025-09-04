const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");


// Controllers
const authRouter = require("./controllers/auth.js");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
//handle sessions- creates cookie, looks for cookie
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false, 
      saveUninitialized: true,
   })
)

//Auth routes
app.use("/auth", authRouter);

// GET routes
app.get("/", async (req, res) => {
   res.render("index.ejs")
   user: req.session.user
})

//VIP route to test route protection
app.get("/vip", (req, res) => {
   //if user exists in session, we can access the route
   if (req.session.user) {
      return res.send("you've got access")
   } else {
      //if user doesn't exist, no access
      res.send("This user doesn't have access")
   }
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
