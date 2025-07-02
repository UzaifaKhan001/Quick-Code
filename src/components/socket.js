import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket', 'polling']
    };
    const serverUrl = 'https://quickcodefy-backend.onrender.com';
    return io(serverUrl, options);
};