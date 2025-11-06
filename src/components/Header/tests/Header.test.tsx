import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PAGES } from "../../../types/enums";
import { Header } from "../Header";

const mockUseLocation = vi.fn();

vi.mock("react-router-dom", () => {
  return {
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("../components", () => {
  return {
    Search: () => <div data-testid="search" />,
    UserHomePageIcon: () => <div data-testid="user-home-icon" />,
  };
});

vi.mock("../styled", () => {
  return {
    StyledHeader: ({ children }: any) => <header>{children}</header>,
  };
});

vi.mock("react-icons/go", () => {
  return {
    GoHome: (props: any) => <svg data-testid="go-home-icon" {...props} />,
  };
});

beforeEach(() => {
  mockUseLocation.mockReset();
});

describe("<Header />", () => {
  it("always renders the title", () => {
    mockUseLocation.mockReturnValue({ pathname: PAGES.HOME });
    const { asFragment } = render(<Header />);
    expect(screen.getByText("To Do List")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders Search and UserHomePageIcon on HOME page", () => {
    mockUseLocation.mockReturnValue({ pathname: PAGES.HOME });
    render(<Header />);
    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("user-home-icon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a home Link with GoHome icon on ACCOUNT page", () => {
    mockUseLocation.mockReturnValue({ pathname: PAGES.ACCOUNT });
    render(<Header />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", PAGES.HOME);
    expect(screen.getByTestId("go-home-icon")).toBeInTheDocument();

    // Components that are only present on HOME should not be rendered
    expect(screen.queryByTestId("search")).not.toBeInTheDocument();
    expect(screen.queryByTestId("user-home-icon")).not.toBeInTheDocument();
  });
});
