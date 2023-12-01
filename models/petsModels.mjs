import mongoose from "mongoose";

const petsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pics: {
      type: String,
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    isAdopted: {
      type: Boolean,
    },
    ownerId: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Pets = mongoose.model("Pets", petsSchema);
