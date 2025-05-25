import React from "react";

export default function PetCard({ pet }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
      <img
        src={pet.imageUrl || "https://placekitten.com/300/200"}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold">{pet.name}</h3>
      <p className="text-gray-600">{pet.breed}</p>
      <p className="text-sm text-gray-500">{pet.age} years old</p>
      <p className="mt-2 text-sm">{pet.description}</p>
    </div>
  );
}
