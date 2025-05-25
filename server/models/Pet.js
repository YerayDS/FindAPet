import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: String,
  age: Number,
  description: String,
  imageUrl: String
}, {
  timestamps: true
});

export const Pet = mongoose.model("Pet", petSchema);
