// InternSieve frontend configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: '',  // same-origin in production
  },
};

const env = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[env]?.API_BASE_URL || config.development.API_BASE_URL;
export default config;
