import SprintStepOne from "@/components/modals/SprintStepOne";
import { Questions, SprintSurveyAnswer } from "@/types/types";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock existing questions
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

const setSprintSurveyAnswer = vi.fn();
// Mochk a sprint survey answer
const mockSprintAnswer: SprintSurveyAnswer = {
  userId: "1",
  sprintSurveyId: 2,
  projectAnswers: [],
  coworkersAnswers: [],
  commentId: 0,
  coworkersComments: [],
};

// Start the tests for the first part of the sprint survey
describe("SprintSurveyStepOne", () => {
  // Felipe de Jesús González Acosta A01275536 - Test #4/10
  // Test know if the component renders itself
  it("should render", () => {
    render(
      <SprintStepOne
        questions={mockQuestions}
        setSprintSurveyAnswer={setSprintSurveyAnswer}
        sprintSurveyAnswer={mockSprintAnswer}
      />,
    );

    const sprinStepOne = screen.getByTestId("sprint-step-one");
    expect(sprinStepOne).toBeInTheDocument();
  });

  // Felipe de Jesús González Acosta A01275536 - Test #5/10
  // Test know if the component renders the sliders of the questions
  it("should render sliders", () => {
    render(
      <SprintStepOne
        questions={mockQuestions}
        setSprintSurveyAnswer={setSprintSurveyAnswer}
        sprintSurveyAnswer={mockSprintAnswer}
      />,
    );

    const sliders = screen.getAllByTestId(/slider-/);
    expect(sliders).toHaveLength(mockQuestions.length);
    sliders.forEach((slider, index) => {
      expect(slider).toHaveTextContent(mockQuestions[index].description);
    });
  });

  // Felipe de Jesús González Acosta A01275536 - Test #6/10
  // Test know if the sliders execute their onChange function to declare the answer value
  it("should trigger onChange", () => {
    render(
      <SprintStepOne
        questions={mockQuestions}
        setSprintSurveyAnswer={setSprintSurveyAnswer}
        sprintSurveyAnswer={mockSprintAnswer}
      />,
    );
    mockQuestions.forEach((question) => {
      const slider = screen.getByTestId(`slider-${question.id}`);
      fireEvent.change(within(slider).getByTestId("input-slider"), {
        target: { value: 2 },
      });
    });
    expect(setSprintSurveyAnswer).toHaveBeenCalledTimes(mockQuestions.length);
  });
});
