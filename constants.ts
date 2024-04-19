export type Coworker = {
  name: string;
  photoUrl?: string;
  userId: string;
  color?: string;
};

export type SurveyCoworker = {
  times: number;
} & Coworker;
