import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DialogComponent from "@/components/DialogComponent";

// Mock ResizeObserver
// Alejandro Mendoza Prado A00819383 - Mock #6/10
// Se crea una clase mock para ResizeObserver que define los métodos observe, unobserve y disconnect.
// Esto es necesario porque ResizeObserver no está definido en el entorno de prueba por defecto.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Se asigna la clase mock a la propiedad global ResizeObserver para que esté disponible en todo el entorno de prueba.
global.ResizeObserver = ResizeObserver;

describe("DialogComponent", () => {
  const mockOnClose = vi.fn(); // Alejandro Mendoza Prado A00819383 - Mock #7/10 - Se crea una función mock para manejar el cierre del diálogo.

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: "Test Title",
    description: "Test Description",
    children: <div>Test Content</div>,
  };

  // Alejandro Mendoza Prado A00819383 - Setup #8/10
  // Se limpia el estado de la función mock antes de cada prueba.
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #9/10

    Esta prueba verifica que el componente se renderiza correctamente cuando está abierto.
    Se espera que el diálogo, el título, la descripción y el contenido se rendericen correctamente.
  */
  it("renders correctly when open", () => {
    render(<DialogComponent {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #10/10

    Esta prueba verifica que la función onClose se llama cuando se hace clic en el botón de cierre.
  */
  it("calls onClose when close button is clicked", () => {
    render(<DialogComponent {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #3/4

    Esta prueba verifica que el componente no se renderiza cuando está cerrado.
  */
  it("does not render when closed", () => {
    render(<DialogComponent {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #4/4

    Esta prueba verifica que el componente se renderiza correctamente sin título ni descripción.
    Solo se espera que el contenido se renderice.
  */
  it("renders without title and description", () => {
    render(
      <DialogComponent isOpen={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </DialogComponent>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
