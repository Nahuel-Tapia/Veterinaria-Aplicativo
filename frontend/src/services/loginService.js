import { postJson } from '../libs/api.js';

export async function login(username, password) {
  return await postJson('/login', { username, password });
}

export async function register(userData) {
  return await postJson('/register', userData);
}