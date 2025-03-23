"use client";

import GameOver from "@/components/game-over";
import { useGameOver } from "@/hooks/useGameOver";

export default function GameOverPage() {
  const { data, isPending } = useGameOver();

  return <GameOver roomData={data} isLoading={isPending} />;
}
