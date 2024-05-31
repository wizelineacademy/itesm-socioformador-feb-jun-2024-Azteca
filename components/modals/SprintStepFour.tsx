"use client";
import { Coworker, SprintSurveyAnswer } from "@/types/types";
import UserIcon from "../icons/UserIcon";
import { useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import UserProfileButton from "../UserProfileButton";

interface SprintStepFour {
  users: Coworker[];
  sprintSurveyAnswer: SprintSurveyAnswer;
  setSprintSurveyAnswer: (sprintSurveyAnswer: SprintSurveyAnswer) => void;
}

const SprintStepFour = ({
  users,
  sprintSurveyAnswer,
  setSprintSurveyAnswer,
}: SprintStepFour) => {
  const [usersSelected, setUsersSelected] = useState<Coworker[]>([]);
  const [selectableUsers, setSelectableUsers] = useState<Coworker[]>(users);
  const maxWordCount = 300;
  const onChangeValue = (comment: string, userId: string) => {
    const newCoworkersComments = [...sprintSurveyAnswer.coworkersComments];
    const index = newCoworkersComments.findIndex(
      (coworker) => coworker.coworkerId === userId,
    );
    if (index === -1) {
      newCoworkersComments.push({ coworkerId: userId, comment: comment });
    } else {
      newCoworkersComments[index].comment = comment;
    }
    setSprintSurveyAnswer({
      ...sprintSurveyAnswer,
      coworkersComments: newCoworkersComments,
    });
  };

  const onUserSelected = (newUser: Coworker) => {
    setSelectableUsers(
      selectableUsers.filter((user) => user.userId !== newUser.userId),
    );
  };

  const handleUserSelected = (newUser: Coworker) => {
    const isUserInArray = usersSelected.find(
      (user) => user.userId === newUser.userId,
    );
    if (isUserInArray) return;
    setUsersSelected([newUser, ...usersSelected]);
    onUserSelected(newUser);
  };

  const onUserDeleted = (deleteUser: Coworker) => {
    setSelectableUsers([...selectableUsers, deleteUser]);
  };

  const handleDeleteUserSelected = (deleteUser: Coworker) => {
    const element = document.getElementById(deleteUser.userId);
    if (!element) return;

    element.classList.add("dissolve");

    setTimeout(() => {
      setUsersSelected(
        usersSelected.filter((user) => user.userId !== deleteUser.userId),
      );
      onUserDeleted(deleteUser);
      //La neta no se porque sigue exisitiendo en el DOM, pero se necesita para que la
      //la clase no se propague a otro elemento.
      if (document.body.contains(element)) {
        element.classList.remove("dissolve");
      }
    }, 300);
  };

  return (
    <>
      <p className="my-3 self-start text-sm">
        <strong>Select</strong> the <strong>coworkers</strong> you&apos;d like
        to give <strong>additional feedback.</strong>
      </p>
      <div className=" grid grid-flow-row grid-cols-4 gap-x-4">
        <section id="users-select" className="col-span-1 mt-2 flex flex-col">
          <p className="text-base font-medium text-black">Coworkers</p>
          {selectableUsers.length !== 0 && (
            <div className="mt-2 flex h-44 w-full appearance-none flex-col gap-y-1 overflow-auto pe-2">
              {selectableUsers.map((user, index) => (
                <button
                  className="group flex cursor-pointer flex-row items-center gap-x-2 rounded-xl p-1 hover:bg-primary/80"
                  key={index}
                  onClick={() => handleUserSelected(user)}
                >
                  {user.photoUrl && (
                    <UserProfileButton photoUrl={user.photoUrl} size="sm" />
                  )}
                  {!user.photoUrl && (
                    <UserIcon
                      size="h-8 w-8"
                      color="text-primary group-hover:text-white"
                    />
                  )}
                  <p className="font-lg py-w w-[15ch] text-sm text-black group-hover:text-white">
                    {user.name}
                  </p>
                </button>
              ))}
            </div>
          )}
          {selectableUsers.length === 0 && (
            <p className="m-auto text-sm font-medium text-grayText">
              No more selectable users
            </p>
          )}
        </section>
        <section
          id="additional-feedback"
          className="col-span-3 mt-2 flex h-full flex-col"
        >
          {usersSelected.length !== 0 && (
            <div className="mt-2 flex h-44 w-full flex-col gap-y-4 overflow-scroll pe-4 ">
              {usersSelected.map((user, index) => (
                <div
                  key={index}
                  id={user.userId}
                  className="flex w-full flex-col items-center justify-start"
                >
                  <div className="flex w-full flex-row justify-between">
                    <label className="w-full font-normal text-black">
                      {user.name}
                    </label>
                    <button type="button">
                      <CloseIcon
                        size="h-5 w-5"
                        color="text-black hover:text-red-600"
                        closeFunction={() => handleDeleteUserSelected(user)}
                      />
                    </button>
                  </div>
                  <div className="d-flex w-full flex-col">
                    <textarea
                      value={
                        sprintSurveyAnswer.coworkersComments.find(
                          (coworker) => coworker.coworkerId === user.userId,
                        )?.comment || ""
                      }
                      onChange={(e) =>
                        onChangeValue(e.target.value, user.userId)
                      }
                      placeholder="Type some feedback..."
                      className="w-full rounded-lg border border-primary-light p-1 text-sm placeholder:left-1 placeholder:text-sm focus:outline-primary-dark"
                      maxLength={maxWordCount}
                    />
                    <span className="float-end text-xs font-light">
                      {
                        sprintSurveyAnswer.coworkersComments.find(
                          (coworker) => coworker.coworkerId === user.userId,
                        )?.comment.length
                      }
                      /{maxWordCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {usersSelected.length === 0 && (
            <p className="m-auto self-center text-lg font-medium text-grayText">
              No selected users
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default SprintStepFour;
