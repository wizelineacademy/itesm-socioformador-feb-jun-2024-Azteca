import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "@/components/Loader";

describe("Loader Component", () => {
  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #10/12
    Test #1: Verifica que el componente se renderiza correctamente.
  */
  it("renders correctly", () => {
    render(<Loader />);
    const loaderSection = screen.getByTestId("loader-section");
    expect(loaderSection).toBeInTheDocument();
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #11/12
    Test #2: Verifica que el contenedor y las cajas se renderizan correctamente.
  */
  it("renders the loader container and boxes correctly", () => {
    render(<Loader />);
    const loaderContainer = screen.getByTestId("loader-container");
    const loaderBoxes = screen.getAllByTestId("loader-box");
    expect(loaderContainer).toBeInTheDocument();
    expect(loaderBoxes.length).toBe(5); // Verifica que haya 5 elementos con el data-testid "loader-box"
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #12/12
    Test #3: Verifica que el texto de carga se renderiza correctamente.
  */
  it("renders the loading text correctly", () => {
    render(<Loader />);
    const loadingText = screen.getByTestId("loader-text");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent("Cargando...");
  });
});
