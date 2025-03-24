"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Users } from "lucide-react";
import { GameCard } from "@/app/game/game-card";
import useGameStore from "@/stores/useGameStore";
import { useSocket } from "@/hooks/useSocket";
import useGameSocket from "@/hooks/useGameSocket";

export default function GamePage() {
  const socket = useSocket();

  const roomData = useGameStore((state) => state.roomData);
  const players = useGameStore((state) => state.roomData.players);
  const isHost = useGameStore((state) => state.isHost);
  const playerName = useGameStore((state) => state.playerName);

  const {
    hasAnswered,
    handleSubmitAnswer,
    handleStartGame,
    selectedOption,
    setSelectedOption,
    allAnswered,
    nextQuestionCountdown,
    setNewMessage,
    newMessage,
    handleSendMessage,
    timeLeft,
  } = useGameSocket({ socket, isHost, roomData, playerName });

  const pointsEarned = players.find((p) => p.name === playerName)?.score || 0;
  const sortedPlayersByScore = [...players].sort((a, b) => b.score - a.score);

  // console.log("gamePage", roomData);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main game area */}
        <div className="lg:col-span-2 space-y-4">
          <GameCard
            roomData={roomData}
            questionAnswered={hasAnswered}
            isHost={isHost}
            timeLeft={timeLeft}
            currentPlayerName={playerName}
            pointsEarned={pointsEarned}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handleStartGame={handleStartGame}
            handleSubmitAnswer={handleSubmitAnswer}
            allAnswered={allAnswered}
            nextQuestionCountdown={nextQuestionCountdown}
            sortedPlayersByScore={sortedPlayersByScore}
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
                  <CardTitle>Players ({players.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {sortedPlayersByScore.map((player) => {
                        const isCurrentUser = player.name === playerName;
                        return (
                          <div
                            key={player.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isCurrentUser ? "bg-muted" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{player.name}</span>
                              <div className="flex gap-1">
                                {isCurrentUser && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                    You
                                  </span>
                                )}
                                {player.name === roomData.host && (
                                  <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-2 py-0.5 rounded">
                                    Host
                                  </span>
                                )}
                              </div>
                            </div>
                            {roomData.gameStarted ? (
                              <span className="font-bold">{player.score}</span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded">
                                Ready
                              </span>
                            )}
                          </div>
                        );
                      })}
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
                      {roomData.messages.map((msg, idx) => (
                        <div key={`msg-${idx}`} className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{msg.user}</span>
                            {msg.user === "System" && (
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
  );
}
