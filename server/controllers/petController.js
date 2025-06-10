import Pet from "../models/Pet.js";

export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mascotas" });
  }
};

export const createPet = async (req, res) => {
  try {
    const petData = req.body;

    if (req.file) {
      petData.photo = `/uploads/${req.file.filename}`; // Ruta para frontend
    }

    const newPet = new Pet(petData);
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ error: "Error creating pet" });
  }
};

export const updatePet = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "give_for_adoption") {
      return res.status(403).json({ error: "No autorizado para actualizar mascota" });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPet) return res.status(404).json({ error: "Mascota no encontrada" });
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ error: "Mascota no encontrada" });
    res.json({ message: "Mascota eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};