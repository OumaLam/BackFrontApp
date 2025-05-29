"use client";
import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { FaSyringe, FaEdit, FaTrash } from "react-icons/fa";
import { PlusCircle } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import EditVaccinationForm from "./EditVaccination";
import AddVaccinationForm from "./AddVaccinationForm";
import { usePathname, useRouter } from "next/navigation";

const VaccinationList = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  const router = useRouter();

  const primaryColor = "#2d775c";

  useEffect(() => {
    setIsClient(true);
    fetchVaccinations();
  }, []);

  const formatAge = (age) => {
    const [years, months, days] = age.split("_").map(Number);
    const parts = [];
    if (years !== 0) parts.push(`${years} an(s)`);
    if (months !== 0) parts.push(`${months} mois`);
    if (days !== 0) parts.push(`${days} jour(s)`);
    return parts.length > 0 ? parts.join(", ") : "0 jour";
  };

  const fetchVaccinations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vaccinations", {
        withCredentials: true,
      });
      setVaccinations(res.data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce vaccin ?")) {
      try {
        await axios.delete(`http://localhost:8080/api/vaccinations/${id}`, {
          withCredentials: true,
        });
        fetchVaccinations();
      } catch (err) {
        console.error("Erreur :", err);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h3 className="flex justify-center items-center gap-2 text-2xl font-bold text-[#2d775c] mb-6">
        <FaSyringe />
        Liste des Vaccinations
      </h3>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2 bg-[#2d775c] text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
        >
          <PlusCircle size={20} />
          Ajouter une vaccination
        </button>
      </div>

      {vaccinations.length === 0 ? (
        <p className="text-center text-gray-500">Aucune vaccination trouvée.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead style={{ backgroundColor: primaryColor }} className="text-white">
            <tr>
              <th className="p-3 text-left font-semibold">Nom</th>
              <th className="p-3 text-left font-semibold">Cible Sexe</th>
              <th className="p-3 text-left font-semibold">Cible Âge</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccinations.map((vaccin, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-green-50 transition-colors cursor-default"
              >
                <td className="p-3">{vaccin.vaccinNom}</td>
                <td className="p-3">{vaccin.cibleSexe}</td>
                <td className="p-3">{formatAge(vaccin.cibleAge)}</td>
                <td className="p-3 space-x-2 flex gap-3">
                  <button
                    onClick={() => {
                      setEditId(vaccin.idVaccin);
                      setIsDialogOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(vaccin.idVaccin)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/${basePath}/Vaccination/animaux-non-vaccines/${vaccin.idVaccin}`)
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Ajouter animal vacciné"
                  >
                    <FaSyringe />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Dialog pour édition */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-[500] ">
                <EditVaccinationForm
                  id={editId}
                  onSuccess={() => {
                    fetchVaccinations();
                    setIsDialogOpen(false);
                  }}
                />
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog pour ajout */}
      <Transition appear show={addDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setAddDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <div className="fixed inset-0 bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-[500] ">
                <AddVaccinationForm
                  onSuccess={() => {
                    fetchVaccinations();
                    setAddDialogOpen(false);
                  }}
                />
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default VaccinationList;
