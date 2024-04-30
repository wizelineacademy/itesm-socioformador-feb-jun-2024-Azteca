export type Coworker = {
  name: string;
  photoUrl?: string;
  userId: string;
  color?: string;
};

export type SurveyCoworker = {
  times: number;
} & Coworker;

export type SprintSurveyAnswer = {
  userId: string;
  sprintSurveyId: number;
  projectAnswers: Array<{ questionKey: string; answer: number }>;
  coworkersAnswers: Array<{
    questionKey: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  }>;
  coworkersComments: { [key: string]: string };
};

export type SurveyStepTwoAnswer = {
  punctuality: Array<Array<Coworker>>;
  cooperation: Array<Array<Coworker>>;
  support: Array<Array<Coworker>>;
  motivates: Array<Array<Coworker>>;
};

export type ProjectAnswer = {
  finalSurveyId: number;
  answers: Array<{ questionKey: string; answer: number }>;
  comment: string;
};

export type Notification = {
  id: number | null;
  projectName: string | null;
  date: Date;
  type: "RULER" | "SPRINT" | "FINAL";
};
