import React, { useEffect, useState } from "react";
import { getAllPets } from "../services/petService";
import PetCard from "../components/PetCard";

export default function PetList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function fetchPets() {
      try {
        const data = await getAllPets();
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets", error);
      }
    }
    fetchPets();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">Available Pets for Adoption</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
