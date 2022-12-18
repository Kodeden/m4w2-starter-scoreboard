import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../App";
import CONFIG from "../config";

const choices = CONFIG.map((sport) => sport.sport);

test("initial render", async () => {
  const rendered = render(<App />);
  expect(rendered).toMatchSnapshot();
});

it("renders the correct buttons whenever a sport is selected", async () => {
  const user = userEvent.setup();
  render(<App />);

  const select = screen.getByRole("combobox");
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.selectOptions(select, choices[0]);
  await user.click(goBtn);

  const buttons = await screen.findAllByRole("button", { name: /[1-9]/ });

  expect(buttons).toHaveLength(CONFIG[0].buttons.length);
});

it("updates the Away score whenever a button is clicked", async () => {
  const user = userEvent.setup();
  render(<App />);

  const select = screen.getByRole("combobox");
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.selectOptions(select, choices[0]);
  await user.click(goBtn);

  // Wait for the buttons to render
  const buttons = await screen.findAllByRole("button");

  await user.click(buttons[0]);

  const awayScore = screen.getByTestId("away-score");

  expect(awayScore).toHaveTextContent("1");
});

it("updates the Home score only when home is toggled (updates Away score otherwise)", async () => {
  const user = userEvent.setup();
  render(<App />);

  const select = screen.getByRole("combobox");
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.selectOptions(select, choices[0]);
  await user.click(goBtn);

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
  render(<App />);

  const periodsInput = screen.getByLabelText("Number of Periods");
  const minutesInput = screen.getByLabelText("Time per period? (minutes)");

  await user.type(periodsInput, "1");
  await user.type(minutesInput, "1");

  const goBtn = screen.getByRole("button", { name: "Go!" });
  await user.click(goBtn);

  const startBtn = await screen.findByRole("button", { name: "Start" });
  const timeDisplay = await screen.findByTestId("time");

  await user.click(startBtn);

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("1:00");
  });

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("0:59");
  });
});

it("advances the period only up to the max periods", async () => {
  const user = userEvent.setup();
  render(<App />);

  // ⚠️ Be sure to allow for periods
  const periodsInput = screen.getByLabelText("Number of Periods");
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.type(periodsInput, "2");
  await user.click(goBtn);

  const nextPeriodBtn = await screen.findByRole("button", {
    name: "Next Period",
  });

  // It starts with "1" - 🎵 🎸
  const periodP = await screen.findByTestId("period");

  await user.click(nextPeriodBtn);
  expect(periodP).toHaveTextContent("2");

  // Limited to 2 periods ☝️
  await user.click(nextPeriodBtn);
  expect(periodP).toHaveTextContent("2");
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
    render(<App />);

    const minutes = screen.getByLabelText("Time per period? (minutes)");
    await user.type(minutes, "10");

    const goBtn = screen.getByRole("button", { name: "Go!" });
    await user.click(goBtn);

    const startBtn = screen.getByRole("button", { name: "Start" });
    const timeDisplay = screen.getByTestId("time");

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
    render(<App />);

    const periods = screen.getByLabelText("Number of Periods");
    const minutes = screen.getByLabelText("Time per period? (minutes)");

    await user.type(periods, "1");
    await user.type(minutes, "1");

    const goBtn = screen.getByRole("button", { name: "Go!" });
    await user.click(goBtn);

    const startBtn = screen.getByRole("button", { name: "Start" });
    const stopBtn = screen.getByRole("button", { name: "Stop" });

    const timeDisplay = screen.getByTestId("time");

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

  it("resets the time display when period is advanced", async () => {
    const user = userEvent.setup({ delay: null });
    render(<App />);

    // ⚠️ Be sure to allow for periods
    const periodsInput = screen.getByLabelText("Number of Periods");
    const minutesInput = screen.getByLabelText("Time per period? (minutes)");

    //  Allow for 2 periods of 1 minute each
    await user.type(periodsInput, "2");
    await user.type(minutesInput, "1");

    const goBtn = screen.getByRole("button", { name: "Go!" });
    await user.click(goBtn);

    const startBtn = await screen.findByRole("button", { name: "Start" });
    const nextPeriodBtn = await screen.findByRole("button", {
      name: "Next Period",
    });

    const timeDisplay = await screen.findByTestId("time");

    await user.click(startBtn);

    //  Run 🏃🏾‍♂️ out the first timer (timer should be at 0:00 as per previous test)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    await user.click(nextPeriodBtn);

    expect(timeDisplay).toHaveTextContent("1:00");
  });
});
