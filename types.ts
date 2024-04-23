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
  sprintSurveyId: string;
  projectAnswers: Array<{ questionKey: string; answer: number }>;
  coworkersAnswers: Array<{
    questionKey: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  }>;
};

export type SurveyStepTwoAnswer = {
  punctuality: Array<Array<Coworker>>;
  cooperation: Array<Array<Coworker>>;
  support: Array<Array<Coworker>>;
  motivates: Array<Array<Coworker>>;
};
