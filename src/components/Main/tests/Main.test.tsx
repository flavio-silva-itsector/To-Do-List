import { render, screen } from "@testing-library/react";
import { Main } from "..";

describe("<Main />", () => {
  it("renders children correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Main>
        <p>Beep</p>
      </Main>
    );

    expect(screen.getByText("Beep")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
