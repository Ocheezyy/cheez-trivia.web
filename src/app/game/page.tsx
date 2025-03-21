"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";

export default function GamePage() {
  const socket = useSocket();
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [allAnswered, setAllAnswered] = useState<boolean>(false);
  const [nextQuestionCountdown, setNextQuestionCountdown] = useState(10);

  const roomData = useGameStore((state) => state.roomData);
  const players = useGameStore((state) => state.roomData.players);
  const isHost = useGameStore((state) => state.isHost);
  const playerName = useGameStore((state) => state.playerName);
  const storeJoinRoom = useGameStore((state) => state.joinRoom);
  const messageReceived = useGameStore((state) => state.messageReceived);
  const storeStartGame = useGameStore((state) => state.startGame);
  const updatePlayerScore = useGameStore((state) => state.updatePlayerScore);
  const setCurrentQuestion = useGameStore((state) => state.setCurrentQuestion);
  const pointsEarned = players.find((p) => p.name === playerName)?.score || 0;
  const sortedPlayersByScore = [...players].sort((a, b) => b.score - a.score);

  // console.log("gamePage", roomData);

  useEffect(() => {
    if (roomData.gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    // Time's up logic would go here
  }, [timeLeft, roomData]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageVal = newMessage.trim();
    if (!messageVal) return;

    if (socket && roomData.gameId) {
      socket.emit("sendMessage", roomData.gameId, messageVal, playerName);
    } else {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (!socket) return;
    const lsRoomId = localStorage.getItem("roomId");
    const lsPlayerName = localStorage.getItem("playerName");
    if (!lsRoomId || !lsPlayerName) {
      console.error(
        `Required local storage item not found. roomId: ${lsRoomId}, playerName: ${lsPlayerName}`
      );
      return;
    }

    if (isHost) {
      socket.emit("hostJoin", lsPlayerName, lsRoomId);
    } else {
      socket.emit("joinRoom", lsRoomId, lsPlayerName);
    }
  }, [socket, isHost]);

  useEffect(() => {
    if (allAnswered && nextQuestionCountdown > 0) {
      const timer = setTimeout(() => {
        setNextQuestionCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (allAnswered && nextQuestionCountdown === 0) {
      // Maybe show something here
    }
  }, [allAnswered, nextQuestionCountdown]);

  useEffect(() => {
    if (!socket) return;
    socket.on("allAnswered", () => {
      setAllAnswered(true);
      setNextQuestionCountdown(10);
    });

    return () => {
      socket.off("allAnswered");
    };
  }, [socket, setAllAnswered]);

  useEffect(() => {
    if (!socket) return;

    socket.on("hostJoined", (data) => {
      storeJoinRoom(data);
      console.log("hostJoined", data);
    });

    return () => {
      socket.off("hostJoined");
    };
  }, [socket, storeJoinRoom]);

  useEffect(() => {
    if (!socket) return;

    socket.on("playerJoined", (data) => {
      storeJoinRoom(data);
      console.log("playerJoined", data);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [socket, storeJoinRoom]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receivedMessage", (message, playerName) => {
      messageReceived({ message, user: playerName });
      setNewMessage("");
      console.log("receivedMessage", message, playerName);
    });

    return () => {
      socket.off("receivedMessage");
    };
  }, [socket, messageReceived]);

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", roomData.gameId);
    } else {
      toast.error("Failed to start game");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("gameStarted", () => storeStartGame());

    return () => {
      socket.off("gameStarted");
    };
  }, [socket, storeStartGame]);

  const handleSubmitAnswer = () => {
    // Calculate points based on time left (faster answers get more points)
    const currentQuestionObj = roomData.questions[roomData.currentQuestion - 1];
    const basePoints = 100;
    const timeBonus = Math.floor(timeLeft * 3.33); // Up to 100 bonus points for fastest answer
    const isCorrect = selectedOption === currentQuestionObj.correct_answer;
    const points = isCorrect ? basePoints + timeBonus : 0;

    if (socket) {
      socket.emit("submitAnswer", roomData.gameId, playerName, points);
    }
    setHasAnswered(true);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("updatePlayerScore", (playerName, score) => {
      updatePlayerScore(playerName, score);
      console.log("updatePlayerScore", playerName, score);
    });

    return () => {
      socket.off("updatePlayerScore");
    };
  }, [socket, updatePlayerScore]);

  useEffect(() => {
    if (!socket) return;

    socket.on("nextQuestion", (currentQuestionNum) => {
      console.log("nextQuestion called: " + currentQuestionNum);
      setCurrentQuestion(currentQuestionNum);
      setSelectedOption(null);
      setHasAnswered(false);
      setAllAnswered(false);
      setTimeLeft(Number(roomData.timeLimit));
    });

    return () => {
      socket.off("nextQuestion");
    };
  }, [socket, setCurrentQuestion, roomData.timeLimit]);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameEnd", () => {
      // do game end stuff here
    });
    return () => {
      socket.off("gameEnd");
    };
  }, [socket]);

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
