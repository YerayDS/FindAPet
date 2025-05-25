import React from "react";

export default function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4">About the Adoption Process</h2>
      <p className="mb-4">
        We believe every pet deserves a loving home. Our adoption process is simple, transparent, and aims to ensure the best match between pets and adopters.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Browse available pets.</li>
        <li>Create an account and apply for adoption.</li>
        <li>The shelter will review your application and contact you.</li>
        <li>After approval, you'll be able to meet your future companion!</li>
      </ul>
    </div>
  );
}
