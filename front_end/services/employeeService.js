const API = 'http://localhost:8080/api/employes';

export async function getEmployees() {
  const res = await fetch(API);
  return res.json();
}

export async function addEmployee(formData) {
  await fetch(API, {
    method: 'POST',
    body: formData
  });
}

export async function deleteEmployee(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
}

export async function updateEmployee(id, data) {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deactivateEmployee(id) {
  await fetch(`${API}/${id}/deactivate`, {
    method: 'PUT'
  });
}
