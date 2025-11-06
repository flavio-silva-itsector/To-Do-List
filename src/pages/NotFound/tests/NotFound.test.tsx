import { render, screen } from "@testing-library/react";
import { NotFound } from "..";

describe("<NotFound />", () => {
  it("renders children correctly and matches snapshot", () => {
    const { asFragment } = render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
