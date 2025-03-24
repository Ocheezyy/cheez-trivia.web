"use client";

import { useParams } from "next/navigation";
import GameOver from "@/components/game-over";
import { useGameOver } from "@/hooks/useGameOver";
import { useEffect } from "react";
import { toast } from "sonner";

export default function GameOverPage() {
  const params = useParams<{ slug: string }>();
  const { data, isPending, isError, error } = useGameOver(params.slug);

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch game over data: ", error);
      toast.error("Failed to get game over data " + error.message);
    }
  }, [isError, error]);

  return <GameOver roomData={data} isLoading={isPending} />;
}
