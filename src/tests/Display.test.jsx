import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Display from "../routes/Display";

test("initial render", () => {
  const rendered = render(
    <Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />
  );
  expect(rendered).toMatchSnapshot();
});

it("updates the Away score", async () => {
  const user = userEvent.setup();

  render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

  const awayBtn = screen.getByRole("button", { name: "1" });
  const awayScore = screen.getByTestId("away-score");

  await user.click(awayBtn);

  expect(awayScore).toHaveTextContent("1");
});

it("updates the Home score only when home is toggled (updates Away score otherwise)", async () => {
  const user = userEvent.setup();
  render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

  const buttons = screen.getAllByRole("button");

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
  render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

  const startBtn = screen.getByRole("button", { name: "Start" });
  const timeDisplay = screen.getByTestId("time");

  await user.click(startBtn);

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("10:00");
  });

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("9:59");
  });
});

it("advances the period only up to the max periods", async () => {
  const user = userEvent.setup();
  render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

  const nextPeriodBtn = screen.getByRole("button", { name: "Next Period" });
  const periodP = screen.getByTestId("period");

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
    render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

    const startBtn = screen.getByRole("button", { name: "Start" });
    const timeDisplay = screen.getByTestId("time");

    await user.click(startBtn);

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("10:00");
    });

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
    render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

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
      expect(timeDisplay).toHaveTextContent("9:30");
    });

    await user.click(startBtn);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("9:20");
    });
  });

  it("resets the time display when period is advanced", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Display buttons={[1, 2, 3]} periods={2} timePerPeriod={10} />);

    const startBtn = screen.getByRole("button", { name: "Start" });
    const nextPeriodBtn = screen.getByRole("button", { name: "Next Period" });
    const timeDisplay = screen.getByTestId("time");

    await user.click(startBtn);

    act(() => {
      // 30 seconds
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("9:30");
    });

    await user.click(nextPeriodBtn);

    await waitFor(() => {
      expect(timeDisplay).toHaveTextContent("10:00");
    });
  });
});
