"use client";
import SprintDropRow from "./SprintDropRow";
import { useState } from "react";
import { Coworker, SurveyCoworker } from "@/types/types";
import { DndContext, DragEndEvent, pointerWithin } from "@dnd-kit/core";
import SelectableDragUsers from "./SelectableDragUsers";
import { SurveyStepTwoAnswer } from "@/types/types";
import toast from "react-hot-toast";

interface SprintStepTwoProps {
  sprintSurveyStepTwoAnswer: SurveyStepTwoAnswer;
  setSprintSurveyStepTwoAnswer: (
    sprintSurveyStepTwoAnswer: SurveyStepTwoAnswer,
  ) => void;
  users: Coworker[];
}

const SprintStepTwo = ({
  sprintSurveyStepTwoAnswer,
  setSprintSurveyStepTwoAnswer,
  users,
}: SprintStepTwoProps) => {
  const yellowOpacities = [
    "bg-yellowSurvey/10",
    "bg-yellowSurvey/20",
    "bg-yellowSurvey/30",
    "bg-yellowSurvey/40",
    "bg-yellowSurvey/50",
    "bg-yellowSurvey/60",
    "bg-yellowSurvey/70",
    "bg-yellowSurvey/80",
    "bg-yellowSurvey/90",
    "bg-yellowSurvey/100 rounded-r-lg",
  ];

  const purpleOpacities = [
    "bg-primary/10",
    "bg-primary/20",
    "bg-primary/30",
    "bg-primary/40",
    "bg-primary/50",
    "bg-primary/60",
    "bg-primary/70",
    "bg-primary/80",
    "bg-primary/90",
    "bg-primary/100 rounded-r-lg",
  ];

  const blueOpacities = [
    "bg-blueSurvey/10",
    "bg-blueSurvey/20",
    "bg-blueSurvey/30",
    "bg-blueSurvey/40",
    "bg-blueSurvey/50",
    "bg-blueSurvey/60",
    "bg-blueSurvey/70",
    "bg-blueSurvey/80",
    "bg-blueSurvey/90",
    "bg-blueSurvey/100 rounded-r-lg",
  ];

  const redOpacities = [
    "bg-redSurvey/10",
    "bg-redSurvey/20",
    "bg-redSurvey/30",
    "bg-redSurvey/40",
    "bg-redSurvey/50",
    "bg-redSurvey/60",
    "bg-redSurvey/70",
    "bg-redSurvey/80",
    "bg-redSurvey/90",
    "bg-redSurvey/100 rounded-r-lg",
  ];

  const playSound = (soundId: string) => {
    const audio = document.getElementById(soundId) as HTMLAudioElement;
    audio.play();
  };

  const getRemainingTimes = (userId: string, times: number): number => {
    let remainingTimes = times;
    sprintSurveyStepTwoAnswer &&
      Object.keys(sprintSurveyStepTwoAnswer).forEach((key) => {
        const subArray =
          sprintSurveyStepTwoAnswer[key as keyof SurveyStepTwoAnswer];
        subArray.forEach((subArrayElement) => {
          if (subArrayElement.some((coworker) => coworker.userId === userId)) {
            remainingTimes -= 1;
          }
        });
      });

    return remainingTimes;
  };

  const [selectableUsers, setSelectableUsers] = useState<Array<SurveyCoworker>>(
    users.map((user) => {
      return {
        ...user,
        times: getRemainingTimes(user.userId, 4),
      };
    }),
  );

  const verifyRepeated = (
    newPositionName: keyof SurveyStepTwoAnswer,
    newPositionNumber: number,
    prevPositionName: keyof SurveyStepTwoAnswer | "base",
    prevPositionNumber: number,
    coworker: Coworker,
  ) => {
    if (prevPositionName === "base") {
      if (existsInRow(newPositionName, coworker.userId)) return;
      else {
        handleAddItem(newPositionName, newPositionNumber, coworker);
        handleRemoveUserTimes(coworker.userId);
      }
      return;
    } else if (newPositionName === prevPositionName) {
      const scopeItems = sprintSurveyStepTwoAnswer[newPositionName];
      scopeItems[prevPositionNumber] = scopeItems[prevPositionNumber].filter(
        (user) => user.userId != coworker.userId,
      );
      scopeItems[newPositionNumber].push(coworker);
      setSprintSurveyStepTwoAnswer({
        ...sprintSurveyStepTwoAnswer,
        [newPositionName]: scopeItems,
      });
      playSound("drop-audio");
      return;
    }
    if (existsInRow(newPositionName, coworker.userId)) return;

    const newItems = sprintSurveyStepTwoAnswer[newPositionName];
    newItems[newPositionNumber].push(coworker);
    const prevItems = sprintSurveyStepTwoAnswer[prevPositionName];
    prevItems[prevPositionNumber] = prevItems[prevPositionNumber].filter(
      (user) => user.userId != coworker.userId,
    );
    setSprintSurveyStepTwoAnswer({
      ...sprintSurveyStepTwoAnswer,
      [newPositionName]: newItems,
      [prevPositionName]: prevItems,
    });
    playSound("drop-audio");
  };

  const handleAddItem = (
    type: keyof SurveyStepTwoAnswer,
    position: number,
    coworker: Coworker,
  ) => {
    const items = sprintSurveyStepTwoAnswer[type];
    items[position].push(coworker);
    setSprintSurveyStepTwoAnswer({
      ...sprintSurveyStepTwoAnswer,
      [type]: items,
    });
    playSound("drop-audio");
  };

  const handleRemoveUserTimes = (userId: string) => {
    const newUsers = selectableUsers.map((user) => {
      if (user.userId === userId) {
        user.times -= 1;
      }
      return user;
    });
    setSelectableUsers(newUsers);
  };

  const existsInRow = (
    destination: keyof SurveyStepTwoAnswer,
    userId: string,
  ) => {
    const searchScope = sprintSurveyStepTwoAnswer[destination];
    for (let i = 0; i < searchScope.length; i++) {
      if (searchScope[i].some((coworker) => coworker.userId === userId)) {
        playSound("invalid-audio");
        toast.error("El usuario seleccionado ya está en la fila.");
        return true;
      }
    }
    return false;
  };

  const existsInPosition = (
    destination: keyof SurveyStepTwoAnswer,
    position: number,
    userId: string,
  ) => {
    const searchScope = sprintSurveyStepTwoAnswer[destination][position];
    if (searchScope.some((coworker) => coworker.userId === userId)) {
      playSound("invalid-audio");
      toast.error("No puede agregar a un mismo usuario dos veces en una fila.");
      return true;
    }
    return false;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over) return;
    const destination = event.over.id as string;
    const destinationData = destination.split("-");
    const destinationPlace = destinationData[0] as keyof SurveyStepTwoAnswer;
    const destinationPosition = Number(destinationData[1]);

    const coworker = event.active.data.current as Coworker;
    if (
      existsInPosition(destinationPlace, destinationPosition, coworker.userId)
    )
      return;
    const draggedCoworkerId = event?.active?.id as string;
    const previousPosition = draggedCoworkerId.split("-");
    verifyRepeated(
      destinationPlace,
      destinationPosition,
      previousPosition[0] as keyof SurveyStepTwoAnswer | "base",
      Number(previousPosition[1]),
      coworker,
    );
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <p className="mt-6 self-start text-sm">
        <strong>Drag and drop</strong> the profile picture of yonpmur{" "}
        <strong>co-worker</strong> to the box that{" "}
        <strong>best fits your opinion</strong>
      </p>
      <div className="mt-6 flex w-full flex-col text-xs font-light text-black">
        <div className="flex w-3/4 flex-row justify-between self-end">
          <p>Disagree</p>
          <p>Neutral</p>
          <p>Agree</p>
        </div>
        <section id="drag-drop" className="mt-1 flex w-full flex-col">
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={pointerWithin}
          >
            <SprintDropRow
              name="SS_CWPN"
              people={sprintSurveyStepTwoAnswer.SS_CWPN}
              title="Is puntual in sessions and meetings?"
              colors={yellowOpacities}
              titlePadding="p-[18px] pe-2"
            />

            <SprintDropRow
              name="SS_CWCM"
              people={sprintSurveyStepTwoAnswer.SS_CWCM}
              title="Cooperation and communication with the peer was smooth"
              colors={purpleOpacities}
              className="mt-6"
              titlePadding="p-2"
            />
            <SprintDropRow
              name="SS_CWSP"
              people={sprintSurveyStepTwoAnswer.SS_CWSP}
              title="Offers support or shows appreciation to other team members"
              colors={blueOpacities}
              className="mt-6"
              titlePadding="p-2"
            />
            <SprintDropRow
              name="SS_CWMT"
              people={sprintSurveyStepTwoAnswer.SS_CWMT}
              title="Motivates other team members to achieve goals"
              colors={redOpacities}
              className="mt-6"
              titlePadding="p-[18px] pe-2"
            />
            <SelectableDragUsers users={selectableUsers} />
          </DndContext>
        </section>
      </div>
      <audio id="drop-audio" src="/sounds/dropSound.mp3">
        <track kind="captions" />
      </audio>
      <audio id="invalid-audio" src="/sounds/invalidSound.ogg">
        <track kind="captions" />
      </audio>
    </main>
  );
};

export default SprintStepTwo;
