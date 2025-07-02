import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket', 'polling']
    };

    // Use the deployed backend URL on Render
    const serverUrl = "https://quick-code-ol6a.onrender.com";

    return io(serverUrl, options);
};