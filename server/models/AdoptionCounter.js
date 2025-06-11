import mongoose from "mongoose";

const adoptionCounterSchema = new mongoose.Schema({
  count: { type: Number, default: 10 },
});

const AdoptionCounter = mongoose.model("AdoptionCounter", adoptionCounterSchema);

export default AdoptionCounter;
