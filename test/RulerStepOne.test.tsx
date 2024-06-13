import RulerStepOne from "@/components/modals/ruler/RulerStepOne";
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
  });

  // Pedro Alonso Moreno Salcedo A01741437 - Test #1/10
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

  // Pedro Alonso Moreno Salcedo A01741437 - Test #2/10
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

  // Pedro Alonso Moreno Salcedo A01741437 - Test #3/10
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

  // Pedro Alonso Moreno Salcedo A01741437 - Test #4/10
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

  // Pedro Alonso Moreno Salcedo A01741437 - Test #5/10
  it("Should go to the next step", async () => {
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
    await vi.waitUntil(() => nextStepMock.mock.calls.length > 0);
    expect(setMockEmotion).toHaveBeenCalledTimes(1);
  });
});
