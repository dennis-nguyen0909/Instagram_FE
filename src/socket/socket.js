// socket.js
import { io } from 'socket.io-client';

const socket = io('/', {
    reconnection: true,
    auth: {
        serverOffset: 0
    },
    ackTimeout: 10000,
    retries: 3,
});

export default socket;
