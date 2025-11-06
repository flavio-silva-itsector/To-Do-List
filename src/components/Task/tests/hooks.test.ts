import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTask } from "../hooks";

let changeMock = vi.fn();
let removeMock = vi.fn();

vi.mock("@/store", () => ({
  useTasksStore: (selector: any) =>
    // selector will pick the needed function from this fake state
    selector({ changeIndividualProp: changeMock, removeTask: removeMock }),
}));

let container: HTMLDivElement | null = null;
let root: Root | null = null;
let lastFuncs: { changeProp: Function; deleteTask: Function } | null = null;

function TestComponent() {
  const { changeProp, deleteTask } = useTask();
  lastFuncs = { changeProp, deleteTask };
  return null;
}

beforeEach(() => {
  changeMock = vi.fn();
  removeMock = vi.fn();
  lastFuncs = null;

  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  if (root) {
    act(() => root?.unmount());
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
  vi.clearAllMocks();
});

describe("useTask hook", () => {
  it("calls changeIndividualProp with expected payload when changeProp is invoked", () => {
    act(() => {
      if (!root) throw new Error("root not initialized");
      root.render(React.createElement(TestComponent));
    });

    expect(lastFuncs).toBeTruthy();

    act(() => {
      lastFuncs!.changeProp("task-1", "title" as any, "new title");
    });

    expect(changeMock).toHaveBeenCalledTimes(1);
    expect(changeMock).toHaveBeenCalledWith({
      id: "task-1",
      change: { prop: "title", value: "new title" },
    });
  });

  it("calls removeTask when deleteTask is invoked", () => {
    act(() => {
      if (!root) throw new Error("root not initialized");
      root.render(React.createElement(TestComponent));
    });

    act(() => {
      lastFuncs!.deleteTask("task-2");
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith("task-2");
  });
});
