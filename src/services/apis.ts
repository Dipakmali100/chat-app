const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/v1';

// Authentication Apis Routes
export const AuthenticationApi = {
    REGISTER_API: `${BASE_URL}/auth/register`,
    LOGIN_API: `${BASE_URL}/auth/login`
}
