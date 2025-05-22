import React from 'react';

function EmployeeList({ employees, onEdit, onDelete, onDeactivate }) {
  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Salary</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp, index) => (
          <tr key={emp.id} style={{ backgroundColor: emp.actif ? 'white' : '#f0f0f0' }}>
            <td>{index + 1}</td>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td>{emp.email}</td>
            <td>{emp.salary}</td>
            <td>{emp.hireDate}</td>
            <td>
              <button
                onClick={() => onEdit(emp)}
                style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(emp.id)}
                style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}
              >
                Delete
              </button>
              {emp.actif && (
                <button
                  onClick={() => onDeactivate(emp.id)}
                  style={{ backgroundColor: 'orange', color: 'white' }}
                >
                  Désactiver
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeList;
