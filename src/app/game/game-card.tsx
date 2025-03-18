import {ArrowRight, CheckCircle2, Clock, Play, XCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import type React from "react";
import {Badge} from "@/components/ui/badge";

type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
}

type GameCardProps = {
    gameStarted: boolean;
    questionAnswered: boolean;
    isHost: boolean;
    timeLeft: number;
    selectedOption: string  | null;
    setSelectedOption: (option: string) => void;
    question?: Question;
    handleStartGame: () => void;
    handleSubmitAnswer: () => void;
    handleNextQuestion: () => void;
    pointsEarned: number;
}

export const GameCard = ({ gameStarted, isHost, questionAnswered, timeLeft, selectedOption, setSelectedOption, question, handleStartGame, handleNextQuestion, pointsEarned }: GameCardProps) => {
    if (!gameStarted) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Waiting for Players</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="py-8">
                        <h3 className="text-xl font-medium mb-2">Room Code:</h3>
                        <div className="text-3xl font-bold tracking-widest bg-muted inline-block px-6 py-3 rounded-md">
                            XYZW42
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Share this code with your friends to join the game
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Game Settings:</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge variant="outline">10 Questions</Badge>
                            <Badge variant="outline">Mixed Categories</Badge>
                            <Badge variant="outline">Medium Difficulty</Badge>
                            <Badge variant="outline">30s per Question</Badge>
                        </div>
                    </div>

                    {isHost && (
                        <Button size="lg" className="mt-6 px-8" onClick={handleStartGame}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Game
                        </Button>
                    )}

                    {!isHost && <div className="py-4 text-muted-foreground">Waiting for host to start the game...</div>}
                </CardContent>
            </Card>
        )
    }

    if (questionAnswered) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Waiting for Players</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-4">
                        {selectedOption === question?.correctAnswer ? (
                            <>
                                <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Correct!</h3>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-16 w-16 text-red-500 mb-2" />
                                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Incorrect</h3>
                            </>
                        )}
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                        <p className="font-medium mb-2">Question:</p>
                        <p className="mb-4">{question?.question}</p>

                        <p className="font-medium mb-2">Correct Answer:</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {question?.correctAnswer}
                        </p>

                        {selectedOption !== question?.correctAnswer && (
                            <>
                                <p className="font-medium mt-4 mb-2">Your Answer:</p>
                                <p className="text-lg font-bold text-red-600 dark:text-red-400">{selectedOption}</p>
                            </>
                        )}
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                        <p className="font-medium mb-2">Points Earned:</p>
                        <p className="text-3xl font-bold">+{pointsEarned}</p>
                        {pointsEarned > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                                (100 base + {pointsEarned - 100} time bonus)
                            </p>
                        )}
                    </div>

                    <Button className="w-full flex items-center justify-center gap-2" onClick={handleNextQuestion}>
                        Next Question
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            {/* Timer - only show when game is started */}
            <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Time Remaining: {timeLeft}s</span>
            </div>
            <Progress value={(timeLeft / 30) * 100} className="h-2" />

            {/* Question card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Question 3 of 10</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="text-2xl font-bold mb-6">{question?.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question?.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedOption === option ? "default" : "outline"}
                                className={`h-auto py-6 text-lg justify-start ${
                                    selectedOption === option ? "border-primary" : ""
                                }`}
                                onClick={() => setSelectedOption(option)}
                            >
                                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                            </Button>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={!selectedOption}>
                        Submit Answer
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}