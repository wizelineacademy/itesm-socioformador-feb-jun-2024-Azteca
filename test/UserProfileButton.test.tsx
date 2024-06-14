import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserProfileButton from "@/components/UserProfileButton";

describe("UserProfileButton Component", () => {
  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #1/12
    Test #1: Verifica que el componente se renderiza correctamente sin una foto de perfil.
  */
  it("renders correctly without a profile photo", () => {
    render(<UserProfileButton />);
    expect(screen.getByTestId("user-profile-icon")).toBeInTheDocument();
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #2/12
    Test #2: Verifica que el componente se renderiza correctamente con una foto de perfil.
  */
  it("renders correctly with a profile photo", () => {
    const photoUrl = "https://example.com/photo.jpg";
    render(<UserProfileButton photoUrl={photoUrl} />);
    const imgElement = screen.getByAltText("User");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", photoUrl);
  });

  /*
    Adrian Alejandro Ramirez Cruz A00830640 - Test #3/12
    Test #3: Verifica que el componente se renderiza con el tamaño especificado.
  */
  it("renders with the specified size", () => {
    render(<UserProfileButton size="lg" />);
    const svgElement = screen.getByTestId("user-profile-icon");
    expect(svgElement).toHaveClass("h-32 w-32");
  });

  /*
  Adrian Alejandro Ramirez Cruz A00830640 - Test #4/12
        Test #4: Verifica que el componente se renderiza con el color por defecto.
    */
  it("renders with default color", () => {
    render(<UserProfileButton />);
    const svgElement = screen.getByTestId("user-profile-icon");
    expect(svgElement).toHaveClass("text-primary");
  });

  /*
  Adrian Alejandro Ramirez Cruz A00830640 - Test #5/12
    Test #5: Verifica que el componente se renderiza con el color personalizado.
  */
  it("renders with custom color", () => {
    render(<UserProfileButton color="text-secondary" />);
    const svgElement = screen.getByTestId("user-profile-icon");
    expect(svgElement).toHaveClass("text-secondary");
  });
});
