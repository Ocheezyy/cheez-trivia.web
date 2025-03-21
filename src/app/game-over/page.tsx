"use client";

import { useRouter } from "next/navigation";
import GameOver from "@/components/game-over";

// Sample data for demonstration
const samplePlayers = [
  {
    id: 1,
    name: "You",
    score: 1850,
    isCurrentUser: true,
    correctAnswers: 8,
    totalAnswers: 10,
    fastestAnswer: 3.2,
  },
  {
    id: 2,
    name: "Alex",
    score: 2100,
    correctAnswers: 9,
    totalAnswers: 10,
    fastestAnswer: 2.8,
  },
  {
    id: 3,
    name: "Taylor",
    score: 1600,
    correctAnswers: 7,
    totalAnswers: 10,
    fastestAnswer: 4.1,
  },
  {
    id: 4,
    name: "Jordan",
    score: 1400,
    correctAnswers: 6,
    totalAnswers: 10,
    fastestAnswer: 5.3,
  },
  {
    id: 5,
    name: "Casey",
    score: 1900,
    correctAnswers: 8,
    totalAnswers: 10,
    fastestAnswer: 3.5,
  },
  {
    id: 6,
    name: "Riley",
    score: 1300,
    correctAnswers: 6,
    totalAnswers: 10,
    fastestAnswer: 6.2,
  },
];

const gameSettings = {
  category: "Mixed",
  difficulty: "Medium",
  totalQuestions: 10,
};

export default function GameOverPage() {
  const router = useRouter();

  const handlePlayAgain = () => {
    router.push("/create-game");
  };

  return <GameOver players={samplePlayers} gameSettings={gameSettings} onPlayAgain={handlePlayAgain} />;
}
