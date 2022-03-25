import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    age: Number,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
