'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Eye, Pencil, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import AnimalEditDialog from '@/composant/AnimalEditDialog';
import AnimalForm from '@/composant/AnimalForm';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const primaryColor = "#2d775c";

export default function AnimalList() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1];

  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [sexeFilter, setSexeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const itemsPerPage = 20;

  // Charger les animaux
  useEffect(() => {
    axios.get('http://localhost:8080/api/animal', { withCredentials: true })
      .then(res => setAnimals(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filtrage
  const filteredAnimals = animals.filter(a =>
    (!sexeFilter || a.sexe?.toLowerCase() === sexeFilter.toLowerCase()) &&
    (!dateFilter || new Date(a.dateNaissance) >= new Date(dateFilter)) &&
    (!statutFilter || a?.statutTitre?.toLowerCase() === statutFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const currentData = filteredAnimals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToExcel = () => {
    const data = filteredAnimals.map(animal => ({
      ID: animal.idAnimal,
      Race: animal.race,
      Sexe: animal.sexe,
      "Date de Naissance": format(new Date(animal.dateNaissance), 'dd/MM/yyyy'),
      Statut: animal.statutTitre,
      ...(statutFilter === 'vendu' || statutFilter === 'achete' ? { Prix: animal.prix } : {})
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Animaux");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "animaux.xlsx");
  };

  const handleFormClose = (newAnimal) => {
    setShowForm(false);
    if (newAnimal) {
      setAnimals(prev => [newAnimal, ...prev]);
    }
  };

  const handleUpdateAnimal = (updatedAnimal) => {
    setAnimals(prev =>
      prev.map(a => a.idAnimal === updatedAnimal.idAnimal ? updatedAnimal : a)
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🐮 Liste des Animaux</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2d775c] hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <PlusCircle size={20} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl relative">
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <AnimalForm onClose={handleFormClose} />
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={sexeFilter} onChange={e => setSexeFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm">
          <option value="">Tous les sexes</option>
          <option value="male">Mâle</option>
          <option value="femelle">Femelle</option>
        </select>

        <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm">
          <option value="">Tous les statuts</option>
          <option value="nee">Née</option>
          <option value="vendu">Vendu</option>
          <option value="achete">Acheté</option>
          <option value="abbatu">Abattu</option>
          <option value="mort">Mort</option>
        </select>

        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="p-2 border rounded-xl shadow-sm" />

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 text-green-700 font-medium hover:underline hover:text-green-900 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16V4H4zm8 12v-8m0 8l-3-3m3 3l3-3" />
          </svg>
          Exporter Excel
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
        <thead style={{ backgroundColor: primaryColor }} className="text-white">
          <tr>
            <th className="p-3 text-left font-semibold">ID</th>
            <th className="p-3 text-left font-semibold">Race</th>
            <th className="p-3 text-left font-semibold">Sexe</th>
            <th className="p-3 text-left font-semibold">Date de Naissance</th>
            {(statutFilter === 'vendu' || statutFilter === 'achete') && (
              <th className="p-3 text-left font-semibold">Prix</th>
            )}
            <th className="p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((animal) => (
            <tr key={animal.idAnimal} className="border-b border-gray-200 hover:bg-green-50 transition-colors cursor-default">
              <td className="p-3">{animal.idAnimal}</td>
              <td className="p-3">{animal.race}</td>
              <td className="p-3">{animal.sexe}</td>
              <td className="p-3">{format(new Date(animal.dateNaissance), 'dd/MM/yyyy')}</td>
              {(statutFilter === 'vendu' ) && (
                <td className="p-3">{animal.prix}</td>
              )}
              <td className="p-3 space-x-2">
                <button onClick={() => router.push(`animal/${animal.idAnimal}`)} className="text-blue-600 hover:text-blue-800">
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedAnimal(animal);
                    setOpenDialog(true);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <Pencil size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full transition text-sm ${
                i + 1 === currentPage
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      {/* Dialog édition */}
      {openDialog && selectedAnimal && (
        <AnimalEditDialog
          animal={selectedAnimal}
          isOpen={openDialog}
          setIsOpen={setOpenDialog}
          onUpdate={handleUpdateAnimal}
        />
      )}
    </div>
  );
}
