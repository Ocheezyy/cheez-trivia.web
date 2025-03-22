import { CheckCircle2, Clock, Play, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { RoomData } from "@/lib/types";
import { categories } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { decode as heDecode } from "he";
import { capitalizeFirstLetter } from "@/lib/utils";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type GameCardProps = {
  roomData: RoomData;
  currentPlayerName: string;
  questionAnswered: boolean;
  isHost: boolean;
  timeLeft: number;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  question?: Question;
  handleStartGame: () => void;
  handleSubmitAnswer: () => void;
  pointsEarned: number;
  allAnswered: boolean;
  nextQuestionCountdown: number;
};

export const GameCard = ({
  roomData,
  currentPlayerName,
  isHost,
  questionAnswered,
  timeLeft,
  selectedOption,
  setSelectedOption,
  handleStartGame,
  pointsEarned,
  allAnswered,
  nextQuestionCountdown,
  handleSubmitAnswer,
}: GameCardProps) => {
  const currentQuestion = roomData.questions[roomData.currentQuestion - 1];

  const sortedPlayersByRound = roomData.players.sort((a, b) => b.score - a.score);

  if (!roomData.gameStarted) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Waiting for Players</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="py-8">
            <h3 className="text-xl font-medium mb-2">Room Code:</h3>
            <div className="text-3xl font-bold tracking-widest bg-muted inline-block px-6 py-3 rounded-md">
              {roomData.gameId}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share this code with your friends to join the game
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Game Settings:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">{roomData.questions.length} Questions</Badge>
              <Badge variant="outline">
                {categories.find((category) => category.id === Number(roomData.category))?.name}
              </Badge>
              <Badge variant="outline">{capitalizeFirstLetter(roomData.difficulty)} Difficulty</Badge>
              <Badge variant="outline">{roomData.timeLimit}s per Question</Badge>
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
    );
  }

  if (allAnswered) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            Question {roomData.currentQuestion} of {roomData.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold">Round Results</h3>
            <p className="text-muted-foreground">Everyone has answered. Here&#39;s how everyone did:</p>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="mb-4">{heDecode(currentQuestion.question)}</p>

            <p className="font-medium mb-2">Correct Answer:</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {heDecode(currentQuestion.correct_answer)}
            </p>
          </div>

          <div className="space-y-3">
            {sortedPlayersByRound.map((player) => {
              const isCurrentUser = player.name === currentPlayerName;
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isCurrentUser ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      {/*<div className="flex items-center gap-2 text-sm text-muted-foreground">*/}
                      {/*    <span>Answered in {player.answerTime.toFixed(1)}s</span>*/}
                      {/*    <span>•</span>*/}
                      {/*    <span>Total: {player.score + player.pointsEarned}</span>*/}
                      {/*</div>*/}
                    </div>
                  </div>

                  {/*<div className="flex items-center gap-4">*/}
                  {/*    {isCorrect ? (*/}
                  {/*        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">*/}
                  {/*            <CheckCircle2 className="h-5 w-5" />*/}
                  {/*            <span className="font-bold">+{player.pointsEarned}</span>*/}
                  {/*        </div>*/}
                  {/*    ) : (*/}
                  {/*        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">*/}
                  {/*            <XCircle className="h-5 w-5" />*/}
                  {/*            <span className="font-bold">+0</span>*/}
                  {/*        </div>*/}
                  {/*    )}*/}
                  {/*</div>*/}
                </div>
              );
            })}
          </div>

          {/*{isHost && (*/}
          {/*    <Button*/}
          {/*        className="w-full flex items-center justify-center gap-2 mt-4"*/}
          {/*        onClick={handleNextQuestion}*/}
          {/*    >*/}
          {/*        {currentQuestion < totalQuestions ? "Next Question" : "See Final Results"}*/}
          {/*        <ArrowRight className="h-4 w-4" />*/}
          {/*    </Button>*/}
          {/*)}*/}

          {/*{!isHost && (*/}
          {/*    <div className="text-center p-4 text-muted-foreground">*/}
          {/*        Waiting for host to continue to the next question...*/}
          {/*    </div>*/}
          {/*)}*/}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next question in:</span>
              <span className="font-bold">{nextQuestionCountdown}s</span>
            </div>
            <Progress value={(nextQuestionCountdown / 10) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questionAnswered) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Waiting for Players</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-4">
            {selectedOption === currentQuestion.correct_answer ? (
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
            <p className="mb-4">{heDecode(currentQuestion.question)}</p>

            <p className="font-medium mb-2">Correct Answer:</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {heDecode(currentQuestion?.correct_answer)}
            </p>

            {selectedOption !== currentQuestion?.correct_answer && (
              <>
                <p className="font-medium mt-4 mb-2">Your Answer:</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {heDecode(selectedOption || "")}
                </p>
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
        </CardContent>
      </Card>
    );
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
          <CardTitle className="text-xl">
            Question {roomData.currentQuestion} of {roomData.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold mb-6">{heDecode(currentQuestion.question)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.all_answers.map((answer, index) => (
              <Button
                key={`answer-${index}`}
                variant={selectedOption === answer ? "default" : "outline"}
                className={`h-auto py-6 text-lg justify-start ${
                  selectedOption === answer ? "border-primary" : ""
                }`}
                onClick={() => setSelectedOption(answer)}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {heDecode(answer)}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!selectedOption} onClick={handleSubmitAnswer}>
            Submit Answer
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
