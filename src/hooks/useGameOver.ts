import { useQuery } from "@tanstack/react-query";
import { RoomData } from "@/lib/types";
import useGameStore from "@/stores/useGameStore";

export const useGameOver = (roomId: string) => {
  const setRoomData = useGameStore((state) => state.setRoomData);

  return useQuery<RoomData, Error>({
    queryKey: ["gameOver", roomId], // Unique key for caching
    queryFn: async (): Promise<RoomData> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_API_URL}/api/game-over/${roomId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const resBody = (await response.json()) as RoomData;

      console.log("Fetched game over data", resBody);
      setRoomData(resBody);

      return resBody;
    },
    enabled: !!roomId, // Only run when roomId exists
    staleTime: 1000 * 60 * 5, // 5 minutes until data becomes stale
    retry: 2,
  });
};
