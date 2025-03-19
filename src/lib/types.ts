export type Difficulty = "easy" | "medium" | "hard" | "mixed";
export type TimeLimit = "15" | "30" | "45" | "60";
export type SocketSendEvents = "createRoom" | "joinRoom" | "submitAnswer" | "sendMessage";
export type SocketResponseEvents = "roomCreated" | "playerJoined" | "updatePlayerScore" | "joinFailed" | "receivedMessage";

export type Question = {
    type: "multiple" | "boolean";
    difficulty: Difficulty;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

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
