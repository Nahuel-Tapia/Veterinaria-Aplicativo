import * as api from '../libs/api.js';

export async function getMedicalRecords(query) {
  return await api.getJson('/medical-record', query);
}

export async function createMedicalRecord(body) {
  return await api.post('/medical-record', body);
}

export async function updateMedicalRecord(uuid, body) {
  return await api.patch('/medical-record', body, { path: uuid });
}

export async function deleteMedicalRecord(uuid) {
  return await api.deleteItem('/medical-record', { path: uuid });
}
