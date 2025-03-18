import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchTriviaQuestions } from "@/data/fetchTriviaQuestions";
import type { Difficulty } from "@/lib/types";
import { useGameStore } from "@/stores/useGameStore";


export function useTriviaQuestions(numQuestions?: number, category?: number, difficulty?: Difficulty) {
    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ['triviaQuestions', numQuestions, category, difficulty],
        queryFn: () => fetchTriviaQuestions(numQuestions, category, difficulty),
        staleTime: 1000 * 60 * 5, // Cache questions for 5 minutes
    });

    const setQuestions = useGameStore((state) => state.setQuestions)

    useEffect(() => {
        if (data) {
            setQuestions(data);
        }
    }, [ data, setQuestions ]);

    return { data, isLoading, error, isSuccess };
}