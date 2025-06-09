import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["adopt", "give_for_adoption"], required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
