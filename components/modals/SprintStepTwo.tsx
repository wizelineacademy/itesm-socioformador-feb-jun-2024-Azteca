"use client";
import SprintDropRow from "./SprintDropRow";
import { useState, useEffect } from "react";
import { Coworker, SurveyCoworker } from "@/constants";
import { DndContext, DragEndEvent, pointerWithin } from "@dnd-kit/core";
import SelectableDragUsers from "./SelectableDragUsers";

interface SurveyAnswer {
  punctuality: Array<Array<Coworker>>;
  cooperation: Array<Array<Coworker>>;
  support: Array<Array<Coworker>>;
  motivates: Array<Array<Coworker>>;
}

const SprintStepTwo = () => {
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

  const [audioContext, setAudioContext] = useState<AudioContext>();
  useEffect(() => setAudioContext(new AudioContext()), []);

  const playSound = (soundId: string) => {
    const audio = document.getElementById(soundId) as HTMLAudioElement;
    audio.play();
  };

  const [surveyAnswer, setSurveyAnswer] = useState<SurveyAnswer>({
    punctuality: Array(10)
      .fill([])
      .map(() => []),
    cooperation: Array(10)
      .fill([])
      .map(() => []),
    support: Array(10)
      .fill([])
      .map(() => []),
    motivates: Array(10)
      .fill([])
      .map(() => []),
  });

  const users: Coworker[] = [
    {
      name: "Pedro Alonso",
      photoUrl: "",
      userId: "eorjioerji",
      color: "text-blue-300",
    },
    {
      name: "Alejandro Mendoza",
      photoUrl: "",
      userId: "inenrvoerni",
      color: "text-red-300",
    },
    {
      name: "Felipe González",
      photoUrl: "",
      userId: "wefiweo",
      color: "text-yellow-300",
    },
    {
      name: "Adrian Ramírez",
      photoUrl: "",
      userId: "woiejiew",
      color: "text-green-300",
    },
  ];

  const [selectableUsers, setSelectableUsers] = useState<Array<SurveyCoworker>>(
    users.map((user) => {
      return {
        ...user,
        times: 4,
      };
    }),
  );

  const handleAddItem = (
    type: keyof SurveyAnswer,
    position: number,
    coworker: Coworker,
  ) => {
    const items = surveyAnswer[type];
    items[position].push(coworker);
    setSurveyAnswer({ ...surveyAnswer, [type]: items });
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

  const existsInArray = (destination: keyof SurveyAnswer, userId: string) => {
    const searchScope = surveyAnswer[destination];

    for (let i = 0; i < searchScope.length; i++) {
      if (searchScope[i].some((coworker) => coworker.userId === userId)) {
        playSound("invalid-audio");
        return true;
      }
    }
    return false;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over) return;
    const destination = String(event.over.id);
    const destinationData = destination.split("-");
    const destinationPlace = destinationData[0] as keyof SurveyAnswer;
    const destinationPosition = Number(destinationData[1]);
    const coworker = event.active.data.current as Coworker;
    if (existsInArray(destinationPlace, coworker.userId)) return;
    handleAddItem(destinationPlace, destinationPosition, coworker);
    playSound("drop-audio");
    handleRemoveUserTimes(String(event?.active?.data?.current?.userId));
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
              name="punctuality"
              people={surveyAnswer.punctuality}
              title="Is puntual in sessions and meetings?"
              colors={yellowOpacities}
              titlePadding="p-[18px] pe-2"
            />

            <SprintDropRow
              name="cooperation"
              people={surveyAnswer.cooperation}
              title="Cooperation and communication with the peer was smooth"
              colors={purpleOpacities}
              className="mt-6"
              titlePadding="p-2"
            />
            <SprintDropRow
              name="support"
              people={surveyAnswer["support"]}
              title="Offers support or shows appreciation to other team members"
              colors={blueOpacities}
              className="mt-6"
              titlePadding="p-2"
            />
            <SprintDropRow
              name="motivates"
              people={surveyAnswer.motivates}
              title="Motivates other team members to achieve goals"
              colors={redOpacities}
              className="mt-6"
              titlePadding="p-[18px] pe-2"
            />
            <SelectableDragUsers users={selectableUsers} />
          </DndContext>
        </section>
      </div>
      <audio id="drop-audio" src="/sounds/dropSound.mp3" />
      <audio id="invalid-audio" src="/sounds/invalidSound.ogg" />
    </main>
  );
};

export default SprintStepTwo;
