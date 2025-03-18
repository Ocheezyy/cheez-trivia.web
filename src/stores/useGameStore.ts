import { create } from 'zustand';
import type { Message, Player, Question } from "@/lib/types";

type GameState = {
    gameId: string;
    playerName: string;
    players: Player[];
    questions: Question[];
    messages: Message[];
    currentQuestion: Question | null;
    isHost: boolean;
    gameStarted: boolean;
    addPlayer: (player: Player) => void;
    setPlayerName: (name: string) => void;
    updatePlayerScore: (playerId: string, score: number) => void;
    setQuestions: (questions: Question[]) => void;
    setCurrentQuestion: (question: Question) => void;
    setIsHost: (isHost: boolean) => void;
    startGame: () => void;
    resetGame: () => void;
    setMessages: (messages: Message[]) => void;
};

export const useGameStore = create<GameState>((set) => ({
    // Initial state
    gameId: '',
    playerName: "",
    players: [],
    questions: [],
    messages: [],
    currentQuestion: null,
    isHost: false,
    gameStarted: false,

    // Actions (setters)
    addPlayer: (player) =>
        set((state) => ({
            players: [...state.players, player],
        })),

    updatePlayerScore: (playerName, score) =>
        set((state) => ({
            players: state.players.map((player) =>
                player.name === playerName ? { ...player, score } : player
            ),
        })),

    setPlayerName: (name: string) =>
        set({ playerName: name }),

    setQuestions: (questions) => set({ questions }),

    setCurrentQuestion: (question) => set({ currentQuestion: question }),

    setMessages: (messages) => set({ messages }),

    setIsHost: (isHost) => set({ isHost }),

    startGame: () => set({ gameStarted: true }),

    resetGame: () =>
        set({
            players: [],
            questions: [],
            currentQuestion: null,
            isHost: false,
            gameStarted: false,
        }),
}));