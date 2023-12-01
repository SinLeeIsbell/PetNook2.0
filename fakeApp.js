require("dotenv").config();
const express = require("express");
const es6 = require("express-es6-template-engine");
const session = require("express-session");
const bcrypt = require("bcrypt");
// const { Users, Pets, Pending } = require("./models");
const multer = require("multer");
const morgan = require("morgan");
const sharp = require("sharp");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;
const BACKBLAZE_ID = process.env.BACKBLAZE_ID;
const BACKBLAZE_APP_KEY = process.env.BACKBLAZE_APP_KEY;

app.engine("html", es6);
app.set("views", "views");
app.set("view engine", "html");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

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

app.post("/pet/new/meir", upload.single("petPhoto"), async (req, res) => {
  const { name, weight, age, gender, type, bio } = req.body;

  const newPet = await Pets.create({
    name,
    weight,
    age,
    gender,
    type,
    bio,
    isAdopted: false,
    ownerId: req.session.user.id,
    pics: fileName,
  });
  res.json({ petId: newPet.id });
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("app connected to db");
    app.listen(PORT, () => {
      console.log(`Example app listening on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
