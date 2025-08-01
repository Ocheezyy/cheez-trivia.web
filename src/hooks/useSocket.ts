import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { TypedClientSocket } from "@/lib/types";
import { toast } from "sonner";

export function useSocket() {
  const [socket, setSocket] = useState<TypedClientSocket | null>(null);

  useEffect(() => {
    const newSocket: TypedClientSocket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }) as TypedClientSocket;

    newSocket.on("error", ({ message, code }) => {
      console.error(`Socket error: ${message} (${code})`);
      toast(`Error: ${message}`);
    });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}
