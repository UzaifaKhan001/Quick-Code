import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['polling']
    };
    const serverUrl = process.env.REACT_APP_BACKEND_URL || 'https://quick-code-ol6a.onrender.com';
    return io(serverUrl, options);
};

const options = {
    'force new connection': true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['polling']
};
const serverUrl = process.env.REACT_APP_BACKEND_URL || 'https://quick-code-ol6a.onrender.com';
const socket = io(serverUrl, options);
export default socket;