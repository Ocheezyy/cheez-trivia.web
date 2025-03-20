"use client"

import type { Difficulty, TimeLimit } from "@/lib/types";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/constants";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import Spinner from "@/components/spinner";


export default function CreateGamePage() {
    const { mutate: createRoom, isPending } = useCreateRoom();
    const [name, setName] = useState<string>("");
    const [numQuestions, setNumQuestions] = useState(10);
    const [categoryId, setCategoryId] = useState<string>("");
    const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
    const [timeLimit, setTimeLimit] = useState<TimeLimit>("30");

    const handleCreateRoom = () => {
        createRoom({ playerName: name, numQuestions, categoryId: Number(categoryId), difficulty, timeLimit});
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Link href="/" className="flex items-center gap-2 text-sm mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Create New Game</CardTitle>
                    <CardDescription>Customize your trivia challenge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            placeholder="John"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Number of Questions: {numQuestions}</Label>
                        <Slider
                            id="numQuestions"
                            min={5}
                            max={30}
                            step={5}
                            value={[numQuestions]}
                            onValueChange={(value) => setNumQuestions(value[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={`category-${category.id}`} value={category.id.toString()}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                                <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time-limit">Time Limit Per Question (seconds)</Label>
                        <Select value={timeLimit} onValueChange={(value) => setTimeLimit(value as TimeLimit)}>
                            <SelectTrigger id="time-limit">
                                <SelectValue placeholder="Select time limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 seconds</SelectItem>
                                <SelectItem value="30">30 seconds</SelectItem>
                                <SelectItem value="45">45 seconds</SelectItem>
                                <SelectItem value="60">60 seconds</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleCreateRoom} disabled={isPending}>
                        Start Game {isPending ? <Spinner /> : null}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

