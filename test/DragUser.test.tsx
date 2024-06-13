import DraggableUser from "@/components/modals/DraggableUser";
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { customDndProvider } from "./mock-utils/mockUtils";

const users = [
  {
    userId: "1",
    name: "Test User",
    photoUrl: "https://test.com",
  },
  {
    userId: "2",
    name: "Test User 2",
    photoUrl: "https://test.com",
  },
  {
    userId: "3",
    name: "Test User 3",
    photoUrl: "https://test.com",
  },
];

vi.mock("react", () => {
  return {
    useState: vi.fn(() => [false, vi.fn()]),
    useEffect: vi.fn(),
  };
});

describe("Should render SprintSurveyStepTwo", () => {
  // Pedro Alonso Moreno Salcedo A01741437 - Test #9/10
  it("Should render dragUser", () => {
    customDndProvider(<DraggableUser user={users[0]} times={2} />, vi.fn());
    const draggableUser = screen.getByTestId("draggable-1");
    expect(draggableUser).toBeInTheDocument();
  });

  // Pedro Alonso Moreno Salcedo A01741437 - Test #10/10
  it("Should not render dragUser", () => {
    customDndProvider(<DraggableUser user={users[0]} />, vi.fn());
    const draggableUser = screen.getByTestId(`draggable-${users[0].userId}`);
    expect(
      within(draggableUser).queryByTestId(`user-${users[0].userId}-times`),
    ).not.toBeInTheDocument();
  });
});
