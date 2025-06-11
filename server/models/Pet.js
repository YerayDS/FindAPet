import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    province: { type: String, required: true },
    photo: { type: String },

    vaccinated: { type: Boolean, default: false },
    microchip: { type: Boolean, default: false },
    dewormed: { type: Boolean, default: false },
    healthy: { type: Boolean, default: false },

    about: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", PetSchema);
export default Pet;
