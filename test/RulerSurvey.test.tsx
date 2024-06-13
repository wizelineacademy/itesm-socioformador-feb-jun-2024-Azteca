import RulerStepOne from "@/components/modals/ruler/RulerStepOne";
import RulerStepTwo from "@/components/modals/ruler/RulerStepTwo";
import { Emotion, RulerSurveyAnswer } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, describe, expect, it, vi } from "vitest";

const randomEmotion = {
  row: Math.floor(Math.random() * 12),
  col: Math.floor(Math.random() * 12),
};

const emotionBgColor = (emotion: Emotion) => {
  if (emotion.pleasantness < 0 && emotion.energy < 0) return "bg-blue-400";
  else if (emotion.pleasantness < 0 && emotion.energy > 0) return "bg-red-400";
  else if (emotion.pleasantness > 0 && emotion.energy < 0)
    return "bg-green-400";
  else return "bg-yellow-400";
};

let setMockEmotion: Mock, nextStepMock: Mock, rulerEmotion: RulerSurveyAnswer;
let mockClose: Mock, mockPreviousStep: Mock, mockSetComment: Mock;
describe("RulerSurvey Component Test", () => {
  beforeEach(() => {
    setMockEmotion = vi.fn();
    nextStepMock = vi.fn();
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
  it("Should render step one", () => {
    render(
      <RulerStepOne
        setEmotion={setMockEmotion}
        rulerSurveyAnswer={rulerEmotion}
        nextStep={nextStepMock}
      />,
    );

    expect(screen.getByTestId("ruler-step-one")).toBeInTheDocument();
  });
  it("Should get an emotion", () => {
    render(
      <RulerStepOne
        setEmotion={setMockEmotion}
        rulerSurveyAnswer={rulerEmotion}
        nextStep={nextStepMock}
      />,
    );

    const emotion = screen.getByTestId(
      `emotion-${randomEmotion.row}-${randomEmotion.col}`,
    );
    fireEvent.mouseEnter(emotion);
    expect(emotion).toHaveClass("scale-150");
    fireEvent.mouseLeave(emotion);
    expect(emotion).not.toHaveClass("scale-150");
  });
  it("Should have the right color", () => {
    render(
      <RulerStepOne
        setEmotion={setMockEmotion}
        rulerSurveyAnswer={rulerEmotion}
        nextStep={nextStepMock}
      />,
    );
    const emotion = screen.getByTitle(
      `emotion-${rulerEmotion.emotion?.energy}-${rulerEmotion.emotion?.pleasantness}`,
    );
    expect(emotion).toHaveClass(
      emotionBgColor(rulerEmotion.emotion as Emotion),
    );
  });
  it("Should set an emotion", () => {
    render(
      <RulerStepOne
        setEmotion={setMockEmotion}
        rulerSurveyAnswer={rulerEmotion}
        nextStep={nextStepMock}
      />,
    );
    const emotion = screen.getByTestId(
      `emotion-${randomEmotion.row}-${randomEmotion.col}`,
    );
    fireEvent.click(emotion);
    expect(setMockEmotion).toHaveBeenCalledTimes(1);
  });
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
});
