"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaSyringe,
  FaVenusMars,
  FaStickyNote,
  FaPlus,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import { PlusCircle } from "lucide-react";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);

const VaccinationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    vaccinNom: "",
    cibleAgeJour: "",
    cibleAgeMois: "",
    cibleAgeAnnee: "",
    cibleSexe: "Tous",
    remarqueVaccination: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cibleAge = `${formData.cibleAgeAnnee}_${formData.cibleAgeMois}_${formData.cibleAgeJour}`;

    const dto = {
      vaccinNom: formData.vaccinNom,
      cibleAge,
      cibleSexe: formData.cibleSexe,
      remarqueVaccination: formData.remarqueVaccination,
    };

    try {
      await axios.post("http://localhost:8080/api/vaccinations/new", dto, { withCredentials: true });
      toast.success("✅ Vaccination ajoutée avec succès !");
      setFormData({
        vaccinNom: "",
        cibleAgeJour: "",
        cibleAgeMois: "",
        cibleAgeAnnee: "",
        cibleSexe: "Tous",
        remarqueVaccination: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("❌ Une erreur est survenue !");
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <Toaster />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto  p-6 rounded-lg space-y-4 "
      >
        <h3 className="flex items-center justify-center gap-2 text-xl font-semibold text-green-700">
          <FaSyringe className="text-green-600" />
          Ajouter une vaccination
        </h3>

        <div>
          <label htmlFor="vaccinNom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du vaccin
          </label>
          <InputWrapper icon={<FaSyringe />}>
            <input
              id="vaccinNom"
              name="vaccinNom"
              type="text"
              value={formData.vaccinNom}
              onChange={handleChange}
              required
              placeholder="Ex: Vaccin antirabique"
              className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </InputWrapper>
        </div>

        <div>
          <label htmlFor="cibleSexe" className="block text-sm font-medium text-gray-700 mb-1">
            Sexe cible
          </label>
          <InputWrapper icon={<FaVenusMars />}>
            <select
              id="cibleSexe"
              name="cibleSexe"
              value={formData.cibleSexe}
              onChange={handleChange}
              required
              className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Tous">Tous</option>
                <option value="male">Mâle</option>
                <option value="femelle">Femelle</option>
            </select>
          </InputWrapper>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Âge cible</label>
          <div className="flex gap-3">
            {["cibleAgeAnnee", "cibleAgeMois", "cibleAgeJour"].map((field, i) => (
              <InputWrapper key={field} icon={<MdChildCare />}>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={["Année", "Mois", "Jour"][i]}
                  min="0"
                  className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </InputWrapper>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="remarqueVaccination" className="block text-sm font-medium text-gray-700 mb-1">
            Remarques
          </label>
          <InputWrapper icon={<FaStickyNote />}>
            <textarea
              id="remarqueVaccination"
              name="remarqueVaccination"
              value={formData.remarqueVaccination}
              onChange={handleChange}
              rows={3}
              placeholder="Ajouter une remarque..."
              className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </InputWrapper>
        </div>

        <button
          type="submit"
        className="w-full pl-34 flex items-center  "
        >
          <div className="w-[120] cursor-pointer flex items-center justify-center bg-[#2d775c] text-center hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition">
                    <PlusCircle size={20} /> Ajouter
           
          </div>
        </button>
        
      </motion.form>
    </>
  );
};

export default VaccinationForm;
