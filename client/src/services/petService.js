import api from "./api";

export async function getAllPets() {
  try {
    const response = await api.get("/pets");
    return response.data;
  } catch (error) {
    throw new Error("Could not fetch pets");
  }
}
