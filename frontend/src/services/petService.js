import * as api from '../libs/api.js';

export async function getPets(query) {
  return await api.getJson('/pet', query);
}

export async function getPet(uuid) {
  return await api.getJson('/pet', null, { path: uuid });
}

export async function createPet(body) {
  return await api.post('/pet', body);
}

export async function updatePet(uuid, body) {
  return await api.patch('/pet', body, { path: uuid });
}

export async function deletePet(uuid) {
  return await api.deleteItem('/pet', { path: uuid });
}
