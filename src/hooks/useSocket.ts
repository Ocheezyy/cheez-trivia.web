import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL);
        setSocket(newSocket);

        // Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
}