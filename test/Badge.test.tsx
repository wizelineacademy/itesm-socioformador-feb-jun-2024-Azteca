import { describe, expect, it } from "vitest";
import { screen, render } from "@testing-library/react";
import Badge from "../components/Badge";

describe("Badge Component Test", () => {
  it("Should be rendered on the screen", () => {
    render(<Badge text="" />);
    expect(screen.getByTestId("badge-component")).toBeInTheDocument();
  });
  it("Should render the text prop", () => {
    render(<Badge text="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
