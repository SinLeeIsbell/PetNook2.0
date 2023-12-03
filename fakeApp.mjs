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
  const { name, age, gender, type } = req.query;
  const filter = { isAdopted: false };

  if (name) {
    filter.name = name;
  }

  if (age && age !== "all") {
    filter.age = age;
  }

  if (gender && gender !== "all") {
    filter.gender = gender;
  }

  if (type && type !== "all") {
    filter.type = type;
  }
  try {
    const pets = await Pets.find(filter, ["name", "gender", "age"]);
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

  if (!name || !weight || !age || !gender || !type) {
    return res.status(400).send({ message: "Required fields missing" });
  }

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
    return res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//add check if foster and get their ID
app.get("/rehome", (req, res) => {
  res.render("fake-rehome", {
    partials: {
      nav: "partials/nav",
      mobilenav: "partials/mobilenav",
    },
  });
});

// run check auth before going here
app.get("/profile/pet/:id", async (req, res) => {
    const { id } = req.params;
    const pet = await Pets.findOne({
      _id: id,
    });
    // pet.imageURL = `https://pet-images-dc.s3.amazonaws.com/${pet.pics}`;

    res.render("pet-profile", {
      locals: {
        pet,
      },
      partials: {
        nav: "partials/nav",
        mobilenav: "partials/mobilenav",
      },
    });
  });

  app.get("/contact/pet/:id", async (req, res) => {
      const { id } = req.params;
    
      const pet = await Pets.findOne({ _id: id }).select("name");

    
      res.render("contact", {
        locals: {
          petId: id,
          pet,
        },
        partials: {
          nav: "partials/nav",
          mobilenav: "partials/mobilenav",
        },
      });
    });

//filter brings you back to home page
app.get("/adopted", async (req, res) => {
  const { name, age, gender } = req.query;
  const filter = { isAdopted: true };

  if (name) {
    filter.name = name;
  }

  if (age && age !== "all") {
    filter.age = age;
  }

  if (gender && gender !== "all") {
    filter.gender = gender;
  }
  try {
    const pets = await Pets.find(filter, ["name", "gender", "age"]);
    res.render("recently-adopted", {
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
