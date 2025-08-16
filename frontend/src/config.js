// Environment-based configuration
const dev = {
  API_BASE_URL: 'http://localhost:5000',
};

const prod = {
  API_BASE_URL: '/api', // Relative path for production
};

// Determine which environment we're in
const config = process.env.NODE_ENV === 'production' ? prod : dev;

export const API_BASE_URL = config.API_BASE_URL;
export default config;
