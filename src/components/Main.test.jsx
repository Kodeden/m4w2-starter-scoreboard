import Main from "./Main";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  expect(period).toHaveTextContent("1");

  expect(timeHeading).toBeInTheDocument();
  expect(time).toBeInTheDocument();
});

it("renders the correct buttons whenever a sport is selected", async () => {
  const user = userEvent.setup();
  render(<Main />);

  const select = screen.getByRole("combobox");

  // Select the first actual choice (not the placeholder option)
  await user.selectOptions(select, choices[0]);

  const buttons = screen.getAllByRole("button");

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
