// Centralized API base URL — strips trailing slashes to prevent double-slash bugs
const raw = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
export const BACKEND_URL = raw.replace(/\/+$/, '');
export const API = `${BACKEND_URL}/api`;
