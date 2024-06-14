import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GrowthCircle from "@/components/GrowthCircle";

describe("GrowthCircle Component", () => {
  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #6/12
    Test #1: Verifica que el componente se renderiza correctamente con los valores mínimos.
  */
  it("renders correctly with minimum values", () => {
    render(
      <GrowthCircle
        percentage={0}
        gradient={{ start: "#000000", end: "#ffffff" }}
      />,
    );
    const svgElement = screen.getByTestId("growth-circle-svg");
    expect(svgElement).toBeInTheDocument();
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #7/12
    Test #2: Verifica que el componente se renderiza correctamente con los valores máximos.
  */
  it("renders correctly with maximum values", () => {
    render(
      <GrowthCircle
        percentage={100}
        gradient={{ start: "#000000", end: "#ffffff" }}
      />,
    );
    const svgElement = screen.getByTestId("growth-circle-svg");
    expect(svgElement).toBeInTheDocument();
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #8/12
    Test #3: Verifica que el tamaño del círculo y el radio se calculan correctamente.
  */
  it("calculates the circle size and radius correctly", () => {
    render(
      <GrowthCircle
        percentage={50}
        gradient={{ start: "#000000", end: "#ffffff" }}
      />,
    );
    const svgElement = screen.getByTestId("growth-circle-svg");
    const circleElement = screen.getByTestId("growth-circle");
    const expectedRadius = 50; // 50% of the maxSize (150)
    expect(svgElement).toHaveAttribute("width", String(expectedRadius * 2));
    expect(svgElement).toHaveAttribute("height", String(expectedRadius * 2));
    expect(circleElement).toHaveAttribute("r", String(expectedRadius));
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #9/10
    Test #4: Verifica que el texto se renderiza correctamente dentro del círculo.
  */
  it("renders text correctly inside the circle", () => {
    render(
      <GrowthCircle
        percentage={75}
        gradient={{ start: "#000000", end: "#ffffff" }}
      />,
    );
    const textElement = screen.getByText("75%");
    expect(textElement).toBeInTheDocument();
  });
});
