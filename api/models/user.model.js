import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false, // Normal users are not admins
    },
    isDoctor: {
      type: Boolean,
      default: false, // Normal users are not doctors
    },
    age: {
      type: Number, // Age is an optional number field
    },
    weight: {
      type: Number, // Weight is an optional number field (in kg or lbs, as you prefer)
    },
    height: {
      type: Number, // Height is an optional number field (in cm, meters, or feet)
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
