const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const withBase = (path) => (BASE ? `${BASE}${path}` : path);

export const AUTH_ENDPOINTS = {
  SIGNUP: withBase('/api/auth/signup/'),
  LOGIN: withBase('/api/auth/login/'),
  LOGOUT: withBase('/api/auth/logout/'),
  PROFILE: withBase('/api/auth/profile/'),
  REFRESH: withBase('/api/auth/refresh/'),
  ORG_SEARCH: withBase('/api/auth/organisations/search/'),
};

export const INCIDENT_ENDPOINTS = {
  LIST: withBase('/api/incidents/incidents/'),
  SUBMIT: withBase('/api/incidents/incidents/submit/'),
  STATS: withBase('/api/incidents/incidents/stats/'),
  ACKNOWLEDGE: (id) => withBase(`/api/incidents/incidents/${id}/acknowledge/`),
  DETAIL: (id) => withBase(`/api/incidents/incidents/${id}/`),
  DASHBOARD: withBase('/api/incidents/dashboard/'),
  COORDINATOR_DASHBOARD: withBase('/api/incidents/coordinator-dashboard/'),
};
