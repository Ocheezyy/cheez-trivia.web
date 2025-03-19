import { create } from 'zustand';
import { Message, Player, RoomData, TimeLimit } from "@/lib/types";

type GameState = {
    roomData: RoomData;
    playerName: string;
    isHost: boolean;
    joinRoom: (roomData: RoomData) => void;
    addPlayer: (player: Player) => void;
    setPlayerName: (name: string) => void;
    updatePlayerScore: (playerName: string, score: number) => void;
    setCurrentQuestion: (questionNum: number) => void;
    startGame: () => void;
    resetGame: () => void;
    messageReceived: (message: Message) => void;
};

const useGameStore = create<GameState>((set) => ({
    roomData: {
        gameId: '',
        players: [],
        host: '',
        questions: [],
        messages: [],
        currentQuestion: 1,
        gameStarted: false,
        category: 9,
        difficulty: 'mixed',
        timeLimit: "30" as TimeLimit,
    },
    playerName: '',
    isHost: false,

    joinRoom: (roomData) => set({ roomData }),

    addPlayer: (player) => set((state) => ({
        roomData: {
            ...state.roomData,
            players: [...state.roomData.players, player],
        },
    })),

    setPlayerName: (name) => set({ playerName: name }),

    updatePlayerScore: (playerName, score) => set((state) => ({
        roomData: {
            ...state.roomData,
            players: state.roomData.players.map((player) =>
                player.name === playerName ? { ...player, score } : player
            ),
        },
    })),

    setCurrentQuestion: (questionNum) => set((state) => ({
        roomData: {
            ...state.roomData,
            currentQuestion: questionNum,
        },
    })),

    startGame: () => set((state) => ({
        roomData: {
            ...state.roomData,
            messages: [ ...state.roomData.messages, { user: "System", message: "Game has started!" }],
            gameStarted: true,
        },
    })),

    resetGame: () => set((state) => ({
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

    messageReceived: (message) => set((state) => ({
        roomData: {
            ...state.roomData,
            messages: [...state.roomData.messages, message],
        },
    })),
}));

export default useGameStore;