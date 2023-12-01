const express = require("express");
const es6 = require("express-es6-template-engine");
const session = require("express-session");
const bcrypt = require("bcrypt");
// const { Users, Pets, Pending } = require("./models");
const multer = require("multer");
const morgan = require("morgan");
const sharp = require("sharp");
// const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.DB_PORT || 3000;

app.engine("html", es6);
app.set("views", "views");
app.set("view engine", "html");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
require("dotenv").config();

app.get("/", async (req, res) => {
  res.render("home", {
    locals: {
      pets: [
        {
          id: 1,
          name: "Buddy",
          age: "Young",
          gender: "Male",
          type: "Dog",
          imageURL: "buddy.jpg",
        },
        {
          id: 2,
          name: "Whiskers",
          age: "Adult",
          gender: "Female",
          type: "Cat",
          imageURL: "whiskers.jpg",
        },
        {
          id: 3,
          name: "Rocky",
          age: "Senior",
          gender: "Male",
          type: "Dog",
          imageURL: "rocky.jpg",
        },
        {
          id: 4,
          name: "Luna",
          age: "Young",
          gender: "Female",
          type: "Dog",
          imageURL: "luna.jpg",
        },
      ],
    },
    partials: {
      nav: "partials/nav",
      mobilenav: "partials/mobilenav",
    },
  });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
