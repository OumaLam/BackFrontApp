import React, { useState } from 'react';
import axios from 'axios';

function EmployeeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    cin: '',
    prenom: '',
    nom: '',
    role: '',
    date: '',
    salaire: '',
    fonction: '',
    contractFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('cin', formData.cin);
    data.append('prenom', formData.prenom);
    data.append('nom', formData.nom);
    data.append('role', formData.role);
    data.append('date', formData.date);
    data.append('salaire', formData.salaire);
    data.append('fonction', formData.fonction);
    if (formData.contractFile) {
      data.append('contratPdf', formData.contractFile);
    }

    try {
      const response = await axios.post('http://localhost:8080/api/employes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Employé ajouté avec succès !');
      if (onSuccess) onSuccess(response.data); // pour mettre à jour la liste ou autre
      setFormData({
        cin: '',
        prenom: '',
        nom: '',
        role: '',
        date: '',
        salaire: '',
        fonction: '',
        contractFile: null,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'employé.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        name="cin"
        placeholder="CIN"
        value={formData.cin}
        onChange={handleChange}
        required
      />

      <input
        name="prenom"
        placeholder="Prénom"
        value={formData.prenom}
        onChange={handleChange}
        required
      />

      <input
        name="nom"
        placeholder="Nom"
        value={formData.nom}
        onChange={handleChange}
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner un rôle</option>
        <option value="Admin">Admin</option>
        <option value="Vétérinaire">Vétérinaire</option>
        <option value="Gestionnaire">Gestionnaire</option>
      </select>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="salaire"
        placeholder="Salaire"
        value={formData.salaire}
        onChange={handleChange}
        required
      />

      <input
        name="fonction"
        placeholder="Fonction"
        value={formData.fonction}
        onChange={handleChange}
      />

      <input
        type="file"
        name="contractFile"
        accept="application/pdf"
        onChange={handleChange}
      />

      <button type="submit">Ajouter Employé</button>
    </form>
  );
}

export default EmployeeForm;
