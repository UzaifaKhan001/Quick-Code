import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket', 'polling']
    };
    const serverUrl = process.env.REACT_APP_BACKEND_URL || 'https://quick-code-ol6a.onrender.com';
    return io(serverUrl, options);
};

const socket = io("https://quick-code-ol6a.onrender.com"); // Use your deployed backend URL
export default socket;