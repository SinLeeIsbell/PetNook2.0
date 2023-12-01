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

app.post("/pet/new", upload.single("petPhoto"), async (req, res) => {
  const { name, weight, age, gender, type, bio } = req.body;

  const timestamp = Date.now().toString();
  const fileName = `pets/${timestamp}-${uuidv4()}.jpg`;

  const resizedImage = await sharp(req.file.buffer)
    .resize(614, 874)
    .jpeg({ quality: 70 }) //compression
    .toBuffer();

  const params = {
    Bucket: "pet-images-dc",
    Key: fileName,
    Body: req.file.buffer,
  };

  const s3Response = await s3.upload(params).promise();

  // const imageUrl = s3Response.Location;

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

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
