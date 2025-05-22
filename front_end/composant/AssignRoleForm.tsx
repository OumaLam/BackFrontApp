"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const primaryColor = "#2d775c";

export const AssignRoleForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    cin: "",
    motDePasse: "",
    role: "ADMIN",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {


    e.preventDefault();
    try {
              const password = formData.motDePasse;
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

          if (!passwordRegex.test(password)) {
            toast.error(
              "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
            );
            return; // Stop l'envoi si la validation échoue
          }
      const response = await axios.post(
        "http://localhost:8080/api/employes/assign-role",
        formData,
        { withCredentials: true }
      );
      toast.success(response?.data);
      setFormData({ cin: "", motDePasse: "", role: "ADMIN" });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        "Erreur lors de l'attribution : " +
          (error.response?.data || error.message)
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: primaryColor }}
      >
        Attribuer un rôle à un employé
      </h2>

      <div className="mb-5">
        <label htmlFor="cin" className="block mb-2 font-semibold text-gray-700">
          CIN :
        </label>
        <input
          type="text"
          name="cin"
          id="cin"
          value={formData.cin}
          onChange={handleChange}
          required
          placeholder="Entrez le CIN"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="motDePasse"
          className="block mb-2 font-semibold text-gray-700"
        >
          Mot de passe :
        </label>
        <input
          type="password"
          name="motDePasse"
          id="motDePasse"
          value={formData.motDePasse}
          onChange={handleChange}
          required
          placeholder="Entrez le mot de passe"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="role"
          className="block mb-2 font-semibold text-gray-700"
        >
          Rôle :
        </label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="VETERINAIRE">VETERINAIRE</option>
          <option value="GESTIONNAIRE">GESTIONNAIRE</option>
        </select>
      </div>

      <button
        type="submit"
        style={{ backgroundColor: primaryColor }}
        className="w-full text-white py-3 rounded-lg font-semibold hover:brightness-90 transition"
      >
        Attribuer le rôle
      </button>
    </form>
  );
};
