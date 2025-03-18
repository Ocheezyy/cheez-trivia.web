export type Difficulty = "easy" | "medium" | "hard" | "mixed";
export type TimeLimit = "15" | "30" | "45" | "60";

export type Question = {
    type: "multiple" | "boolean";
    difficulty: Difficulty;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export type Player = {
    name: string;
    score: number;
}

export type TriviaResponse = {
    response_code: number;
    results: Question[];
};

export type Message = {
    message: string;
    user: string;
    date: Date;
}