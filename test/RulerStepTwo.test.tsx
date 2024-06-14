import RulerStepTwo from "@/components/modals/ruler/RulerStepTwo";
import { RulerSurveyAnswer } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, describe, expect, it, vi } from "vitest";

let rulerEmotion: RulerSurveyAnswer;
let mockClose: Mock, mockPreviousStep: Mock, mockSetComment: Mock;
describe("RulerSurvey Component Test", () => {
  beforeEach(() => {
    rulerEmotion = {
      userId: "prueba",
      emotion: {
        name: "",
        pleasantness: 2,
        description: "",
        energy: 2,
        id: 1,
      },
      comment: "",
    };
    mockClose = vi.fn();
    mockPreviousStep = vi.fn();
    mockSetComment = vi.fn();
  });

  /* 
    Pedro Alonso Moreno Salcedo A01741437 - Test #6/10

    This test verifies that the Ruler Survey comment
    (the step two of that survey) is rendered correctly
  */
  it("Should render step two", () => {
    render(
      <RulerStepTwo
        rulerSurveyAnswer={rulerEmotion}
        onClose={mockClose}
        previousStep={mockPreviousStep}
        setComment={mockSetComment}
      />,
    );
    expect(screen.getByTestId("ruler-step-two")).toBeInTheDocument();
  });

  /* 
    Pedro Alonso Moreno Salcedo A01741437 - Test #7/10

    This test verifies that the Ruler Survey comment
    (the step two of that survey) calls the setComment
    function once the user types on the input
  */
  it("Should set a comment", () => {
    render(
      <RulerStepTwo
        rulerSurveyAnswer={rulerEmotion}
        onClose={mockClose}
        previousStep={mockPreviousStep}
        setComment={mockSetComment}
      />,
    );
    const comment = screen.getByLabelText(
      "Why did you feel this way? (Optional)",
    );
    fireEvent.change(comment, { target: { value: "test" } });
    expect(mockSetComment).toHaveBeenCalledTimes(1);
  });

  /* 
    Pedro Alonso Moreno Salcedo A01741437 - Test #8/10

    This test verifies that the Ruler Survey comment
    (the step two of that survey) goes back when the
    back-button is pressed
  */
  it("Should go back", () => {
    render(
      <RulerStepTwo
        rulerSurveyAnswer={rulerEmotion}
        onClose={mockClose}
        previousStep={mockPreviousStep}
        setComment={mockSetComment}
      />,
    );
    const backButton = screen.getByText("Go back");
    fireEvent.click(backButton);
    expect(mockPreviousStep).toHaveBeenCalledTimes(1);
  });
});
