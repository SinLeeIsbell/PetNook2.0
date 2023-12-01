import dotenv from "dotenv";
import express from "express";
import es6 from "express-es6-template-engine";
import session from "express-session";
import bcrypt from "bcrypt";
import { Pets } from "./models/petsModels.mjs";

import multer from "multer";
import morgan from "morgan";
import sharp from "sharp";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();
const upload = multer({ storage });
dotenv.config();

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
  try {
    const pets = await Pets.find({});
    res.render("home", {
      locals: {
        pets,
      },
      partials: {
        nav: "partials/nav",
        mobilenav: "partials/mobilenav",
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post("/pet/new/meir", async (req, res) => {
  const { name, weight, age, gender, type, bio } = req.body;
  try {
    const newPet = {
      name,
      weight,
      age,
      gender,
      type,
      bio,
      isAdopted: false,
    };
    const pet = await Pets.create(newPet);
    return res.status(201).send(pet);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post("/pet/new/meir", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
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

//   : [
//     {
//       id: 1,
//       name: "Buddy",
//       age: "Young",
//       gender: "Male",
//       type: "Dog",
//       imageURL: "buddy.jpg",
//     },
//     {
//       id: 2,
//       name: "Whiskers",
//       age: "Adult",
//       gender: "Female",
//       type: "Cat",
//       imageURL: "whiskers.jpg",
//     },
//     {
//       id: 3,
//       name: "Rocky",
//       age: "Senior",
//       gender: "Male",
//       type: "Dog",
//       imageURL: "rocky.jpg",
//     },
//     {
//       id: 4,
//       name: "Luna",
//       age: "Young",
//       gender: "Female",
//       type: "Dog",
//       imageURL: "luna.jpg",
//     },
//   ],
