const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/v1';

// Authentication Apis Routes
export const AuthenticationApi = {
    REGISTER_API: `${BASE_URL}/auth/register`,
    LOGIN_API: `${BASE_URL}/auth/login`
}

// Connection Routes
export const ConnectionApi = {
    SEARCH_USER: `${BASE_URL}/connection/search-user`,
    CONNECT: `${BASE_URL}/connection/connect`
}

// Chat Routes
export const ChatApi = {
    GET_FRIEND_LIST: `${BASE_URL}/chat/get-friend-list`,
    GET_CHAT: `${BASE_URL}/chat/get-chat`,
    SEND_MESSAGE: `${BASE_URL}/chat/send-message`
}

