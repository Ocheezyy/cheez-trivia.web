import { buildTriviaUrl } from '@/lib/utils';
import type { Difficulty, TriviaResponse } from "@/lib/types";

export async function fetchTriviaQuestions(numQuestions?: number, category?: number, difficulty?: Difficulty) {
    const url = buildTriviaUrl(numQuestions, category, difficulty);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch trivia questions');
    const data: TriviaResponse = await response.json();
    return data.results;
}