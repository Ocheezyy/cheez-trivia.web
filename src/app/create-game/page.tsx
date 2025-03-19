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


const categories = [{"id":9,"name":"General Knowledge"},{"id":10,"name":"Entertainment: Books"},{"id":11,"name":"Entertainment: Film"},{"id":12,"name":"Entertainment: Music"},{"id":13,"name":"Entertainment: Musicals & Theatres"},{"id":14,"name":"Entertainment: Television"},{"id":15,"name":"Entertainment: Video Games"},{"id":16,"name":"Entertainment: Board Games"},{"id":17,"name":"Science & Nature"},{"id":18,"name":"Science: Computers"},{"id":19,"name":"Science: Mathematics"},{"id":20,"name":"Mythology"},{"id":21,"name":"Sports"},{"id":22,"name":"Geography"},{"id":23,"name":"History"},{"id":24,"name":"Politics"},{"id":25,"name":"Art"},{"id":26,"name":"Celebrities"},{"id":27,"name":"Animals"},{"id":28,"name":"Vehicles"},{"id":29,"name":"Entertainment: Comics"},{"id":30,"name":"Science: Gadgets"},{"id":31,"name":"Entertainment: Japanese Anime & Manga"},{"id":32,"name":"Entertainment: Cartoon & Animations"}]

export default function CreateGamePage() {
    const socket = useSocket();
    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [numQuestions, setNumQuestions] = useState(10);
    const [categoryId, setCategoryId] = useState<string>("");
    const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
    const [timeLimit, setTimeLimit] = useState<TimeLimit>("30");


    const createRoom = () => {
        if (socket && name) {
            socket.emit('createRoom', { name, numQuestions, categoryId, difficulty, timeLimit });
            toast("Creating room...");
        } else {
            toast("Failed to create a room");
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (data: RoomData) => {
                console.log(`Room created:`, data);
                // router.push("/game");
            });
        }

        return () => {
            if (socket) { socket.off('roomCreated'); }
        };
    }, [socket]);

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
                        <Label htmlFor="gameName">Game Name</Label>
                        <Input
                            id="gameName"
                            placeholder="My Awesome Trivia Game"
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

