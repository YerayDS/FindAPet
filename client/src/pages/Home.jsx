import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Pawfect Match 🐾</h1>
      <p className="text-lg mb-6">
        Helping pets find loving homes. Browse available pets or learn about our adoption process.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/pets" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Pets
        </Link>
        <Link to="/about" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          About Adoption
        </Link>
      </div>
    </div>
  );
}
