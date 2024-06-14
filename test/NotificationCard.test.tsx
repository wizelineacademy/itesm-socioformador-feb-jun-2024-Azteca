import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotificationCard from "@/components/NotificationCard";
import { Notification } from "@/types/types";

// Mocking the PartyIcon and parseDate
// Esto crea un mock para el componente PartyIcon y la función parseDate
vi.mock("@/components/icons/PartyIcon", () => ({
  __esModule: true,
  default: ({ color, size }: { color: string; size: string }) => (
    <div data-testid="party-icon" className={`${color} ${size}`}></div>
  ),
}));

vi.mock("@/utils/utils", () => ({
  __esModule: true,
  parseDate: () => ({
    dateAsText: "Mocked Date",
  }),
}));

describe("NotificationCard Component", () => {
  /*
    Alejandro Mendoza Prado A00819383 - Test #3/10

    Esta prueba verifica que la notificación vacía se renderiza correctamente.
  */
  it("renders empty notification", () => {
    render(<NotificationCard empty={true} />);
    expect(screen.getByTestId("empty-notification")).toBeInTheDocument();
    expect(screen.getByText("CONGRATULATIONS!")).toBeInTheDocument();

    expect(screen.getByTestId("party-icon")).toBeInTheDocument();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #4/10

    Esta prueba verifica que la notificación con datos se renderiza correctamente.
  */
  it("renders notification with data", () => {
    const notification: Notification = {
      id: 1,
      type: "RULER",
      projectName: "Project ABC",
      date: new Date("2023-06-15T00:00:00Z"),
      projectId: 1,
    };

    render(<NotificationCard notification={notification} />);
    expect(screen.getByTestId("Daily Ruler Survey")).toBeInTheDocument();
    expect(screen.getByText("Daily Ruler Survey")).toBeInTheDocument();
    expect(screen.getByText("Project ABC")).toBeInTheDocument();
    expect(screen.getByText("Mocked Date")).toBeInTheDocument();
  });

  /*
    Alejandro Mendoza Prado A00819383 - Test #5/10

    Esta prueba verifica que la notificación de tipo RULER sin nombre de proyecto se renderiza correctamente.
  */
  it("renders notification with no project name for RULER type", () => {
    const notification: Notification = {
      type: "RULER",
      projectName: "",
      date: new Date("2023-06-15T00:00:00Z"),
      id: 0,
      projectId: 0,
    };

    render(<NotificationCard notification={notification} />);
    expect(screen.getByTestId("Daily Ruler Survey")).toBeInTheDocument();
    expect(screen.getByText("Daily Ruler Survey")).toBeInTheDocument();
    expect(screen.queryByText("Project:")).not.toBeInTheDocument();
    expect(screen.getByText("Mocked Date")).toBeInTheDocument();
  });
});
