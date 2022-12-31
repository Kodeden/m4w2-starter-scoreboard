import { prettyDOM, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

it("limits the periods correctly", async () => {
  const user = userEvent.setup();
  render(<App />);

  const periodsInput = screen.getByLabelText(/Periods/i);
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.type(periodsInput, "2");
  await user.click(goBtn);

  const nextPeriodBtn = await screen.findByRole("button", {
    name: "Next Period",
  });
  const periodP = await screen.findByTestId("period");

  // Click the next period button twice. It should still show '2'.
  await user.click(nextPeriodBtn);
  await user.click(nextPeriodBtn);

  expect(periodP).toHaveTextContent("2");
});

it("starts with the correct MM:SS", async () => {
  const user = userEvent.setup();
  render(<App />);

  const minutesInput = screen.getByLabelText(/Minutes/i);
  const goBtn = screen.getByRole("button", { name: "Go!" });

  await user.type(minutesInput, "2");
  await user.click(goBtn);

  const startBtn = await screen.findByRole("button", { name: "Start" });
  const timeDisplay = await screen.findByTestId("time");

  await user.click(startBtn);

  await waitFor(() => {
    expect(timeDisplay).toHaveTextContent("2:00");
  });
});
