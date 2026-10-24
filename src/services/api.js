/**
 * CareerHub - MockAPI REST API Service Layer
 * Handles all asynchronous CRUD operations for Jobs and Applications resources.
 *
 * Configured via import.meta.env.VITE_MOCKAPI_URL
 */

const RAW_BASE_URL = import.meta.env.VITE_MOCKAPI_URL || '';

// Normalize URL: remove any trailing slash
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/**
 * Check if the MockAPI URL is configured and not an empty/dummy placeholder
 */
export const isApiConfigured = () => {
  return (
    !!API_BASE_URL &&
    !API_BASE_URL.includes('YOUR_PROJECT') &&
    !API_BASE_URL.includes('your-project')
  );
};

/**
 * Generic request helper with status validation and detailed error handling
 */
async function request(endpoint, options = {}) {
  if (!isApiConfigured()) {
    throw new Error(
      'MockAPI URL is not configured. Please set VITE_MOCKAPI_URL in your .env file.'
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (netErr) {
    throw new Error(
      `Network error connecting to MockAPI at ${url}: ${netErr.message}`
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail =
        errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      try {
        errorDetail = await response.text();
      } catch {
        errorDetail = response.statusText;
      }
    }
    throw new Error(
      `API Error (${response.status} ${response.statusText}): ${errorDetail || 'Request failed'}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (parseErr) {
    throw new Error(
      `Failed to parse response JSON from ${url}: ${parseErr.message}`
    );
  }
}

// ==========================================
// JOBS API
// ==========================================

/**
 * Fetch all jobs
 * GET /jobs
 */
export async function getJobs() {
  return request('/jobs', { method: 'GET' });
}

/**
 * Fetch a single job by ID
 * GET /jobs/:id
 */
export async function getJobById(id) {
  return request(`/jobs/${encodeURIComponent(id)}`, { method: 'GET' });
}

/**
 * Create a new job
 * POST /jobs
 */
export async function createJob(jobData) {
  return request('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}

/**
 * Full update of a job
 * PUT /jobs/:id
 */
export async function updateJob(id, jobData) {
  return request(`/jobs/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  });
}

/**
 * Partial update of a job
 * PATCH /jobs/:id
 */
export async function patchJob(id, partialData) {
  return request(`/jobs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(partialData),
  });
}

/**
 * Delete a job
 * DELETE /jobs/:id
 */
export async function deleteJob(id) {
  return request(`/jobs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// ==========================================
// APPLICATIONS API
// ==========================================

/**
 * Fetch all applications
 * GET /applications
 */
export async function getApplications() {
  return request('/applications', { method: 'GET' });
}

/**
 * Fetch a single application by ID
 * GET /applications/:id
 */
export async function getApplicationById(id) {
  return request(`/applications/${encodeURIComponent(id)}`, { method: 'GET' });
}

/**
 * Submit a new application
 * POST /applications
 */
export async function createApplication(appData) {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(appData),
  });
}

/**
 * Full update of an application
 * PUT /applications/:id
 */
export async function updateApplication(id, appData) {
  return request(`/applications/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(appData),
  });
}

/**
 * Partial update of an application (e.g. status, interview schedule, notes)
 * PATCH /applications/:id
 */
export async function patchApplication(id, partialData) {
  return request(`/applications/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(partialData),
  });
}

/**
 * Delete / withdraw an application
 * DELETE /applications/:id
 */
export async function deleteApplication(id) {
  return request(`/applications/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export default {
  isApiConfigured,
  getJobs,
  getJobById,
  createJob,
  updateJob,
  patchJob,
  deleteJob,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  patchApplication,
  deleteApplication,
};
