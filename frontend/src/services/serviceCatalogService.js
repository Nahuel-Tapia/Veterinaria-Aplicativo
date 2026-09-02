import * as api from '../libs/api.js';

export async function getServices(query) {
  return await api.getJson('/service', query);
}

export async function getService(uuid) {
  return await api.getJson('/service', null, { path: uuid });
}

export async function createService(body) {
  return await api.post('/service', body);
}

export async function updateService(uuid, body) {
  return await api.patch('/service', body, { path: uuid });
}

export async function deleteService(uuid) {
  return await api.deleteItem('/service', { path: uuid });
}
