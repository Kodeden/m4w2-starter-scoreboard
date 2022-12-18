import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Main from "../components/Main";
import CONFIG from "../config";

const choices = CONFIG.map((sport) => sport.sport);

test("initial render", async () => {
  render(<Main />);

  const select = screen.getByRole("combobox");
  const options = screen.getAllByRole("option");

  const toggle = screen.getByRole("checkbox");
  const homeToggle = screen.getByTestId("home-toggle");
  const awayToggle = screen.getByTestId("away-toggle");

  const homeHeading = screen.getByRole("heading", { name: "Home" });
  const awayHeading = screen.getByRole("heading", { name: "Away" });
  const homeScore = screen.getByTestId("home-score");
  const awayScore = screen.getByTestId("away-score");

  const periodHeading = screen.getByRole("heading", { name: "Period" });
  const period = screen.getByTestId("period");

  const timeHeading = screen.getByRole("heading", { name: "Time" });
  const time = screen.getByTestId("time");

  expect(select).toBeInTheDocument();

  // First choice is the default placeholder
  expect(options).toHaveLength(choices.length + 1);

  expect(toggle).toBeInTheDocument();
  expect(homeToggle).toBeInTheDocument();
  expect(awayToggle).toBeInTheDocument();

  expect(homeHeading).toBeInTheDocument();
  expect(awayHeading).toBeInTheDocument();

  expect(homeScore).toHaveTextContent("0");
  expect(awayScore).toHaveTextContent("0");

  expect(periodHeading).toBeInTheDocument();
  expect(period).toHaveTextContent("0");

  expect(timeHeading).toBeInTheDocument();
  expect(time).toBeInTheDocument();
});

it("renders the correct buttons whenever a sport is selected", async () => {
  const user = userEvent.setup();
  render(<Main />);

  const select = screen.getByRole("combobox");

  // Select the first actual choice (not the placeholder option)
  await user.selectOptions(select, choices[0]);

  const buttons = screen.getAllByRole("button", { name: /[1-9]/ });

  expect(buttons).toHaveLength(CONFIG[0].buttons.length);
});

it("updates the Away score whenever a button is clicked", async () => {
  const user = userEvent.setup();
  render(<Main />);

  const select = screen.getByRole("combobox");

  // Select the first actual choice (not the placeholder option)
  await user.selectOptions(select, choices[0]);

  // Wait for the buttons to render
  const buttons = await screen.findAllByRole("button");

  await user.click(buttons[0]);

  const awayScore = screen.getByTestId("away-score");

  expect(awayScore).toHaveTextContent("1");
});

it("updates the Home score only when home is toggled (updates Away score otherwise)", async () => {
  const user = userEvent.setup();
  render(<Main />);

  const select = screen.getByRole("combobox");

  // Select the first actual choice (not the placeholder option)
  await user.selectOptions(select, choices[0]);

  // Wait for the buttons to render
  const buttons = await screen.findAllByRole("button");

  // Toggle starts with 'away' selected
  const toggle = screen.getByRole("checkbox");

  const homeScore = screen.getByTestId("home-score");
  const awayScore = screen.getByTestId("away-score");

  await user.click(buttons[0]);

  expect(homeScore).toHaveTextContent("0");
  expect(awayScore).toHaveTextContent("1");

  await user.click(toggle);

  await user.click(buttons[0]);

  expect(homeScore).toHaveTextContent("1");
  expect(awayScore).toHaveTextContent("1");

  await user.click(toggle);

  await user.click(buttons[0]);

  expect(homeScore).toHaveTextContent("1");
  expect(awayScore).toHaveTextContent("2");
});

it("should start the timer", async () => {
  const user = userEvent.setup();
  render(<Main />);

  const periods = screen.getByLabelText("Number of Periods");
  const minutes = screen.getByLabelText("Time per period? (minutes)");
  const startBtn = screen.getByRole("button", { name: "Start" });

  const timeDisplay = screen.getByTestId("time");

  await user.type(periods, "1");
  await user.type(minutes, "1");

  await user.click(startBtn);

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("1:00");
  });

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("0:59");
  });
});

describe("Timer 🤡", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  /**
   * When using fake timers, you need to remember to restore the timers after your test runs.
   *
   * The main reason to do that is to prevent 3rd party libraries running after your test finishes (e.g cleanup
   * functions), from being coupled to your fake timers and use real timers instead.
   *
   * For that you usually call useRealTimers...
   * https://testing-library.com/docs/using-fake-timers/
   */
  afterAll(() => {
    vi.useRealTimers();
  });

  test("timer reflects MM:SS accurately", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Main />);

    const minutes = screen.getByLabelText("Time per period? (minutes)");
    const startBtn = screen.getByRole("button", { name: "Start" });

    const timeDisplay = screen.getByTestId("time");

    await user.type(minutes, "10");

    await user.click(startBtn);

    act(() => {
      // 30 seconds
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("9:30");
    });

    act(() => {
      // 6 more seconds
      vi.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("9:24");
    });

    act(() => {
      // 1 second left! ⏳
      vi.advanceTimersByTime(563000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("0:01");
    });
  });

  it("stops and restarts timer", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Main />);

    const periods = screen.getByLabelText("Number of Periods");
    const minutes = screen.getByLabelText("Time per period? (minutes)");
    const startBtn = screen.getByRole("button", { name: "Start" });
    const stopBtn = screen.getByRole("button", { name: "Stop" });

    const timeDisplay = screen.getByTestId("time");

    await user.type(periods, "1");
    await user.type(minutes, "1");

    await user.click(startBtn);

    act(() => {
      // 30 seconds
      vi.advanceTimersByTime(30000);
    });

    await user.click(stopBtn);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      // Even though 40 seconds have elapsed...
      expect(timeDisplay).toHaveTextContent("0:30");
    });

    await user.click(startBtn);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("0:20");
    });
  });
});
