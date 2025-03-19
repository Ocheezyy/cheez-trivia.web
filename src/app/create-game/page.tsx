"use client"

import { useEffect } from "react";
import type { Difficulty, RoomData, TimeLimit } from "@/lib/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import useGameStore from "@/stores/useGameStore";
import { categories } from "@/lib/constants";


export default function CreateGamePage() {
    const socket = useSocket();
    const joinRoom = useGameStore((state) => state.joinRoom);
    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [numQuestions, setNumQuestions] = useState(10);
    const [categoryId, setCategoryId] = useState<string>("");
    const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
    const [timeLimit, setTimeLimit] = useState<TimeLimit>("30");


    const createRoom = () => {
        if (!name) {
            toast.error("Please enter a name");
            return;
        }
        if (!categoryId) {
            toast.error("Please enter a category");
            return;
        }

        if (socket) {
            socket.emit('createRoom', name, numQuestions, Number(categoryId), difficulty, timeLimit);
            toast("Creating room...");
        } else {
            toast("Failed to create a room");
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (data: RoomData) => {
                console.log(`Room created:`, data);
                joinRoom(data);
                router.push("/game");
            });
        }

        return () => {
            if (socket) { socket.off('roomCreated'); }
        };
    }, [socket, joinRoom, router]);

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
                    <Button className="w-full" onClick={createRoom}>
                        Start Game
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

