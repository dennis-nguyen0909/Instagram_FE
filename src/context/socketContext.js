// SocketContext.js
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('/');
        setSocket(newSocket);

        // Clean up function
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };
