import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // Directly import `immer` from the middleware
import { Message, RoomData, TimeLimit } from "@/lib/types";

type GameState = {
  roomData: RoomData;
  playerName: string;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  joinRoom: (roomData: RoomData) => void;
  setRoomData: (roomData: RoomData) => void;
  setPlayerName: (name: string) => void;
  updatePlayerScore: (playerName: string, newScore: number) => void;
  setCurrentQuestion: (questionNum: number) => void;
  startGame: () => void;
  resetGame: () => void;
  messageReceived: (message: Message) => void;
};

const useGameStore = create<GameState>()(
  immer((set) => ({
    roomData: {
      gameId: "",
      players: [],
      host: "",
      questions: [],
      messages: [],
      currentQuestion: 1,
      gameStarted: false,
      category: 9,
      difficulty: "mixed",
      timeLimit: "30" as TimeLimit,
    },
    playerName: "",
    isHost: false,

    setIsHost: (isHost) =>
      set((state) => {
        state.isHost = isHost;
      }),

    joinRoom: (roomData) =>
      set((state) => {
        state.roomData = roomData;
      }),

    setRoomData: (roomData) =>
      set((state) => {
        state.roomData = roomData;
      }),

    setPlayerName: (name) =>
      set((state) => {
        state.playerName = name;
      }),

    updatePlayerScore: (playerName, newScore) =>
      set((state) => {
        const player = state.roomData.players.find((p) => {
          console.log(`storePlayerName: ${p.name}, playerName: ${playerName}`);
          console.log(playerName);
          return p.name === playerName;
        });
        if (player) {
          player.score = newScore;
          console.log("mutated player score");
        } else {
          console.log("Failed to find player");
        }
      }),

    setCurrentQuestion: (questionNum) =>
      set((state) => {
        state.roomData.currentQuestion = questionNum;
      }),

    startGame: () =>
      set((state) => {
        state.roomData.gameStarted = true;
        state.roomData.messages.push({
          user: "System",
          message: "Game has started!",
        });
      }),

    resetGame: () =>
      set((state) => {
        state.roomData.gameStarted = false;
        state.roomData.currentQuestion = 0;
        state.roomData.players.forEach((player) => {
          player.score = 0;
        });
      }),

    messageReceived: (message) =>
      set((state) => {
        state.roomData.messages.push(message);
      }),
  }))
);

export default useGameStore;
