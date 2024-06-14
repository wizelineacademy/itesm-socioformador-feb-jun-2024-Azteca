import { describe, expect, it } from "vitest";
import { screen, render } from "@testing-library/react";
import Badge from "../components/Badge";

// Tests to know if The Badge component exist in user profile
describe("Traits Badge Component Test", () => {
  // Felipe de Jesús González Acosta A01275536 - Test #9/10
  // Test know if the component renders itself correctly
  it("Should be rendered on the profile screen", () => {
    render(<Badge text="" />);
    expect(screen.getByTestId("badge-component")).toBeInTheDocument();
  });
  // Felipe de Jesús González Acosta A01275536 - Test #10/10
  // Test know if the component renders the text correctly
  it("Should render the text prop in badge", () => {
    render(<Badge text="Trait 1" />);
    expect(screen.getByText("Trait 1")).toBeInTheDocument();
  });
});
