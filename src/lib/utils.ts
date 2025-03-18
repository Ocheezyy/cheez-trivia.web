import type { Difficulty } from "@/lib/types";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildTriviaUrl(numQuestions?: number, category?: number, difficulty?: Difficulty) {
  let url = "https://opentdb.com/api.php?amount=10&category=23&difficulty=medium";

  if (numQuestions) url = url + `amount=${numQuestions}&`;
  if (category) url = url + `category=${category}&`;
  if (difficulty) url = url + "difficulty=medium";

  if (url.endsWith("&")) url = url.substring(0, url.length - 1);
  return url;
}