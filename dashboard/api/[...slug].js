import { incidents as importedIncidents } from '../src/data/incidentData.js';

let incidents = [...importedIncidents];
let nextId = incidents.length ? Math.max(...incidents.map((item) => item.id)) + 1 : 1;

const notFound = (res, message = 'Not found') => res.status(404).json({ error: message });
const badRequest = (res, message) => res.status(400).json({ error: message });

// Derive the path segments after `/api/`. Works whether Vercel populates the
// catch-all `slug` as an array, a single string, or not at all (fall back to
// parsing the request URL directly).
const getSegments = (req) => {
  const raw = req.query?.slug;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw) return raw.split('/').filter(Boolean);
  const path = (req.url || '').split('?')[0];
  return path.replace(/^\/api\/?/, '').split('/').filter(Boolean);
};

const handleAuth = (req, res, segments) => {
  const route = segments.slice(1).join('/');

  // Mock tokens shaped to match the real Django/SimpleJWT contract:
  // { tokens: { access, refresh }, user }
  const mockTokens = () => ({ access: 'fake-access-token', refresh: 'fake-refresh-token' });

  if (req.method === 'POST' && route === 'signup') {
    const { username, email, password } = req.body;
    if (!username || !password) return badRequest(res, 'Username and password are required.');
    return res.status(201).json({
      tokens: mockTokens(),
      user: { id: 1, username, email: email || '', role: 'FIELD_STAFF' },
      message: 'Account created successfully.',
    });
  }

  if (req.method === 'POST' && route === 'login') {
    // Accept username (real backend); fall back to email for older clients.
    const { username, email, password } = req.body;
    const identifier = username || email;
    if (!identifier || !password) return badRequest(res, 'Username and password are required.');
    return res.json({
      tokens: mockTokens(),
      user: { id: 1, username: identifier, email: email || '', role: 'Administrator' },
    });
  }

  if (req.method === 'POST' && route === 'logout') {
    return res.json({ ok: true });
  }

  if (req.method === 'GET' && route === 'profile') {
    return res.json({ id: 1, email: 'demo@example.com', name: 'Demo User', role: 'Administrator' });
  }

  if (req.method === 'POST' && route === 'refresh') {
    return res.json({ access: 'fake-access-token' });
  }

  if (req.method === 'GET' && route === 'organisations/search') {
    const organisations = [
      { id: 1, name: 'SafePulse Community' },
      { id: 2, name: 'Hope Center' },
      { id: 3, name: 'Women Support Network' },
    ];
    const query = (req.query.q || '').toLowerCase();
    const results = organisations.filter((org) => org.name.toLowerCase().includes(query));
    return res.json(results);
  }

  return notFound(res, 'Auth route not found');
};

const handleIncidents = (req, res, segments) => {
  const route = segments.slice(2).join('/');

  if (req.method === 'GET' && route === 'incidents') {
    return res.json(incidents);
  }

  if (req.method === 'GET' && route === 'stats') {
    const total = incidents.length;
    const bySeverity = incidents.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    return res.json({ total, bySeverity });
  }

  if (req.method === 'GET' && route === 'dashboard') {
    const open = incidents.filter((item) => item.status !== 'Closed').length;
    const closed = incidents.filter((item) => item.status === 'Closed').length;
    return res.json({ open, closed, total: incidents.length });
  }

  if (req.method === 'GET' && route === 'coordinator-dashboard') {
    const severities = incidents.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    return res.json({ severities, total: incidents.length });
  }

  if (req.method === 'POST' && route === 'submit') {
    const payload = req.body;
    const newIncident = { id: nextId++, ...payload };
    incidents.unshift(newIncident);
    return res.status(201).json(newIncident);
  }

  const detailMatch = route.match(/^incidents\/(\d+)\/?$/);
  if (req.method === 'GET' && detailMatch) {
    const id = Number(detailMatch[1]);
    const incident = incidents.find((item) => item.id === id);
    if (!incident) return notFound(res, 'Incident not found');
    return res.json(incident);
  }

  const ackMatch = route.match(/^incidents\/(\d+)\/acknowledge\/?$/);
  if (req.method === 'POST' && ackMatch) {
    const id = Number(ackMatch[1]);
    const existing = incidents.find((item) => item.id === id);
    if (!existing) return notFound(res, 'Incident not found');
    incidents = incidents.filter((item) => item.id !== id);
    return res.json({ ok: true, id });
  }

  return notFound(res, 'Incident route not found');
};

export default function handler(req, res) {
  const segments = getSegments(req);
  if (segments.length === 0) {
    return notFound(res, 'API route not found');
  }

  if (segments[0] === 'auth') {
    return handleAuth(req, res, segments);
  }

  if (segments[0] === 'incidents') {
    return handleIncidents(req, res, segments);
  }

  return notFound(res, 'API route not found');
}
