import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket', 'polling']
    };
    const serverUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost:5000';
    return io(serverUrl, options);
};