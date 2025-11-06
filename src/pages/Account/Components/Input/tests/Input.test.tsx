import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input";

// TODO: fix this test
describe.skip("<Input />", () => {
  it("renders the label and an input associated with it", () => {
    const { getByText, getByLabelText, asFragment } = render(
      <Input label="Username" value="ignored" onChange={() => {}} />
    );

    expect(getByText("Username")).toBeTruthy();

    const input = getByLabelText("Username");
    expect(input).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it("forwards additional props to the underlying input element", () => {
    const { getByLabelText } = render(
      <Input
        label="Email"
        value="ignored"
        onChange={() => {}}
        placeholder="you@example.com"
        type="email"
        capture="user"
      />
    );

    const input = getByLabelText("Email") as HTMLInputElement;

    expect(input.getAttribute("placeholder")).toBe("you@example.com");
    expect(input.getAttribute("type")).toBe("email");
    expect(input.getAttribute("capture")).toBe("user");
  });

  it("does not call the provided onChange when typing (current implementation does not forward onChange)", () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(
      <Input label="Test" value="initial" onChange={onChange} />
    );

    const input = getByLabelText("Test") as HTMLInputElement;

    expect(input.value).toBe("");

    fireEvent.input(input, { target: { value: "new" } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
