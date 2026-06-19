// Central API configuration for production deployment
export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://ecommerce-mern-production-c7c0.up.railway.app');
