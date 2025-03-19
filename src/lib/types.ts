import { Socket } from 'socket.io-client';

export type Difficulty = "easy" | "medium" | "hard" | "mixed";
export type TimeLimit = "15" | "30" | "45" | "60";
// export type SocketSendEvents = "createRoom" | "joinRoom" | "submitAnswer" | "sendMessage" | "nextQuestion" | "startGame";
// export type SocketResponseEvents = "roomCreated" | "playerJoined" | "updatePlayerScore" | "joinFailed" | "receivedMessage" | "nextQuestion" | "gameStarted";


type SocketSendEvents = {
    createRoom: (playerName: string, numQuestions: number, categoryId: number, difficulty: Difficulty, timeLimit: TimeLimit) => void;
    joinRoom: (roomId: string, playerName: string) => void;
    submitAnswer: (roomId: string, playerName: string, points: number) => void;
    sendMessage: (roomId: string, message: string, playerName: string) => void;
    nextQuestion: (roomId: string, playerName: string) => void;
    startGame: (roomId: string) => void;
}

type SocketResponseEvents = {
    roomCreated: (data: RoomData) => void;
    playerJoined: (data: RoomData) => void;
    updatePlayerScore: (playerName: string, score: number) => void;
    joinFailed: () => void;
    receivedMessage: (message: string, playerName: string) => void;
    nextQuestion: (currentQuestion: number) => void;
    gameStarted: () => void;
    gameEnd: () => void;
}


export type Question = {
    type: "multiple" | "boolean";
    difficulty: Difficulty;
    category: string;
    question: string;
    correct_answer: string;
    all_answers: string[];
};

export type Player = {
    id: string;
    name: string;
    score: number;
}

export type Message = {
    message: string;
    user: string;
}

export type RoomData = {
    gameId: string;
    players: Player[];
    host: string;
    questions: Question[];
    messages: Message[];
    currentQuestion: number;
    gameStarted: boolean;
    category: number;
    difficulty: Difficulty;
    timeLimit: TimeLimit;
};



// @ts-expect-error Not extending correctly, but it matches the types for what I need
export interface TypedClientSocket extends Socket {
    // Emit events (client -> server)
    emit: <T extends keyof SocketSendEvents>(
        event: T,
        ...args: Parameters<SocketSendEvents[T]>
    ) => this;

    // Listen for events (server -> client)
    on: <T extends keyof SocketResponseEvents>(
        event: T,
        listener: SocketResponseEvents[T]
    ) => this;
}