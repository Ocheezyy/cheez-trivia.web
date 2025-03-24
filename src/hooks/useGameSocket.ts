import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useGameStore from "@/stores/useGameStore";
import { RoomData, TypedClientSocket } from "@/lib/types";

interface UseGameSocketProps {
  socket: TypedClientSocket | null;
  isHost: boolean;
  roomData: RoomData;
  playerName: string;
}

const useGameSocket = ({ socket, isHost, roomData, playerName }: UseGameSocketProps) => {
  const router = useRouter();
  const [allAnswered, setAllAnswered] = useState(false);
  const [nextQuestionCountdown, setNextQuestionCountdown] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(roomData?.timeLimit) || 30);
  const [newMessage, setNewMessage] = useState("");

  const setCurrentQuestion = useGameStore((state) => state.setCurrentQuestion);
  const storeJoinRoom = useGameStore((state) => state.joinRoom);
  const messageReceived = useGameStore((state) => state.messageReceived);
  const storeStartGame = useGameStore((state) => state.startGame);
  const updatePlayerScore = useGameStore((state) => state.updatePlayerScore);

  useEffect(() => {
    if (roomData.gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    // Time's up logic would go here
  }, [timeLeft, roomData]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageVal = newMessage.trim();
    if (!messageVal) return;

    if (socket && roomData.gameId) {
      socket.emit("sendMessage", roomData.gameId, messageVal, playerName);
    } else {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (!socket) return;
    const lsRoomId = localStorage.getItem("roomId");
    const lsPlayerName = localStorage.getItem("playerName");
    if (!lsRoomId || !lsPlayerName) {
      console.error(
        `Required local storage item not found. roomId: ${lsRoomId}, playerName: ${lsPlayerName}`
      );
      return;
    }

    if (isHost) {
      socket.emit("hostJoin", lsPlayerName, lsRoomId);
    } else {
      socket.emit("joinRoom", lsRoomId, lsPlayerName);
    }
  }, [socket, isHost]);

  useEffect(() => {
    if (allAnswered && nextQuestionCountdown > 0) {
      const timer = setTimeout(() => {
        setNextQuestionCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (allAnswered && nextQuestionCountdown === 0) {
      // Maybe show something here
    }
  }, [allAnswered, nextQuestionCountdown]);

  useEffect(() => {
    if (!socket) return;
    socket.on("allAnswered", () => {
      setAllAnswered(true);
      setNextQuestionCountdown(10);
    });

    return () => {
      socket.off("allAnswered");
    };
  }, [socket, setAllAnswered]);

  useEffect(() => {
    if (!socket) return;

    socket.on("hostJoined", (data) => {
      storeJoinRoom(data);
      console.log("hostJoined", data);
    });

    return () => {
      socket.off("hostJoined");
    };
  }, [socket, storeJoinRoom]);

  useEffect(() => {
    if (!socket) return;

    socket.on("playerJoined", (data) => {
      storeJoinRoom(data);
      console.log("playerJoined", data);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [socket, storeJoinRoom]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receivedMessage", (message, playerName) => {
      messageReceived({ message, user: playerName });
      setNewMessage("");
      console.log("receivedMessage", message, playerName);
    });

    return () => {
      socket.off("receivedMessage");
    };
  }, [socket, messageReceived]);

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", roomData.gameId);
    } else {
      toast.error("Failed to start game");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("gameStarted", () => storeStartGame());

    return () => {
      socket.off("gameStarted");
    };
  }, [socket, storeStartGame]);

  const handleSubmitAnswer = () => {
    // Calculate points based on time left (faster answers get more points)
    const currentQuestionObj = roomData.questions[roomData.currentQuestion - 1];
    const basePoints = 100;
    const timeBonus = Math.floor(timeLeft * 3.33); // Up to 100 bonus points for fastest answer
    const isCorrect = selectedOption === currentQuestionObj.correct_answer;
    const points = isCorrect ? basePoints + timeBonus : 0;

    if (socket) {
      socket.emit("submitAnswer", roomData.gameId, playerName, points, Number(roomData.timeLimit) - timeLeft);
    }
    setHasAnswered(true);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("updatePlayerScore", (playerName, score) => {
      updatePlayerScore(playerName, score);
      console.log("updatePlayerScore", playerName, score);
    });

    return () => {
      socket.off("updatePlayerScore");
    };
  }, [socket, updatePlayerScore]);

  useEffect(() => {
    if (!socket) return;

    socket.on("nextQuestion", (currentQuestionNum) => {
      console.log("nextQuestion called: " + currentQuestionNum);
      setCurrentQuestion(currentQuestionNum);
      setSelectedOption(null);
      setHasAnswered(false);
      setAllAnswered(false);
      setTimeLeft(Number(roomData.timeLimit));
    });

    return () => {
      socket.off("nextQuestion");
    };
  }, [socket, setCurrentQuestion, roomData.timeLimit]);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameEnd", async () => {
      router.push(`/game-over/${roomData.gameId}`);
    });
    return () => {
      socket.off("gameEnd");
    };
  }, [roomData.gameId, router, socket]);

  return {
    allAnswered,
    nextQuestionCountdown,
    handleSendMessage,
    selectedOption,
    setSelectedOption,
    hasAnswered,
    timeLeft,
    newMessage,
    setNewMessage,
    handleStartGame,
    handleSubmitAnswer,
  };
};

export default useGameSocket;
