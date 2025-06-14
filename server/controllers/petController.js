import Pet from "../models/Pet.js";

export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mascotas" });
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

export const createPet = async (req, res) => {
  try {
    const petData = req.body;

    if (req.file) {
      petData.photo = `/uploads/${req.file.filename}`; 
    }

    const newPet = new Pet({
      ...petData,
      owner: req.user.id, 
    });

    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ error: "Error creando mascota" });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

    if (!req.user || pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para editar esta mascota" });
    }

    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`;
    }

    Object.assign(pet, req.body);
    await pet.save();

    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

    if (!req.user || pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para eliminar esta mascota" });
    }

    await pet.deleteOne();
    res.json({ message: "Mascota eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
