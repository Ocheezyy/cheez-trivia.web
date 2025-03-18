"use client"

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Users } from "lucide-react";
import { GameCard } from "@/app/game/game-card";

// Sample data for demonstration
const sampleQuestion = {
    question: "Which planet in our solar system has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: "Saturn",
}

const samplePlayers = [
    { id: 1, name: "You", score: 1200, isCurrentUser: true, isHost: true },
    { id: 2, name: "Player 2", score: 950 },
    { id: 3, name: "Player 3", score: 800 },
    { id: 4, name: "Player 4", score: 750 },
]

const sampleMessages = [
    { id: 1, sender: "System", message: "Waiting for host to start the game..." },
    { id: 2, sender: "Player 2", message: "I'm ready!" },
    { id: 3, sender: "Player 3", message: "Let's go!" },
    { id: 4, sender: "You", message: "Starting soon, just waiting for more players." },
]

export default function GamePage() {
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [messages, setMessages] = useState(sampleMessages);
    const [newMessage, setNewMessage] = useState<string>("");
    const [pointsEarned, setPointsEarned] = useState<number>(0);
    const [hasAnswered, setHasAnswered] = useState<boolean>(false);

    // Timer countdown effect (only when game is started)
    useEffect(() => {
        if (gameStarted && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
        // Time's up logic would go here
    }, [timeLeft, gameStarted])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: "You", message: newMessage }])
            setNewMessage("")
        }
    }

    const handleStartGame = () => {
        setMessages([...messages, { id: messages.length + 1, sender: "System", message: "Game has started!" }]);
        setGameStarted(true);
    }

    const handleSubmitAnswer = () => {
        // Calculate points based on time left (faster answers get more points)
        const basePoints = 100;
        const timeBonus = Math.floor(timeLeft * 3.33); // Up to 100 bonus points for fastest answer
        const isCorrect = selectedOption === sampleQuestion.correctAnswer;

        // Only award points if the answer is correct
        const points = isCorrect ? basePoints + timeBonus : 0;

        setPointsEarned(points);
        setHasAnswered(true);
    }

    const handleNextQuestion = () => {
        // Reset for next question
        setSelectedOption(null);
        setHasAnswered(false);
        setTimeLeft(30);

        // // In a real app, you would load the next question here
        // // For demo purposes, we'll just increment the question counter
        // if (currentQuestion < totalQuestions) {
        //     setCurrentQuestion((prev) => prev + 1)
        // } else {
        //     // Game over logic would go here
        //     alert("Game Over! Final scores are displayed.")
        // }
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main game area */}
                <div className="lg:col-span-2 space-y-4">
                    <GameCard
                        gameStarted={gameStarted}
                        question={sampleQuestion}
                        questionAnswered={hasAnswered}
                        isHost={true}
                        timeLeft={timeLeft}
                        pointsEarned={pointsEarned}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        handleStartGame={handleStartGame}
                        handleSubmitAnswer={handleSubmitAnswer}
                        handleNextQuestion={handleNextQuestion}
                    />
                </div>

                {/* Sidebar with players and chat */}
                <div className="space-y-4">
                    <Tabs defaultValue="players">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="players" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Players</span>
                            </TabsTrigger>
                            <TabsTrigger value="chat" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Players tab */}
                        <TabsContent value="players">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Players ({samplePlayers.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px]">
                                        <div className="space-y-4">
                                            {samplePlayers.map((player) => (
                                                <div
                                                    key={player.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg ${
                                                        player.isCurrentUser ? "bg-muted" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{player.name}</span>
                                                        <div className="flex gap-1">
                                                            {player.isCurrentUser && (
                                                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                  You
                                </span>
                                                            )}
                                                            {player.isHost && (
                                                                <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-2 py-0.5 rounded">
                                  Host
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {gameStarted ? (
                                                        <span className="font-bold">{player.score}</span>
                                                    ) : (
                                                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded">
                              Ready
                            </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Chat tab */}
                        <TabsContent value="chat">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Chat</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[350px] mb-4">
                                        <div className="space-y-4">
                                            {messages.map((msg) => (
                                                <div key={msg.id} className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm">{msg.sender}</span>
                                                        {msg.sender === "System" && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded">
                                System
                              </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm">{msg.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <Button type="submit" size="icon">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

