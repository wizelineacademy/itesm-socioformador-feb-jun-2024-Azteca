import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Mock, describe, expect, it, vi } from "vitest";
import AddMemberButton from "@/components/AddMemberButton";

let mockShowAddMemberModal: Mock;

describe("AddMemberButton Component Test", () => {
  beforeEach(() => {
    mockShowAddMemberModal = vi.fn();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #1/10

    Esta prueba verifica que la función showAddMemberModal
    se llama cuando se hace clic en el botón.
  */
  it("llama a showAddMemberModal cuando se hace clic", () => {
    render(<AddMemberButton showAddMemberModal={mockShowAddMemberModal} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockShowAddMemberModal).toHaveBeenCalled();
  });
});
