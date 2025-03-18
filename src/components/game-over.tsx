"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Home, RotateCcw, Crown, Star, Zap, Target } from "lucide-react";
import confetti from "canvas-confetti";

interface Player {
    id: number
    name: string
    score: number
    isCurrentUser?: boolean
    correctAnswers: number
    totalAnswers: number
    fastestAnswer: number // in seconds
}

interface GameOverProps {
    players: Player[]
    gameSettings: {
        category: string
        difficulty: string
        totalQuestions: number
    }
    onPlayAgain: () => void
}

export default function GameOver({ players, gameSettings, onPlayAgain }: GameOverProps) {
    const router = useRouter()
    const [showStats, setShowStats] = useState(false)
    const [animateScores, setAnimateScores] = useState(false)

    // Sort players by score (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

    // Get top 3 players for the podium
    const topPlayers = sortedPlayers.slice(0, 3)
    // Fill with empty players if less than 3
    while (topPlayers.length < 3) {
        topPlayers.push({
            id: -topPlayers.length,
            name: "No Player",
            score: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            fastestAnswer: 0,
        })
    }

    // Get current user's rank
    const currentUserRank = sortedPlayers.findIndex((player) => player.isCurrentUser) + 1

    // Find player with most correct answers
    const mostAccurate = [...players].sort(
        (a, b) => b.correctAnswers / b.totalAnswers - a.correctAnswers / a.totalAnswers,
    )[0]

    // Find player with fastest answers
    const fastest = [...players].sort((a, b) => a.fastestAnswer - b.fastestAnswer)[0]

    // Trigger confetti effect when component mounts
    useEffect(() => {
        // Trigger confetti
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval: NodeJS.Timeout = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            // Since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        }, 250)

        // Animate scores after a short delay
        const scoreTimer = setTimeout(() => {
            setAnimateScores(true)
        }, 800)

        // Show stats after scores animate
        const statsTimer = setTimeout(() => {
            setShowStats(true)
        }, 1600)

        return () => {
            clearInterval(interval)
            clearTimeout(scoreTimer)
            clearTimeout(statsTimer)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Game Over!
                    </h1>
                    <p className="text-xl text-muted-foreground">Final Scores</p>
                </div>

                {/* Podium section */}
                <div className="relative h-80 mb-16">
                    {/* Second Place */}
                    <div className="absolute left-0 bottom-0 w-1/3 flex flex-col items-center animate-in slide-in-from-left duration-500">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-[#C0C0C0] shadow-lg">
                                <AvatarFallback className="bg-[#C0C0C0] text-white text-2xl">
                                    {topPlayers[1].name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Medal className="absolute -bottom-2 -right-2 h-10 w-10 text-[#C0C0C0]" />
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-bold">{topPlayers[1].name}</p>
                            <p
                                className={`text-xl font-bold ${animateScores ? "animate-in zoom-in fade-in duration-300" : "opacity-0"}`}
                            >
                                {topPlayers[1].score}
                            </p>
                        </div>
                        <div className="w-full mt-auto">
                            <div className="h-32 bg-[#C0C0C0]/80 rounded-t-lg flex items-end justify-center pb-2">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                        </div>
                    </div>

                    {/* First Place */}
                    <div className="absolute left-1/3 right-1/3 bottom-0 flex flex-col items-center animate-in fade-in-0 slide-in-from-top duration-700">
                        <div className="relative">
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                                <Crown className="h-10 w-10 text-yellow-500" />
                            </div>
                            <Avatar className="h-32 w-32 border-4 border-yellow-500 shadow-xl">
                                <AvatarFallback className="bg-yellow-500 text-white text-3xl">
                                    {topPlayers[0].name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Trophy className="absolute -bottom-4 -right-4 h-12 w-12 text-yellow-500" />
                        </div>
                        <div className="mt-3 text-center">
                            <p className="font-bold text-lg">{topPlayers[0].name}</p>
                            <p
                                className={`text-3xl font-extrabold text-primary ${animateScores ? "animate-in zoom-in fade-in duration-500 delay-300" : "opacity-0"}`}
                            >
                                {topPlayers[0].score}
                            </p>
                        </div>
                        <div className="w-full mt-auto">
                            <div className="h-40 bg-yellow-500/80 rounded-t-lg flex items-end justify-center pb-2">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                        </div>
                    </div>

                    {/* Third Place */}
                    <div className="absolute right-0 bottom-0 w-1/3 flex flex-col items-center animate-in slide-in-from-right duration-500">
                        <div className="relative">
                            <Avatar className="h-20 w-20 border-4 border-[#CD7F32] shadow-lg">
                                <AvatarFallback className="bg-[#CD7F32] text-white text-xl">
                                    {topPlayers[2].name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Award className="absolute -bottom-2 -right-2 h-8 w-8 text-[#CD7F32]" />
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-bold">{topPlayers[2].name}</p>
                            <p
                                className={`text-lg font-bold ${animateScores ? "animate-in zoom-in fade-in duration-300" : "opacity-0"}`}
                            >
                                {topPlayers[2].score}
                            </p>
                        </div>
                        <div className="w-full mt-auto">
                            <div className="h-24 bg-[#CD7F32]/80 rounded-t-lg flex items-end justify-center pb-2">
                                <span className="text-xl font-bold text-white">3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your stats card */}
                {currentUserRank > 0 && (
                    <Card
                        className={`mb-8 overflow-hidden border-2 border-primary/50 shadow-lg ${showStats ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-500" : "opacity-0"}`}
                    >
                        <div className="bg-primary/10 p-4">
                            <h2 className="text-xl font-bold">Your Performance</h2>
                        </div>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                            <div className="text-center space-y-2">
                                <div className="text-4xl font-bold text-primary">#{currentUserRank}</div>
                                <p className="text-sm text-muted-foreground">Final Rank</p>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <Target className="h-5 w-5 text-green-500" />
                                    <span className="text-2xl font-bold">
                    {players.find((p) => p.isCurrentUser)?.correctAnswers || 0}/{gameSettings.totalQuestions}
                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">Correct Answers</p>
                                <Progress
                                    value={
                                        ((players.find((p) => p.isCurrentUser)?.correctAnswers || 0) / gameSettings.totalQuestions) * 100
                                    }
                                    className="h-2"
                                />
                            </div>

                            <div className="text-center space-y-2">
                                <div className="text-2xl font-bold">{players.find((p) => p.isCurrentUser)?.score || 0}</div>
                                <p className="text-sm text-muted-foreground">Total Score</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Leaderboard */}
                <div
                    className={`mb-8 ${showStats ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100" : "opacity-0"}`}
                >
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Leaderboard
                    </h2>
                    <Card>
                        <ScrollArea className="h-64">
                            <div className="p-4 space-y-2">
                                {sortedPlayers.map((player, index) => (
                                    <div
                                        key={player.id}
                                        className={`flex items-center justify-between p-3 rounded-lg ${
                                            player.isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 text-center font-bold">#{index + 1}</div>
                                            <Avatar>
                                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name}</span>
                                            {player.isCurrentUser && (
                                                <Badge variant="outline" className="ml-2">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-muted-foreground">
                                                {player.correctAnswers}/{player.totalAnswers} correct
                                            </div>
                                            <span className="font-bold text-lg">{player.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Awards section */}
                <div
                    className={`mb-10 ${showStats ? "animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200" : "opacity-0"}`}
                >
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        Special Awards
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Most Accurate Player */}
                        <Card className="overflow-hidden">
                            <div className="bg-green-500/10 p-4 flex items-center gap-3">
                                <Target className="h-6 w-6 text-green-500" />
                                <h3 className="font-bold">Most Accurate Player</h3>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{mostAccurate.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{mostAccurate.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {mostAccurate.correctAnswers}/{mostAccurate.totalAnswers} correct
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-green-600">
                                        {Math.round((mostAccurate.correctAnswers / mostAccurate.totalAnswers) * 100)}%
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fastest Player */}
                        <Card className="overflow-hidden">
                            <div className="bg-blue-500/10 p-4 flex items-center gap-3">
                                <Zap className="h-6 w-6 text-blue-500" />
                                <h3 className="font-bold">Fastest Player</h3>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{fastest.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{fastest.name}</p>
                                            <p className="text-sm text-muted-foreground">Lightning fast reflexes</p>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">{fastest.fastestAnswer.toFixed(1)}s</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2" onClick={onPlayAgain}>
                        <RotateCcw className="h-4 w-4" />
                        Play Again
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2" onClick={() => router.push("/")}>
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    )
}

