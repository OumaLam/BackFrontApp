"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const COLOR_PRIMARY = "#2d775c";
const ITEMS_PER_PAGE = 10;

const initialFormState = {
  cin: "",
  email: "",
  prenom: "",
  nom: "",
  fonction: "",
  dateEmbauche: "",
  salaire: "",
  contratPdf: null,
};

const formatSalaire = (montant) => {
  if (!montant) return "";
  const formatted = Number(montant).toLocaleString("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} DH`;
};

function EmployeList() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8080/api/employes", { withCredentials: true })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Erreur chargement employés", err));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "contratPdf") {
      setFormData({ ...formData, contratPdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.cin || !formData.nom || !formData.prenom || !formData.fonction|| !formData.email) {
      alert("Merci de remplir les champs obligatoires.");
      return;
    }

    if (editIndex !== null) {
      // Modification
      const updatedEmployee = {
        cin: formData.cin,
        email: formData.email,
        prenom: formData.prenom,
        nom: formData.nom,
        fonction: formData.fonction,
        dateEmbauche: formData.dateEmbauche,
        salaire: parseFloat(formData.salaire),
        contratPdf: null,


      };

      axios
        .put(`http://localhost:8080/api/employes/${formData.cin}`, updatedEmployee, {
          withCredentials: true,
        })
        .then((res) => {
          const updatedList = [...employees];
          updatedList[editIndex] = res.data;
          setEmployees(updatedList);
          resetForm();
        })
        .catch((err) => console.error("Erreur modification", err));
    } else {
      // Ajout
      const data = new FormData();
      data.append("cin", formData.cin);
      data.append("email", formData.email);
      data.append("prenom", formData.prenom);
      data.append("nom", formData.nom);
      data.append("fonction", formData.fonction);
      data.append("dateEmbauche", formData.dateEmbauche);
      data.append("salaire", formData.salaire);
      if (formData.contratPdf) {
        data.append("contratPdf", formData.contratPdf);
      }
   try {
  const reponse = await axios.post("http://localhost:8080/api/employes", data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(reponse);
  toast.success(reponse.data.message || "Ajout avec succès !");
  setEmployees([...employees, reponse.data.employe]);
  resetForm();
} catch (error) {
  // console.log(error);
toast.error(error?.response?.data?.error || "Erreur lors de l'ajout !");
}


}
    }

  const handleDelete = (cin) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet employé ?")) return;

    axios
      .delete(`http://localhost:8080/api/employes/${cin}`, { withCredentials: true })
      .then(() => {
        fetchEmployees();
      })
      .catch((err) => console.error("Erreur suppression", err));
  };
  const handleEdit = (cin) => {
    const empIndex = employees.findIndex((e) => e.cin === cin);
    const emp = employees[empIndex];
    setFormData({
      cin: emp.cin,
      email: emp.email ,
      prenom: emp.prenom,
      nom: emp.nom,
      fonction: emp.fonction,
      dateEmbauche: emp.dateEmbauche,
      salaire: emp.salaire,
      contratPdf: emp.contratPdf,
    });
    setEditIndex(empIndex);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditIndex(null);
    setShowForm(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData((prev) => ({ ...prev, contratPdf: file }));
  if (file && file.size > 1 * 1024 * 1024) { // 1MB en octets
    toast.error("Fichier trop volumineux ! (max 1MB)");

    return;
  }
  
  
};


  return (
<div className="max-w-full p-1 font-sans">
      <h1
        className="w-full text-4xl font-extrabold text-center mb-10"
        style={{ color: COLOR_PRIMARY }}
      >
        Ranch Adarouch - Gestion des Employés 👨‍💼
      </h1>

      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        style={{ backgroundColor: COLOR_PRIMARY }}
        className="text-white font-semibold py-3 px-7 rounded-lg shadow-md hover:brightness-90 transition"
      >
        🧑‍💼 Ajouter Employé
      </button>

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="form-title"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 space-y-6 relative animate-fadeIn">
            <h2
              id="form-title"
              className="text-3xl font-semibold mb-5"
              style={{ color: COLOR_PRIMARY }}
            >
              {editIndex !== null ? "Modifier Employé" : "Ajouter Employé"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="grid grid-cols-2 gap-5"
            >
              <input
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                placeholder="CIN *"
                disabled={editIndex !== null}
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Prénom *"
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Nom *"
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
                <input
                  type="text"
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleChange}
                  placeholder="Entrez la fonction"
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />

              <input
                type="date"
                name="dateEmbauche"
                value={formData.dateEmbauche}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                name="salaire"
                value={formData.salaire}
                onChange={handleChange}
                placeholder="Salaire en DH"
                type="number"
                min="0"
                step="0.01"
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600 col-span-2"
              />
              <input 
                type="file"
                name="contratPdf"
                onChange={handleFileChange}
                accept="application/pdf"
                className="col-span-2 "
              />

              <div className="col-span-2 flex justify-end space-x-4 mt-2">
                <button
                  type="submit"
                  style={{ backgroundColor: COLOR_PRIMARY }}
                  className="text-white font-semibold py-2 px-6 rounded hover:brightness-90 transition"
                >
                  {editIndex !== null ? "✏️ Modifier" : "🧑‍💼 Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className=" mt-8 min-w-xl rounded-lg shadow-lg border border-gray-200  ">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead
            style={{ backgroundColor: COLOR_PRIMARY }}
            className="text-white"
          >
            <tr >
              <th className="p-3 text-left font-semibold">#</th>
              <th className="p-3 text-left font-semibold">CIN</th>
              <th className="p-3 text-left font-semibold">Email</th>
            <th className="p-3 text-left font-semibold">Nom et prenom</th>
            <th className="p-3 text-left font-semibold">Fonction</th>
            <th className="p-3 text-left font-semibold">Salaire</th>
                        <th className="p-3 text-left font-semibold">Contrat Pdf</th>

            <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
            </thead>
            <tbody>
            {paginatedEmployees.length === 0 && (
            <tr>
            <td colSpan="9" className="text-center py-6 text-gray-500">
            Aucun employé trouvé.
            </td>
            </tr>
            )}
            {paginatedEmployees.map((emp, idx) => (
            <tr key={emp.cin} className="border-b border-gray-200 hover:bg-green-50 transition-colors cursor-default" >
            <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
            <td className="p-3">{emp.cin}</td>
            <td className="p-3">{emp.email || "-"}</td>
            <td className="p-3">{emp.nom +" "+emp.prenom}</td>
            <td className="p-3">{emp.fonction}</td>
             <td className="p-3">{formatSalaire(emp.salaire)}</td>
            <td className="p-3">

                  {emp.contratPdf ? (
                  <a
                    href={`http://localhost:8080/api/employes/pdf/${emp.contratPdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Voir le contrat
                  </a>
                ) : (
                  'Non fourni'
                )}
            </td>
            <td className="py-3 px-3 text-center space-x-2">
            <button
            onClick={() => handleEdit(emp.cin)}
            title="Modifier"
            className="text-green-600 hover:text-green-800 transition"
            >
            ✏️
            </button>
            <button
            onClick={() => handleDelete(emp.cin)}
            title="Supprimer"
            className="text-red-600 hover:text-red-800 transition"
            >
            🗑️
            </button>
            </td>
            </tr>
            ))}
            </tbody>
            </table>
            </div>


              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-5 text-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    ← Précédent
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded border ${
                        currentPage === i + 1
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                </div>
              )}

              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fadeIn {
                  animation: fadeIn 0.3s ease forwards;
                }
              `}</style>
            </div>
            );
            }

            export default EmployeList;