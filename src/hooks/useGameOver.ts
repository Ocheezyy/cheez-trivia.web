import { useMutation } from "@tanstack/react-query";
import { RoomData } from "@/lib/types";
import { toast } from "sonner";
import useGameStore from "@/stores/useGameStore";

export const useGameOver = () => {
  const setRoomData = useGameStore((state) => state.setRoomData);

  return useMutation({
    mutationFn: async (roomId: string): Promise<RoomData> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_API_URL}/api/game-over/${roomId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    },
    onSuccess: (data) => {
      console.log("Fetched game over data", data);
      setRoomData(data);
    },
    onError: (error) => {
      console.error("Failed to get game over data:", error);
      toast.error("Failed to get game over data " + error.message);
    },
  });
};
