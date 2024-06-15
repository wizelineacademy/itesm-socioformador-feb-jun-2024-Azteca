import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoDataCard from "@/components/NoDataCard";

describe("NoDataCard Component", () => {
  // José Eduardo de Valle Lara A01734957 - Test #6/10
  it("renders correctly with provided text", () => {
    const testText = "No data available";
    render(<NoDataCard text={testText} />);

    const textElement = screen.getByText(testText);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass(
      "text-center text-sm font-medium text-grayText",
    );
  });

  // José Eduardo de Valle Lara A01734957 - Test #7/10
  it("renders image on medium and larger screens", () => {
    render(<NoDataCard text="No data available" />);

    const imageElement = screen.getByAltText("No Data Image");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveClass("hidden md:block");
  });

  // José Eduardo de Valle Lara A01734957 - Test #8/10
  it("contains the provided text", () => {
    const testText = "No data available";
    render(<NoDataCard text={testText} />);

    const textElement = screen.getByText(testText);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent(testText);
  });
});
