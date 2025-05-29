"use client";
import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSignature,
  FaVenusMars,
  FaListAlt,
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";

const InputWrapper = ({ icon, children }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </div>
    {children}
  </div>
);

export default function AnimalEditDialog({ animal, isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    idAnimal: animal?.idAnimal || "",
    sexe: animal?.sexe || "",
    race: animal?.race || "",
    dateNaissance: animal?.dateNaissance || "",
    statutTitre: animal?.statut?.statutTitre || "",
    dateStatut: animal?.statut?.dateStatut || "",
    prix: animal?.statut?.prix || "",
  
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      idAnimal: formData.idAnimal,
      sexe: formData.sexe,
      race: formData.race,
      dateNaissance: formData.dateNaissance,
      statut:
        formData.statutTitre === "nee"
          ? null
          : {
              statutTitre: formData.statutTitre,
              dateStatut: formData.dateStatut,
              prix: ["vendu", "achete"].includes(formData.statutTitre)
                ? formData.prix
                : null,
              cause: null,
            },
          };

    try {
      await axios.put("http://localhost:8080/api/animal/update", dto, {
        withCredentials: true,
      });

      toast.success("Animal modifié avec succès !");
      handleClose();

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error) {
      toast.error("Erreur lors de la modification !");
      console.error("Erreur :", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Toaster />
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="flex justify-center items-center gap-2 text-3xl font-extrabold text-green-700 mb-6">
                    <GiCow className="text-4xl" />
                    Modifier l’animal
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Identifiant</label>
                      <InputWrapper icon={<FaSignature />}>
                        <input
                          name="idAnimal"
                          value={formData.idAnimal}
                          onChange={handleChange}
                          disabled
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-100 text-sm"
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block  ">Sexe</label>
                      <InputWrapper icon={<FaVenusMars />}>
                        <select
                          name="sexe"
                          value={formData.sexe}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-50 text-sm"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="male">Mâle</option>
                          <option value="femelle">Femelle</option>
                        </select>
                      </InputWrapper>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Race</label>
                      <InputWrapper icon={<FaListAlt />}>
                        <input
                          name="race"
                          value={formData.race}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm"
                          required
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Date de naissance</label>
                      <InputWrapper icon={<FaCalendarAlt />}>
                        <input
                          type="date"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm"
                          required
                        />
                      </InputWrapper>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Statut</label>
                      <InputWrapper icon={<FaListAlt />}>
                        <select
                          name="statutTitre"
                          value={formData.statutTitre}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="vendu">Vendu</option>
                          <option value="abattu">Abattu</option>
                          <option value="mort">Mort</option>
                        </select>
                      </InputWrapper>
                    </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Date du statut</label>
                        <InputWrapper icon={<FaCalendarAlt />}>
                          <input
                            type="date"
                            name="dateStatut"
                            value={formData.dateStatut}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm"
                          />
                        </InputWrapper>
                      </div>

                    {["vendu"].includes(formData.statutTitre) && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Prix</label>
                        <InputWrapper icon={<FaMoneyBillWave />}>
                          <input
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm"
                          />
                        </InputWrapper>
                      </div>
                    )}

                    
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-green-700 px-6 py-2 text-sm font-medium text-white hover:bg-green-800"
                    >
                      Enregistrer
                    </button>
                  </div>
                </motion.form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
