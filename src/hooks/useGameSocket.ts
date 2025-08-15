import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setCurrentQuestion = useGameStore((state) => state.setCurrentQuestion);
  const storeJoinRoom = useGameStore((state) => state.joinRoom);
  const messageReceived = useGameStore((state) => state.messageReceived);
  const storeStartGame = useGameStore((state) => state.startGame);
  const updatePlayerScore = useGameStore((state) => state.updatePlayerScore);

  // Keep track of timers for cleanup
  const timers = useRef<NodeJS.Timeout[]>([]);

  // Helper to safely set timeouts
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
    return timer;
  }, []);

  // Cleanup all timers
  const cleanupTimers = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  }, []);

  // Game timer effect
  useEffect(() => {
    if (roomData.gameStarted && timeLeft > 0) {
      const timer = safeSetTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, roomData.gameStarted, safeSetTimeout]);

  // Socket event handlers
  const socketEventHandlers = useCallback(
    () => ({
      allAnswered: () => {
        setAllAnswered(true);
        setNextQuestionCountdown(5);
      },
      hostJoined: (data: RoomData) => {
        storeJoinRoom(data);
      },
      playerJoined: (data: RoomData) => {
        storeJoinRoom(data);
      },
      receivedMessage: (message: string, user: string) => {
        messageReceived({ message, user });
        setNewMessage("");
      },
      gameStarted: () => {
        storeStartGame();
      },
      updatePlayerScore: (name: string, score: number) => {
        updatePlayerScore(name, score);
      },
      nextQuestion: (currentQuestionNum: number) => {
        setCurrentQuestion(currentQuestionNum);
        setSelectedOption(null);
        setHasAnswered(false);
        setAllAnswered(false);
        setTimeLeft(Number(roomData.timeLimit));
      },
      gameEnd: async () => {
        console.log("Received gameEnd event"); // Add logging
        cleanupTimers();
        try {
          router.push(`/game-over/${roomData.gameId}`);
        } catch (error) {
          console.error("Failed to navigate to game-over:", error);
          toast.error("Failed to end game properly");
        }
      },
      error: ({ message }: { message: string }) => {
        toast.error(message);
      },
    }),
    [
      storeJoinRoom,
      messageReceived,
      storeStartGame,
      updatePlayerScore,
      setCurrentQuestion,
      roomData.timeLimit,
      roomData.gameId,
      router,
      cleanupTimers,
    ]
  );

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handlers = socketEventHandlers();

    // Register all event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event as keyof typeof handlers, handler);
      console.log(`Registered handler for ${event} event`); // Add logging
    });

    // Cleanup function
    return () => {
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
      cleanupTimers();
    };
  }, [socket, socketEventHandlers, cleanupTimers]);

  // Initial room join
  useEffect(() => {
    if (!socket) return;

    const lsRoomId = localStorage.getItem("roomId");
    const lsPlayerName = localStorage.getItem("playerName");

    if (!lsRoomId || !lsPlayerName) {
      toast.error("Session information not found");
      router.push("/");
      return;
    }

    if (isHost) {
      socket.emit("hostJoin", lsPlayerName, lsRoomId);
    } else {
      socket.emit("joinRoom", lsRoomId, lsPlayerName);
    }
  }, [socket, isHost, router]);

  // Message handling
  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const messageVal = newMessage.trim();
      if (!messageVal) return;

      if (socket && roomData.gameId) {
        socket.emit("sendMessage", roomData.gameId, messageVal, playerName);
      } else {
        toast.error("Failed to send message");
      }
    },
    [socket, roomData.gameId, newMessage, playerName]
  );

  // Game control handlers
  const handleStartGame = useCallback(() => {
    if (socket) {
      socket.emit("startGame", roomData.gameId);
    } else {
      toast.error("Failed to start game");
    }
  }, [socket, roomData.gameId]);

  const handleSubmitAnswer = useCallback(
    (answer: string) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const currentQuestionObj = roomData.questions[roomData.currentQuestion - 1];
        const basePoints = 100;
        const timeBonus = Math.floor(timeLeft * 3.33);
        const isCorrect = answer === currentQuestionObj.correct_answer;
        const points = isCorrect ? basePoints + timeBonus : 0;

        if (socket) {
          socket.emit(
            "submitAnswer",
            roomData.gameId,
            playerName,
            points,
            Number(roomData.timeLimit) - timeLeft
          );
        }
        setSelectedOption(answer);
        setHasAnswered(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      roomData.questions,
      roomData.currentQuestion,
      timeLeft,
      socket,
      roomData.gameId,
      playerName,
      roomData.timeLimit,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, [cleanupTimers]);

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
