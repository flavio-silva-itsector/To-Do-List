import { render, screen } from "@testing-library/react";
import { Footer } from "..";

describe("<Footer />", () => {
  it("renders the GitHub link with correct attributes", () => {
    const { asFragment } = render(<Footer />);

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/201flaviosilva/To-Do-List"
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
