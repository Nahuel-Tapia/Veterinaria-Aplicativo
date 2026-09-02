import * as api from '../libs/api.js';

export async function getAppointments(query) {
  return await api.getJson('/appointment', query);
}

export async function getAppointment(uuid) {
  return await api.getJson('/appointment', null, { path: uuid });
}

export async function createAppointment(body) {
  return await api.post('/appointment', body);
}

export async function updateAppointment(uuid, body) {
  return await api.patch('/appointment', body, { path: uuid });
}

export async function deleteAppointment(uuid) {
  return await api.deleteItem('/appointment', { path: uuid });
}
