import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Slider from "@/components/Slider";

describe("Slider Component", () => {
  // José Eduardo de Valle Lara A01734957 - Test #9/10
  it("renders correctly with provided props", () => {
    render(<Slider label="Test Label" name="testSlider" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("slider-testSlider")).toBeInTheDocument();
    expect(screen.getByTestId("input-slider")).toBeInTheDocument();
  });

  // José Eduardo de Valle Lara A01734957 - Test #10/10
  it("changes value when interacted with", () => {
    render(<Slider label="Test Label" name="testSlider" />);

    const slider = screen.getByTestId("input-slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: 5 } });

    expect(slider.value).toBe("5");
  });

  // José Eduardo de Valle Lara A01734957 - Test #11/10
  it("calls onChange with correct parameters", () => {
    const handleChange = vi.fn();
    render(
      <Slider label="Test Label" name="testSlider" onChange={handleChange} />,
    );

    const slider = screen.getByTestId("input-slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: 7 } });

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object), "testSlider");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
