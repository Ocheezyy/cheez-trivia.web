"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scroll } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { RoomData } from "@/lib/types";
import { toast } from "sonner";
import useGameStore from "@/stores/useGameStore";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

export default function HomePage() {
    const socket = useSocket();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const storeJoinRoom = useGameStore(state => state.joinRoom);

    const joinRoom = () => {
        setIsJoining(true);
        // Hit api route to check if room exists
        if (socket && roomId && name) {
            const nameTrimmed = name.trim();
            socket.emit('joinRoom', roomId, nameTrimmed);
            toast("Joining room...");
        } else {
            toast("Unable to join, please refresh");
            setIsJoining(false);
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('playerJoined', (data: RoomData) => {
                storeJoinRoom(data);
                console.log(`Joined room:`, data);
                router.push("/game");
            });
        }

        return () => {
            if (socket) { socket.off('playerJoined'); }
        };
    }, [socket, storeJoinRoom, router]);

    useEffect(() => {
        if (socket) {
            socket.on('joinFailed', () => {
                toast.error("Failed to join room");
                setIsJoining(false);
            });
        }

        return () => {
            if (socket) { socket.off('joinFailed'); }
        };
    }, [socket]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-8">Trivia Challenge</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Join a Game</CardTitle>
                        <CardDescription>Enter your details to join an existing game</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Your Name
                            </label>
                            <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="roomCode" className="text-sm font-medium">
                                Room Code
                            </label>
                            <Input id="roomCode" placeholder="Enter room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={joinRoom} disabled={isJoining}>
                            Join Game {isJoining ? <Spinner /> : null}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Create New Game</CardTitle>
                            <CardDescription>Start a new trivia challenge</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create your own trivia game with custom settings and invite friends to join.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href="/create-game" className="w-full">
                                <Button className="w-full">Create Game</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Scroll className="h-5 w-5" />
                            <CardTitle>Game Rules</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li>Each game consists of multiple-choice questions</li>
                                <li>Answer questions within the time limit to score points</li>
                                <li>Faster answers earn more points</li>
                                <li>The player with the highest score at the end wins</li>
                                <li>Use the chat to communicate with other players</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

