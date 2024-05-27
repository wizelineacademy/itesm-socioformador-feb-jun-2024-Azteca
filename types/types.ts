export type Coworker = {
  name: string;
  photoUrl?: string | null;
  userId: string;
  color?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: "EMPLOYEE" | "MANAGER" | "ADMIN";
  department: string | null;
  photoUrl: string | null;
  jobTitle: string | null;
}

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

export type DateObject = {
  date: string;
  time: string;
  dateAsText: string;
};

export type ProjectSprint = "MS_RF" | "MS_LS" | "MS_RA" | "MS_WE";

export type SprintSurveyAnswer = {
  userId: string | undefined;
  sprintSurveyId: number;
  projectAnswers: Array<{ questionKey: ProjectSprint; answer: number }>;
  coworkersAnswers: Array<{
    questionKey: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  }>;
  coworkersComments: Array<{ coworkerId: string; comment: string }>;
};

export type QuestionType =
  | "SPRINT_QUESTION"
  | "COWORKER_QUESTION"
  | "COWORKER_COMMENT"
  | "FINAL_PROJECT_QUESTION"
  | "FINAL_PROJECT_COMMENT";

export type Questions = {
  id: number;
  description: number;
  type: QuestionType;
};

export type ProjectAnswer = {
  userId: string | undefined;
  finalSurveyId: number;
  answers: Array<{ questionKey: number; answer: number }>;
  comment: { questionKey: number; text: string };
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
};

export type Notification = {
  id: number;
  projectName: string;
  date: Date;
  type: "RULER" | "SPRINT" | "FINAL";
};

export type Emotion = {
  id: number;
  name: string;
  pleasantness: number;
  energy: number;
  description: string;
};

export type RulerSurveyAnswer = {
  userId: string | undefined;
  emotion: Emotion | null;
  comment: string | null;
};

export type Task = {
  id: number;
  userId: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
};

export type Resource = {
  id: number;
  userId: string | null;
  title: string | null;
  description: string | null;
  kind: string | null;
};

export type SQSMessageBody = {
  projectId: number;
  content: string;
};
