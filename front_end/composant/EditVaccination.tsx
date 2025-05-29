"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FaSyringe,
  FaVenusMars,
  FaStickyNote,
  FaSave,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);

const EditVaccinationForm = ({ id, onSuccess }) => {
  const [formData, setFormData] = useState({
    vaccinNom: "",
    cibleAgeJour: "",
    cibleAgeMois: "",
    cibleAgeAnnee: "",
    cibleSexe: "Tous",
    remarqueVaccination: "",
  });

  useEffect(() => {
    const fetchVaccination = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/vaccinations/${id}`, {
          withCredentials: true,
        });
        const data = res.data;
        const [annee, mois, jour] = data.cibleAge.split("_");
        setFormData({
          vaccinNom: data.vaccinNom,
          cibleAgeJour: jour || "",
          cibleAgeMois: mois || "",
          cibleAgeAnnee: annee || "",
          cibleSexe: data.cibleSexe,
          remarqueVaccination: data.remarqueVaccination || "",
        });
      } catch (error) {
        toast.error("❌ Erreur lors du chargement !");
        console.error("Erreur de chargement :", error);
      }
    };

    if (id) fetchVaccination();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cibleAge = `${formData.cibleAgeAnnee}_${formData.cibleAgeMois}_${formData.cibleAgeJour}`;

    const updatedData = {
      vaccinNom: formData.vaccinNom,
      cibleAge,
      cibleSexe: formData.cibleSexe,
      remarqueVaccination: formData.remarqueVaccination,
    };

    try {
      await axios.put(`http://localhost:8080/api/vaccinations/${id}`, updatedData, {
        withCredentials: true,
      });
      toast.success("✅ Vaccination modifiée !");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("❌ Erreur lors de la modification !");
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
        className="space-y-4 p-6 bg-white rounded-lg shadow-md "
      >
        <h3 className="flex justify-center items-center gap-2 text-xl font-bold text-[#2d775c]">
          <FaSyringe />
          Modifier une Vaccination
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Nom du vaccin</label>
            <InputWrapper icon={<FaSyringe />}>
              <input
                name="vaccinNom"
                value={formData.vaccinNom}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              />
            </InputWrapper>
          </div>

          <div>
            <label className="block mb-1 font-medium">Sexe cible</label>
            <InputWrapper icon={<FaVenusMars />}>
              <select
                name="cibleSexe"
                value={formData.cibleSexe}
                onChange={handleChange}
                required
                className="pl-10 pr-4 py-3 w-full border rounded-lg"
              >
                <option value="Tous">Tous</option>
                <option value="male">Mâle</option>
                <option value="femelle">Femelle</option>
              </select>
            </InputWrapper>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Âge cible</label>
          <div className="flex gap-2">
            {["Annee", "Mois", "Jour"].map((unit) => (
              <InputWrapper key={unit} icon={<MdChildCare />}>
                <input
                  type="number"
                  name={`cibleAge${unit}`}
                  value={formData[`cibleAge${unit}`]}
                  onChange={handleChange}
                  placeholder={unit.toLowerCase()}
                  className="pl-10 pr-4 py-3 w-full border rounded-lg"
                  required
                />
              </InputWrapper>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Remarques</label>
          <InputWrapper icon={<FaStickyNote />}>
            <textarea
              name="remarqueVaccination"
              value={formData.remarqueVaccination}
              onChange={handleChange}
              rows={3}
              className="pl-10 pr-4 py-3 w-full border rounded-lg"
            />
          </InputWrapper>
        </div>

        <button
          type="submit"
          className="w-[120] bg-[#2d775c] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition ml-43"
        >
          <FaSave className="inline mr-2" />
          Enregistrer
        </button>
      </motion.form>
    </>
  );
};

export default EditVaccinationForm;
