import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameOver from "@/components/game-over";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { RoomData } from "@/lib/types";

// Mock dependencies
jest.mock("next/navigation");
jest.mock("canvas-confetti");
jest.mock("@/components/spinner");

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("GameOver", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockRoomData: RoomData = {
    players: [
      {
        id: "1",
        name: "Alice",
        score: 100,
        correctAnswers: 8,
        totalAnswers: 10,
        fastestAnswer: 1.2,
        hasAnswered: true,
      },
      {
        id: "2",
        name: "Bob",
        score: 85,
        correctAnswers: 7,
        totalAnswers: 10,
        fastestAnswer: 1.5,
        hasAnswered: true,
      },
      {
        id: "3",
        name: "Charlie",
        score: 70,
        correctAnswers: 6,
        totalAnswers: 10,
        fastestAnswer: 2.0,
        hasAnswered: true,
      },
    ],
    questions: Array(10).fill({}),
    gameId: "game-id",
    gameStarted: true,
    messages: [],
    category: 9,
    host: "Charlie",
    currentQuestion: 10,
    difficulty: "mixed",
    timeLimit: "30",
  };

  const mockRoomDataNoPlayers = { ...mockRoomData, players: [] };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorageMock.getItem.mockReturnValue("Alice");
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // it("renders loading state when isLoading is true", () => {
  //   render(<GameOver isLoading={true} />);
  //   expect(screen.getByText("Game Over!")).toBeInTheDocument();
  //   expect(screen.getByTestId("spinner")).toBeInTheDocument();
  // });

  // it("renders the podium with top 3 players", async () => {
  //   render(<GameOver roomData={mockRoomData} isLoading={false} />);
  //
  //   // Fast-forward timers to show animated content
  //   jest.advanceTimersByTime(2000);
  //
  //   await waitFor(() => {
  //     expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();
  //     expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument();
  //     expect(screen.getByText("3", { selector: "span" })).toBeInTheDocument();
  //
  //     // Check top players are displayed
  //     expect(screen.getAllByText("Alice")).toBeInTheDocument();
  //     expect(screen.getByText("Bob")).toBeInTheDocument();
  //     expect(screen.getByText("Charlie")).toBeInTheDocument();
  //   });
  // });

  it("displays the current user rank and stats", async () => {
    render(<GameOver roomData={mockRoomData} isLoading={false} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText("Your Performance")).toBeInTheDocument();

      const rankElements = screen.getAllByText("#1");
      expect(rankElements.length).toBe(2);
      rankElements.forEach((rankElement) => expect(rankElement).toBeInTheDocument());
      expect(screen.getByText("8/10")).toBeInTheDocument();

      const scoreElements = screen.getAllByText("100");
      scoreElements.forEach((scoreElement) => expect(scoreElement).toBeInTheDocument());
      expect(screen.getByText("You")).toBeInTheDocument();
    });
  });

  it("shows the full leaderboard", async () => {
    render(<GameOver roomData={mockRoomData} isLoading={false} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Leaderboard" })).toBeInTheDocument();
      mockRoomData.players.forEach((player) => {
        // Check for names
        const elementsWithName = screen.getAllByText(player.name);
        // expect(elementsWithName).toHaveLength(2);
        elementsWithName.forEach((el) => {
          expect(el).toBeInTheDocument();
        });

        // Check for scores
        const elementsWithScore = screen.getAllByText(player.score.toString());
        // expect(elementsWithScore).toHaveLength(3);
        elementsWithScore.forEach((el) => {
          expect(el).toBeInTheDocument();
        });
      });
    });
  });

  it("displays special awards", async () => {
    render(<GameOver roomData={mockRoomData} isLoading={false} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Special Awards" })).toBeInTheDocument();
      expect(screen.getByText("Most Accurate Player")).toBeInTheDocument();
      expect(screen.getByText("Fastest Player")).toBeInTheDocument();
      expect(screen.getByText("80%")).toBeInTheDocument(); // Alice's accuracy
      expect(screen.getByText("1.2s")).toBeInTheDocument(); // Alice's fastest answer
    });
  });

  // it("triggers confetti animation on mount", () => {
  //   render(<GameOver roomData={mockRoomData} isLoading={false} />);
  //   expect(confetti).toHaveBeenCalled();
  // });

  it("navigates correctly when buttons are clicked", async () => {
    render(<GameOver roomData={mockRoomData} isLoading={false} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Play Again"));
      expect(mockRouter.push).toHaveBeenCalledWith("/create-game");

      fireEvent.click(screen.getByText("Back to Home"));
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("handles empty player state gracefully", async () => {
    render(<GameOver roomData={mockRoomDataNoPlayers} isLoading={false} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getAllByText("No Player").length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("Your Performance")).not.toBeInTheDocument();
    });
  });
});
