import { render, screen } from "@testing-library/react";
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
