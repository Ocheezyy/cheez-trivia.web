import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "@/app/page";
import { useJoinRoom } from "@/hooks/useJoinRoom";

// Only mock what's truly necessary (like hooks)
jest.mock("@/hooks/useJoinRoom");
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("HomePage", () => {
  const mockJoinRoom = jest.fn();

  beforeEach(() => {
    (useJoinRoom as jest.Mock).mockReturnValue({
      mutate: mockJoinRoom,
      isPending: false,
    });
  });

  it("renders the join game form", () => {
    render(<HomePage />);

    // Test using actual component behavior
    expect(screen.getByRole("heading", { name: "Join a Game" })).toBeInTheDocument();
    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Room Code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join Game" })).toBeInTheDocument();
  });

  it("submits the form with correct values", () => {
    render(<HomePage />);

    fireEvent.change(screen.getByLabelText("Your Name"), {
      target: { value: "Test Player" },
    });
    fireEvent.change(screen.getByLabelText("Room Code"), {
      target: { value: "ROOM123" },
    });
    fireEvent.click(screen.getByText("Join Game"));

    expect(mockJoinRoom).toHaveBeenCalledWith({
      roomId: "ROOM123",
      playerName: "Test Player",
    });
  });
});
