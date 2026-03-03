const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

type FetchOptions = {
  method?: string
  body?: any
  token?: string
}

async function apiCall(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', body, token } = options
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'API error' }))
    throw new Error(err.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth
export async function register(email: string, name: string, password: string) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: { email, name, password },
  })
}

export async function login(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function getCurrentUser(token: string) {
  return apiCall('/auth/me', { token })
}

// Resumes
export async function createResume(title: string, token: string) {
  return apiCall('/resumes', {
    method: 'POST',
    body: { title },
    token,
  })
}

export async function listResumes(token: string) {
  return apiCall('/resumes', { token })
}

export async function getResume(id: string, token: string) {
  return apiCall(`/resumes/${id}`, { token })
}

export async function deleteResume(id: string, token: string) {
  return apiCall(`/resumes/${id}`, {
    method: 'DELETE',
    token,
  })
}

// Upload
export async function uploadResume(id: string, file: File, token: string) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/resumes/${id}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(err.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Render & PDF
export async function renderResume(id: string, template: string = 'modern', token: string) {
  return apiCall(`/resumes/${id}/render?template=${template}`, { token })
}

// AI
export async function enhanceText(id: string, section: string, tone: string = 'professional', maxWords?: number, token?: string) {
  return apiCall(`/resumes/${id}/enhance`, {
    method: 'POST',
    body: { section, tone, maxWords },
    token,
  })
}

export async function getSuggestions(id: string, section: string, token?: string) {
  return apiCall(`/resumes/${id}/suggestions`, {
    method: 'POST',
    body: { section },
    token,
  })
}
