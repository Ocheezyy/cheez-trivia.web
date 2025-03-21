import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CreateRoomBody, CreateRoomResponse } from "@/lib/types";
import { toast } from "sonner";
import useGameStore from "@/stores/useGameStore";

export const useCreateRoom = () => {
  const router = useRouter();
  const setIsHost = useGameStore((state) => state.setIsHost);
  const setPlayerName = useGameStore((state) => state.setPlayerName);

  return useMutation({
    mutationFn: async ({
      playerName,
      numQuestions,
      categoryId,
      difficulty,
      timeLimit,
    }: CreateRoomBody): Promise<CreateRoomResponse> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_API_URL}/api/createRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
          numQuestions,
          categoryId,
          difficulty,
          timeLimit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      console.log("Room created successfully. Room ID:", data.roomId);
      localStorage.setItem("roomId", data.roomId);
      localStorage.setItem("playerName", data.playerName);
      setIsHost(true);
      setPlayerName(data.playerName);
      router.push(`/game`);
      // You can perform additional actions here, like redirecting to the room page
    },
    onError: (error) => {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    },
  });
};
