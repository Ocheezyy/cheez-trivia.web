import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { TypedClientSocket } from "@/lib/types";

export function useSocket() {
  const [socket, setSocket] = useState<TypedClientSocket | null>(null);

  useEffect(() => {
    const newSocket: TypedClientSocket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL) as TypedClientSocket;
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}
