import AsyncStorage from '@react-native-async-storage/async-storage';

// Configura tu IP local de desarrollo si pruebas en un dispositivo físico o emulador Android (ej: http://10.0.2.2:3000/api)
export const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchApi(endpoint: string, options: any = {}) {
  const token = await AsyncStorage.getItem('user_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  let query = '';
  if (options.query) {
    const params = new URLSearchParams(options.query).toString();
    if (params) query = `?${params}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}${query}`, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    let errorMsg = 'Error en la petición de red.';
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export const api = {
  get: (url: string, query?: any) => fetchApi(url, { method: 'GET', query }),
  post: (url: string, body?: any) => fetchApi(url, { method: 'POST', body }),
  patch: (url: string, body?: any) => fetchApi(url, { method: 'PATCH', body }),
  delete: (url: string) => fetchApi(url, { method: 'DELETE' }),
};
