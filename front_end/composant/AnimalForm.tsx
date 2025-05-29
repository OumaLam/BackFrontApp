"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaSignature,
  FaVenusMars,
  FaListAlt,
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import { PlusCircle } from "lucide-react";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);

const AnimalForm = ({ onAnimalAdded }) => {
  const [formData, setFormData] = useState({
    idAnimal: "",
    sexe: "",
    race: "",
    dateNaissance: "",
    poids: "",
    dateMesure: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      idAnimal: formData.idAnimal,
      sexe: formData.sexe,
      race: formData.race,
      dateNaissance: formData.dateNaissance,
      poids: [
        {
          poids: formData.poids,
          dateMesure: formData.dateMesure,
        },
      ],
    };

    try {
      await axios.post("http://localhost:8080/api/animal/new", dto, {
        withCredentials: true,
      });
      toast.success("✅ Animal enregistré avec succès !");
      setFormData({
        idAnimal: "",
        sexe: "",
        race: "",
        dateNaissance: "",
        poids: "",
        dateMesure: "",
      });

      if (onAnimalAdded) onAnimalAdded(dto);
    } catch (error) {
      toast.error("❌ Une erreur s'est produite !");
      console.error("Erreur :", error);
    }
  };

  return (
    <>
      <Toaster />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[500px] mx-auto p-4 space-y-6"
      >
        <h3 className="flex justify-center items-center gap-3 text-2xl font-bold text-[#2d775c] drop-shadow">
          <GiCow className="text-3xl" />
          Enregistrement d'un animal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID Animal */}
          <div>
            <label htmlFor="idAnimal" className="text-sm font-medium text-[#2d775c] mb-1 block">
              N° Animal
            </label>
            <InputWrapper icon={<FaSignature />}>
              <input
                type="text"
                name="idAnimal"
                id="idAnimal"
                value={formData.idAnimal}
                onChange={handleChange}
                required
                placeholder="Ex : A12345"
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
            </InputWrapper>
          </div>

          {/* Sexe */}
          <div>
            <label htmlFor="sexe" className="text-sm font-medium text-[#2d775c] mb-1 block">
              Sexe
            </label>
            <InputWrapper icon={<FaVenusMars />}>
              <select
                name="sexe"
                id="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              >
                <option value="">Sélectionnez</option>
                <option value="male">Mâle</option>
                <option value="femelle">Femelle</option>
              </select>
            </InputWrapper>
          </div>

          {/* Race */}
          <div>
            <label htmlFor="race" className="text-sm font-medium text-[#2d775c] mb-1 block">
              Race
            </label>
            <InputWrapper icon={<FaListAlt />}>
              <input
                type="text"
                name="race"
                id="race"
                value={formData.race}
                onChange={handleChange}
                required
                placeholder="Ex : Holstein"
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
            </InputWrapper>
          </div>

          {/* Date de naissance */}
          <div>
            <label htmlFor="dateNaissance" className="text-sm font-medium text-[#2d775c] mb-1 block">
              Date de naissance
            </label>
            <InputWrapper icon={<FaCalendarAlt />}>
              <input
                type="date"
                name="dateNaissance"
                id="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
            </InputWrapper>
          </div>

          {/* Poids */}
          <div>
            <label htmlFor="poids" className="text-sm font-medium text-[#2d775c] mb-1 block">
              Poids (kg)
            </label>
            <InputWrapper icon={<FaDumbbell />}>
              <input
                type="number"
                name="poids"
                id="poids"
                value={formData.poids}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                placeholder="Ex : 450"
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
            </InputWrapper>
          </div>

          {/* Date de mesure */}
          <div>
            <label htmlFor="dateMesure" className="text-sm font-medium text-[#2d775c] mb-1 block">
              Date de mesure
            </label>
            <InputWrapper icon={<FaCalendarAlt />}>
              <input
                type="date"
                name="dateMesure"
                id="dateMesure"
                value={formData.dateMesure}
                onChange={handleChange}
                required
                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
            </InputWrapper>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
          className="flex items-center gap-2 bg-[#2d775c] hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
          >
                     <PlusCircle size={20} /> Ajouter

          </button>
        </div>
      </motion.form>
    </>
  );
};

export default AnimalForm;
