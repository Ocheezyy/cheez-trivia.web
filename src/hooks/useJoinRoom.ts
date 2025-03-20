import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { JoinRoomBody } from "@/lib/types";
import { toast } from "sonner";

export const useJoinRoom = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async ({ playerName, roomId }: JoinRoomBody): Promise<JoinRoomBody> => {
            const response = await fetch("/api/createRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    playerName,
                    roomId
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create room");
            }

            return await response.json();
        },
        onSuccess: (data) => {
            console.log("Room joined successfully. Room ID:", data.roomId);
            localStorage.setItem("roomId", data.roomId);
            localStorage.setItem("playerName", data.playerName);
            localStorage.setItem("isHost", "false");
            router.push(`/game`);
        },
        onError: (error) => {
            console.error("Failed to join room:", error);
            toast.error("Failed to join room");
        },
    });
};