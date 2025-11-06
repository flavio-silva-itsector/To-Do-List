import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Task } from "../Task";

const changePropMock = vi.fn();
const deleteTaskMock = vi.fn();

// Mock the hooks module to return the spies so we can assert calls
vi.mock("../hooks", () => ({
  useTask: () => ({
    changeProp: (...args: Parameters<typeof changePropMock>) =>
      changePropMock(...args),
    deleteTask: (...args: Parameters<typeof deleteTaskMock>) =>
      deleteTaskMock(...args),
  }),
}));

// Mock the presentational icon components to expose their props in the DOM
vi.mock("../components", () => {
  return {
    CompletedIcon: ({ isCompleted }: { isCompleted: boolean }) => (
      <span data-testid="completed-icon">{String(isCompleted)}</span>
    ),
    DeleteIcon: ({ isHouver }: { isHouver: boolean }) => (
      <span data-testid="delete-icon">{String(isHouver)}</span>
    ),
    FavoriteIcon: ({ isFavorite }: { isFavorite: boolean }) => (
      <span data-testid="favorite-icon">{String(isFavorite)}</span>
    ),
  };
});

// Mock the styled components with simple DOM elements that forward props & handlers
vi.mock("../styled", () => {
  const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
  > = ({ children, ...rest }) => (
    <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
  const Div: React.FC<any> = ({ children, ...rest }) => (
    <div {...rest}>{children}</div>
  );
  const TaskTitle: React.FC<
    React.HTMLAttributes<HTMLDivElement> & {
      title?: string;
      isCompleted?: boolean;
    }
  > = ({ children, ...rest }) => <div {...rest}>{children}</div>;
  const Wrapper: React.FC<any> = ({ children, ...rest }) => (
    <div {...rest}>{children}</div>
  );

  return { Button, Div, TaskTitle, Wrapper };
});

describe("<Task />", () => {
  beforeEach(() => {
    changePropMock.mockClear();
    deleteTaskMock.mockClear();
    // reset window.prompt mock between tests
    // @ts-expect-error assigning for tests
    delete window.prompt;
  });

  it("renders title and icons with given props", () => {
    const { asFragment, getByText, getByTestId } = render(
      <Task id="1" title="Test task" isFavorite={true} isCompleted={false} />
    );
    expect(getByText("Test task")).toBeTruthy();
    expect(getByTestId("favorite-icon").textContent).toBe("true");
    expect(getByTestId("completed-icon").textContent).toBe("false");
    expect(asFragment()).toMatchSnapshot();
  });

  it("toggles favorite when favorite button is clicked", () => {
    const { getByTestId } = render(
      <Task id="fav-id" title="Fav" isFavorite={false} isCompleted={false} />
    );
    // favorite button is the first button; find by surrounding text (icon) or by role
    const favButton = getByTestId("favorite-icon").closest("button")!;
    expect(favButton).toBeTruthy();
    fireEvent.click(favButton);
    expect(changePropMock).toHaveBeenCalledWith("fav-id", "isFavorite", true);
  });

  it("toggles completed when completed button is clicked", () => {
    const { getByTestId } = render(
      <Task id="comp-id" title="Comp" isFavorite={false} isCompleted={false} />
    );
    // completed button surrounds the completed icon; query by that icon then its parent
    const completedIcon = getByTestId("completed-icon");
    const completedButton = completedIcon.parentElement as HTMLElement;
    fireEvent.click(completedButton);
    expect(changePropMock).toHaveBeenCalledWith("comp-id", "isCompleted", true);
  });

  it("calls deleteTask when delete button clicked", () => {
    const { getByTitle } = render(
      <Task id="del-id" title="Del" isFavorite={false} isCompleted={false} />
    );
    const deleteButton = getByTitle("Delete task") as HTMLElement;
    fireEvent.click(deleteButton);
    expect(deleteTaskMock).toHaveBeenCalledWith("del-id");
  });

  it("sets hover state on delete button mouse enter/leave and reflects in DeleteIcon", () => {
    const { getByTitle, getByTestId } = render(
      <Task id="h-id" title="H" isFavorite={false} isCompleted={false} />
    );
    const deleteButton = getByTitle("Delete task") as HTMLElement;
    const deleteIcon = getByTestId("delete-icon");
    // initial state false
    expect(deleteIcon.textContent).toBe("false");
    fireEvent.mouseEnter(deleteButton);
    // after hover true
    expect(deleteIcon.textContent).toBe("true");
    fireEvent.mouseLeave(deleteButton);
    expect(deleteIcon.textContent).toBe("false");
  });

  it("prompts for new title on double click and calls changeProp when changed", () => {
    // mock prompt to return a different title
    window.prompt = () => "New Title";
    const { getByText } = render(
      <Task
        id="t-id"
        title="Old Title"
        isFavorite={false}
        isCompleted={false}
      />
    );
    const titleNode = getByText("Old Title");
    fireEvent.doubleClick(titleNode);
    expect(changePropMock).toHaveBeenCalledWith("t-id", "title", "New Title");
  });

  it("does not call changeProp when prompt returns same title", () => {
    // prompt returns same title
    // @ts-expect-error assign for test
    window.prompt = (_: string, def: string) => def;
    const { getByText } = render(
      <Task id="t-id-2" title="Same" isFavorite={false} isCompleted={false} />
    );
    const titleNode = getByText("Same");
    fireEvent.doubleClick(titleNode);
    expect(changePropMock).not.toHaveBeenCalled();
  });

  it("uses fallback when prompt returns empty or null and does not call changeProp if unchanged", () => {
    // prompt returns null
    window.prompt = () => null;
    const { getByText } = render(
      <Task id="t-id-3" title="Keep" isFavorite={false} isCompleted={false} />
    );
    const titleNode = getByText("Keep");
    fireEvent.doubleClick(titleNode);
    expect(changePropMock).not.toHaveBeenCalled();

    changePropMock.mockClear();
    // prompt returns empty string -> fallback to title
    window.prompt = () => "";
    fireEvent.doubleClick(titleNode);
    expect(changePropMock).not.toHaveBeenCalled();
  });
});
