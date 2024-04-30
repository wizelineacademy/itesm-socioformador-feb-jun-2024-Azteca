export type Coworker = {
  name: string;
  photoUrl?: string;
  userId: string;
  color?: string;
};

export type SurveyCoworker = {
  times: number;
} & Coworker;

export type SurveyStepTwoAnswer = {
  //Sprint Survey Coworker Punctuality, Communication, Support, Motivation
  SS_CWPN: Array<Array<Coworker>>;
  SS_CWCM: Array<Array<Coworker>>;
  SS_CWSP: Array<Array<Coworker>>;
  SS_CWMT: Array<Array<Coworker>>;
};

export type ProjectSprint = "MS_RF" | "MS_LS" | "MS_RA" | "MS_WE";

export type SprintSurveyAnswer = {
  sprintSurveyId: number;
  projectAnswers: Array<{ questionKey: ProjectSprint; answer: number }>;
  coworkersAnswers: Array<{
    questionKey: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  }>;
  coworkersComments: Array<{ coworkerId: string; comment: string }>;
};

export type ProjectAnswer = {
  finalSurveyId: number;
  answers: Array<{ questionKey: string; answer: number }>;
  comment: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
};

export type Notification = {
  id: number | null;
  projectName: string | null;
  date: Date;
  type: "RULER" | "SPRINT" | "FINAL";
};

export type Emotion = {
  name: string;
  pleasantness: number;
  energy: number;
  description: string;
};
