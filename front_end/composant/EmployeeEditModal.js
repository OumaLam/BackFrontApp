import React, { useState, useEffect } from 'react';

function EmployeeEditModal({ employee, onClose, onSave }) {
  const [formData, setFormData] = useState(employee || {});

  useEffect(() => {
    setFormData(employee || {});
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!employee) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Modifier Employé</h2>
        <form onSubmit={handleSubmit}>
          <input name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First Name" />
          <input name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last Name" />
          <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" />
          <input name="salary" value={formData.salary || ''} onChange={handleChange} placeholder="Salaire" />
          <input name="hireDate" value={formData.hireDate || ''} onChange={handleChange} type="date" />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeEditModal;
