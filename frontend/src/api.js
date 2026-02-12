const baseUrl = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000';

async function apiRequest(path, config = {}) {
  const url = path.startsWith('http')
    ? path
    : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = {
    ...config.headers,
  };

  if (config.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...config, headers });

  if (!response.ok) {
    let msg = `Ошибка ${response.status}`;

    try {
      const json = await response.json();
      msg = json.message || Object.values(json.errors || {})[0]?.[0] || msg;
    } catch {}

    throw new Error(msg);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  getArticles: () => apiRequest('/api/articles'),
  getArticle: (id) => apiRequest(`/api/articles/${id}`),

  createArticle: (data) => apiRequest('/api/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateArticle: (id, data) => apiRequest(`/api/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteArticle: (id) => apiRequest(`/api/articles/${id}`, { method: 'DELETE' }),

  addComment: (articleId, data) => apiRequest(`/api/articles/${articleId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};