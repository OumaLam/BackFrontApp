"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AssignRoleForm } from "./AssignRoleForm";

const primaryColor = "#2d775c";

const EmployesAvecRole = () => {
  const [employes, setEmployes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEmployes = () => {
    axios
      .get("http://localhost:8080/api/employes/avec-role", { withCredentials: true })
      .then((res) => {
        setEmployes(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement :", err);
      });
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Employés avec Rôle</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: primaryColor }}
          className="text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-colors hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
        >
          + Rôle
        </button>
      </div>

      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
        <thead style={{ backgroundColor: primaryColor }} className="text-white">
          <tr>
            {["CIN", "Nom", "Prénom", "Email", "Rôle"].map((header) => (
              <th key={header} className="p-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employes.map((emp, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-green-50 transition-colors cursor-default"
            >
              <td className="p-3">{emp.cin}</td>
              <td className="p-3">{emp.nom}</td>
              <td className="p-3">{emp.prenom}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3 font-semibold text-green-700">{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto"
            style={{ borderTop: `6px solid ${primaryColor}` }}
          >
            <button
              onClick={() => setShowModal(false)}
              aria-label="Fermer"
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none focus:outline-none"
            >
              &times;
            </button>
            <AssignRoleForm
              onSuccess={() => {
                setShowModal(false);
                fetchEmployes();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployesAvecRole;
