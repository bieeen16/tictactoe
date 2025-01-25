import { render, fireEvent, screen, waitFor, act } from "../../test-utils";
import Game from "../Game";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock the axios module
jest.mock("axios", () => ({
  post: jest.fn(() =>
    Promise.resolve({ status: 200, data: { message: "Success" } })
  ),
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));
// Mock the socket service
jest.mock("../../services/socketService");

// Mock all timer functions
jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

const renderGame = () => {
  return render(<Game />);
};

const setupGame = async () => {
  renderGame();

  // Submit player names
  const player1Input = screen.getByLabelText(/Player 1 Name/i);
  const player2Input = screen.getByLabelText(/Player 2 Name/i);
  fireEvent.change(player1Input, { target: { value: "Player 1" } });
  fireEvent.change(player2Input, { target: { value: "Player 2" } });
  fireEvent.click(screen.getByRole("button", { name: /Start Game/i }));

  // Wait for and click Roll Dice button
  const rollDiceButton = await screen.findByRole("button", {
    name: /Roll Dice/i,
  });
  fireEvent.click(rollDiceButton);

  // Wait for showGame state to update
  act(() => {
    jest.advanceTimersByTime(2000); // Advance past the dice roll animation
  });

  // Wait for game board to be rendered
  await waitFor(
    () => {
      const cells = screen.getAllByTestId(/cell-\d/);
      expect(cells).toHaveLength(9);
    },
    { timeout: 3000 }
  );

  return screen.getAllByTestId(/cell-\d/);
};

describe("Game Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  beforeAll(() => {
    window.alert = jest.fn();
  });

  afterAll(() => {
    delete window.alert;
  });

  test("renders initial game state", () => {
    renderGame();
    expect(screen.getByText(/Enter Player Names/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Player 1 Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Player 2 Name/i)).toBeInTheDocument();
  });

  test("handles player name submission", async () => {
    renderGame();
    const player1Input = screen.getByLabelText(/Player 1 Name/i);
    const player2Input = screen.getByLabelText(/Player 2 Name/i);
    const submitButton = screen.getByRole("button", { name: /Start Game/i });

    fireEvent.change(player1Input, { target: { value: "Player 1" } });
    fireEvent.change(player2Input, { target: { value: "Player 2" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Roll Dice/i)).toBeInTheDocument();
    });
  });

  test("handles game flow", async () => {
    const gameCells = await setupGame();
    fireEvent.click(gameCells[0]);
    expect(gameCells[0]).toHaveTextContent(/[XO]/);
  });

  test("handles winning condition", async () => {
    const gameCells = await setupGame();

    // Play winning sequence
    fireEvent.click(gameCells[0]); // X
    fireEvent.click(gameCells[3]); // O
    fireEvent.click(gameCells[1]); // X
    fireEvent.click(gameCells[4]); // O
    fireEvent.click(gameCells[2]); // X

    await waitFor(() => {
      expect(screen.getByText(/wins!/i)).toBeInTheDocument();
    });
  });

  test("handles draw condition", async () => {
    const gameCells = await setupGame();

    // Make moves that lead to a draw
    fireEvent.click(gameCells[0]); // X
    fireEvent.click(gameCells[1]); // O
    fireEvent.click(gameCells[2]); // X
    fireEvent.click(gameCells[4]); // O
    fireEvent.click(gameCells[7]); // X
    fireEvent.click(gameCells[6]); // O
    fireEvent.click(gameCells[3]); // X
    fireEvent.click(gameCells[5]); // O
    fireEvent.click(gameCells[8]); // X

    await waitFor(() => {
      expect(screen.getByText(/It's a draw!/i)).toBeInTheDocument();
    });
  });

  test("handles game reset", async () => {
    const gameCells = await setupGame();

    // Make winning moves
    fireEvent.click(gameCells[0]);
    fireEvent.click(gameCells[3]);
    fireEvent.click(gameCells[1]);
    fireEvent.click(gameCells[4]);
    fireEvent.click(gameCells[2]);

    // Click Play Again
    await waitFor(() => {
      const playAgainButton = screen.getByRole("button", {
        name: /Play Again/i,
      });
      fireEvent.click(playAgainButton);
    });

    // Check if board is reset
    const resetCells = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          !button.textContent.match(
            /Roll Dice|Start Game|Back|Play Again|Save and Go to Dashboard/i
          )
      );

    resetCells.forEach((cell) => {
      expect(cell).toHaveTextContent("");
    });
  });

  test("saves match history", async () => {
    const gameCells = await setupGame();

    // Play winning sequence
    fireEvent.click(gameCells[0]);
    fireEvent.click(gameCells[3]);
    fireEvent.click(gameCells[1]);
    fireEvent.click(gameCells[4]);
    fireEvent.click(gameCells[2]);

    // Get the save button and click it
    await waitFor(() => {
      const saveButton = screen.getByRole("button", {
        name: /Save and Go to Dashboard/i,
      });
      fireEvent.click(saveButton);
    });

    // Verify API call
    await waitFor(() => {
      expect(require("axios").post).toHaveBeenCalledWith(
        expect.stringContaining("/match-history/"),
        expect.any(Object)
      );
    });
  });
});
