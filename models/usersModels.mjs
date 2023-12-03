import mongoose from "mongoose";

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    foster: {
        type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);

export const Users = mongoose.model("Users", usersSchema);
