import { create } from "zustand";
import { Message, RoomData, TimeLimit } from "@/lib/types";

type GameState = {
  roomData: RoomData;
  playerName: string;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  joinRoom: (roomData: RoomData) => void;
  setPlayerName: (name: string) => void;
  updatePlayerScore: (playerName: string, newScore: number) => void;
  setCurrentQuestion: (questionNum: number) => void;
  startGame: () => void;
  resetGame: () => void;
  messageReceived: (message: Message) => void;
};

const useGameStore = create<GameState>((set) => ({
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

  setIsHost: (isHost: boolean) => set({ isHost }),

  joinRoom: (roomData) => set({ roomData }),

  setPlayerName: (name) => set({ playerName: name }),

  updatePlayerScore: (playerName, newScore) =>
    set((state) => {
      const updatedPlayers = state.roomData.players.map((player) =>
        player.name === playerName ? { ...player, score: newScore } : player
      );

      // Ensure that we return a new object reference for the entire roomData object
      return {
        roomData: {
          ...state.roomData,
          players: updatedPlayers, // Updated players array reference
        },
      };
    }),

  setCurrentQuestion: (questionNum) =>
    set((state) => ({
      roomData: {
        ...state.roomData,
        currentQuestion: questionNum,
      },
    })),

  startGame: () =>
    set((state) => ({
      roomData: {
        ...state.roomData,
        messages: [...state.roomData.messages, { user: "System", message: "Game has started!" }],
        gameStarted: true,
      },
    })),

  resetGame: () =>
    set((state) => ({
      roomData: {
        ...state.roomData,
        gameStarted: false,
        currentQuestion: 0,
        players: state.roomData.players.map((player) => ({
          ...player,
          score: 0,
        })),
      },
    })),

  messageReceived: (message) =>
    set((state) => ({
      roomData: {
        ...state.roomData,
        messages: [...state.roomData.messages, message],
      },
    })),
}));

export default useGameStore;
