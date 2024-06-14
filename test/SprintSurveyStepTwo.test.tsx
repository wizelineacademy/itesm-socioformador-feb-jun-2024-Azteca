import SelectableDragUsers from "@/components/modals/SelectableDragUsers";
import SprintStepTwo from "@/components/modals/SprintStepTwo";
import { Questions, SurveyCoworker, SurveyStepTwoAnswer } from "@/types/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock some questions
const mockQuestions: Questions[] = [
  {
    id: 1,
    description: "Test Question 1",
    type: "SPRINT_QUESTION",
  },
  {
    id: 2,
    description: "Test Question 2",
    type: "SPRINT_QUESTION",
  },
];

// Mock the front end library needed
vi.mock("@dnd-kit/core", () => {
  return {
    useDraggable: vi.fn(() => ({
      attributes: {},
      transform: { x: 0, y: 0 },
      setNodeRef: vi.fn(),
      listeners: {},
      isDragging: false,
    })),
    useDroppable: vi.fn(() => ({
      isOver: false,
    })),
    DndContext: vi.fn(({ children }) => children),
    pointerWithin: vi.fn(() => true),
  };
});

const mockSetSprintSurveyStepTwoAnswer = vi.fn();
const mockSprintStepTwo: SurveyStepTwoAnswer = mockQuestions.reduce(
  (acc, question) => {
    acc[question.id] = Array(10)
      .fill([])
      .map(() => []);
    return acc;
  },
  {} as SurveyStepTwoAnswer,
);

// Mock users
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

// Mock react framework
vi.mock("react", () => {
  return {
    useState: vi.fn((initial) => [initial, mockSetSprintSurveyStepTwoAnswer]),
    useEffect: vi.fn(),
  };
});

// Tests for the second part of the Sprint Survey
describe("Should render SprintSurveyStepTwo", () => {
  // Felipe de Jesús González Acosta A01275536 - Test #7/10
  // Test that the component of the survey renders itself
  it("Should render SprintSurveyStepTwo", () => {
    render(
      <SprintStepTwo
        users={users}
        setSprintSurveyStepTwoAnswer={mockSetSprintSurveyStepTwoAnswer}
        sprintSurveyStepTwoAnswer={mockSprintStepTwo}
        questions={mockQuestions}
      />,
    );
    const sprintStepTwo = screen.getByTestId("sprint-step-two");
    expect(sprintStepTwo).toBeInTheDocument();
  });
  // Felipe de Jesús González Acosta A01275536 - Test #8/10
  // Test that the users exist of the survey renders itself
  it("Should render SelectableDragUsers, and all users", () => {
    render(<SelectableDragUsers users={users as SurveyCoworker[]} />);
    const selectableDragUsers = screen.getByTestId("selectable-drag-users");
    expect(selectableDragUsers).toBeInTheDocument();
  });
});
