import {
  boolean,
  char,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["EMPLOYEE", "MANAGER"]);

export const user = pgTable(
  "_user", //had to rename it because the word 'user' is reserved in postgres
  {
    id: char("id", { length: 32 }).primaryKey(),
    name: varchar("name", { length: 64 }),
    email: varchar("email", { length: 64 }).unique(),
    jobTitle: varchar("job_title", { length: 64 }),
    department: varchar("department", { length: 64 }),
    photoUrl: varchar("photo_url", { length: 1024 }),
    role: userRoleEnum("role"),
  },
);

export const project = pgTable("project", {
  id: integer("id").primaryKey(),
  managerId: char("manager_id", { length: 32 }).references(() => user.id),
  name: varchar("name", { length: 64 }),
  description: varchar("description", { length: 1024 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  sprintSurveyPeriodicity: integer("sprint_survey_periodicity"),
});

export const projectMember = pgTable(
  "project_member",
  {
    userId: char("user_id", { length: 32 }).references(() => user.id),
    projectId: integer("project_id").references(() => project.id),
    startDate: date("start_date"),
    endDate: date("end_date"),
  },
  // composite primary key on (userId, projectId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.projectId] }),
    };
  },
);

export const traitKindEnum = pgEnum("kind", [
  "STRENGTH",
  "AREA_OF_OPPORTUNITY",
]);

export const trait = pgTable("trait", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 64 }),
  description: varchar("description", { length: 1024 }),
  kind: traitKindEnum("kind"),
});

export const userTrait = pgTable(
  "user_trait",
  {
    userId: char("user_id", { length: 32 }).references(() => user.id),
    traitId: integer("trait_id").references(() => trait.id),
  },
  // composite primary key on (userId, traitId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.traitId] }),
    };
  },
);

export const pipTask = pgTable("pip_task", {
  id: integer("id").primaryKey(),
  userId: char("user_id", { length: 32 }).references(() => user.id),
  title: varchar("title", { length: 64 }),
  description: varchar("description", { length: 256 }),
  isDone: boolean("is_done"),
});

export const pipResourceKind = pgEnum("role", ["BOOK", "VIDEO", "ARTICLE"]);

export const pipResource = pgTable("pip_resource", {
  id: integer("id").primaryKey(),
  userId: char("user_id", { length: 32 }).references(() => user.id),
  title: varchar("title", { length: 64 }),
  kind: pipResourceKind("kind"),
  description: varchar("description", { length: 1024 }),
});

export const rulerSurvey = pgTable("ruler_survey", {
  id: integer("id").primaryKey(),
  createdAt: date("created_at"),
});

export const quadrantEnum = pgEnum("quadrant", ["1", "2", "3", "4"]);

export const rulerSurveyAnswers = pgTable(
  "ruler_survey_answers",
  {
    rulerSurveyId: integer("ruler_survey_id").references(() => rulerSurvey.id),
    userId: char("user_id", { length: 32 }).references(() => user.id),
    quadrant: quadrantEnum("quadrant"),
    emotion: varchar("emotion", { length: 16 }),
    createdAt: date("created_at"),
  },
  // composite primary key on (userId, rulerSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.rulerSurveyId] }),
    };
  },
);

export const sprintSurvey = pgTable("sprint_survey", {
  id: integer("sprint_survey_id").primaryKey(),
  projectId: integer("project_id").references(() => project.id),
  createdAt: date("created_at"),
});

export const sprintSurveyAnswerProject = pgTable(
  "sprint_survey_answer_project",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
    ),
    userId: char("user_id", { length: 32 }).references(() => user.id),
    questionName: varchar("question_name", { length: 8 }),
    answer: integer("answer"),
  },
  // composite primary key on (userId, sprintSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.sprintSurveyId] }),
    };
  },
);

export const sprintSurveyAnswerCoworkers = pgTable(
  "sprint_survey_answer_coworkers",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
    ),
    userId: char("user_id", { length: 32 }).references(() => user.id),
    coworkerId: integer("coworker_id"),
    questionName: varchar("question_name", { length: 8 }),
    answer: integer("answer"),
  },
  // composite primary key on (userId, sprintSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.sprintSurveyId] }),
    };
  },
);

export const finalSurvey = pgTable("final_survey", {
  id: integer("final_survey_id").primaryKey(),
  created_at: date("created_at"),
  projectId: integer("project_id").references(() => project.id),
});

export const finalSurveyAnswer = pgTable(
  "final_survey_answer",
  {
    userId: char("user_id", { length: 32 }).references(() => user.id),
    finalSurveyId: integer("final_survey_id").references(() => finalSurvey.id),
    questionName: varchar("question_name", { length: 8 }),
    answer: integer("answer"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.finalSurveyId] }),
    };
  },
);
