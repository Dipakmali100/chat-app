const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/v1';

// Authentication Apis Routes
export const AuthenticationApi = {
    REGISTER_API: `${BASE_URL}/auth/register`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    UNIQUE_USERNAME_CHECK_API: `${BASE_URL}/auth/unique-username`,
    CHANGE_AVATAR_API: `${BASE_URL}/auth/change-avatar`,
}

// Connection Routes
export const ConnectionApi = {
    SEARCH_USER: `${BASE_URL}/connection/search-user`,
    CONNECT: `${BASE_URL}/connection/connect`,
    DISCONNECT: `${BASE_URL}/connection/disconnect`,
}

// Chat Routes
export const ChatApi = {
    GET_FRIEND_LIST: `${BASE_URL}/chat/get-friend-list`,
    GET_CHAT: `${BASE_URL}/chat/get-chat`,
    SEND_MESSAGE: `${BASE_URL}/chat/send-message`,
    DELETE_CHAT: `${BASE_URL}/chat/delete-chat`,
    DELETE_MESSAGE: `${BASE_URL}/chat/delete-message`,
}

// Payment Routes
export const PaymentApi = {
    CREATE_ORDER: `${BASE_URL}/payment/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payment/verify-payment`,
}

// Traffic Routes
export const TrafficApi = {
    UPDATE_TRAFFIC: `${BASE_URL}/traffic/update-traffic`,
}