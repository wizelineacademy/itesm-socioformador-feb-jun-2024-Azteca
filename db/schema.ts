import {
  boolean,
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["EMPLOYEE", "MANAGER", "ADMIN"]);

export const user = pgTable(
  "_user", //had to rename it because the word 'user' is reserved in postgres
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    email: varchar("email", { length: 64 }).notNull().unique(),
    password: varchar("password", { length: 256 }).notNull(),
    jobTitle: varchar("job_title", { length: 64 }),
    department: varchar("department", { length: 64 }),
    photoUrl: varchar("photo_url", { length: 1024 }),
    role: userRoleEnum("role").notNull(),
    bannerId: varchar("banner_id", { length: 24 })
      .notNull()
      .default("Banner1.svg"),
    primaryColor: varchar("primary_color", { length: 7 })
      .notNull()
      .default("#6640D5"),
    lightMode: boolean("light_mode").default(true),
  },
);

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  managerId: uuid("manager_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }).notNull(),
  sprintSurveyPeriodicityInDays: integer(
    "sprint_survey_periodicity_in_days",
  ).notNull(),
});

export const projectMember = pgTable(
  "project_member",
  {
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    projectId: integer("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    startDate: date("start_date", { mode: "date" }),
    endDate: date("end_date", { mode: "date" }),
  },
  // composite primary key on (userId, projectId)
);

export const skillKindEnum = pgEnum("trait_kind", [
  "STRENGTH",
  "AREA_OF_OPPORTUNITY",
]);

export const userSkill = pgTable(
  "user_skill",
  {
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    skillId: integer("skill_id").references(() => skill.id, {
      onDelete: "cascade",
    }),
    kind: skillKindEnum("kind"),
  },
  // composite primary key on (userId, traitId)
);

export const taskStatusEnum = pgEnum("status", [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
]);

export const pipTask = pgTable("pip_task", {
  id: serial("id").primaryKey(),
  rulerSurveyId: integer("ruler_survey_id").references(
    () => rulerSurveyAnswers.id,
  ),
  sprintSurveyId: integer("sprint_survey_id").references(() => sprintSurvey.id),
  finalSurveyId: integer("final_survey_id").references(() => finalSurvey.id),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 64 }),
  description: varchar("description", { length: 256 }),
  status: taskStatusEnum("status").default("PENDING").notNull(),
});

export type SelectPipTask = typeof pipTask.$inferSelect;

export const pipResourceKind = pgEnum("type_resource", [
  "BOOK",
  "VIDEO",
  "ARTICLE",
]);

export const pipResource = pgTable("pip_resource", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 64 }),
  kind: pipResourceKind("type_resource"),
  description: varchar("description", { length: 1024 }),
  embedding: json("embedding").$type<number[]>(),
});

export type SelectPipResource = typeof pipResource.$inferSelect;

export const userResource = pgTable(
  "user_resource",
  {
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    resourceId: serial("resource_id").references(() => pipResource.id, {
      onDelete: "cascade",
    }),
    rulerSurveyId: integer("ruler_survey_id").references(
      () => rulerSurveyAnswers.id,
    ),
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
    ),
    finalSurveyId: integer("final_survey_id").references(() => finalSurvey.id),
  },
  // composite primary key on (userId, resourceId)
);

// export const quadrantEnum = pgEnum("quadrant", ["1", "2", "3", "4"]);
export const rulerEmotion = pgTable("ruler_emotion", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 16 }),
  pleasantness: integer("pleasantness"),
  energy: integer("energy"),
  description: text("description"),
  embedding: json("embedding").$type<number[]>(),
});

export const rulerSurveyAnswers = pgTable(
  "ruler_survey_answers",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    emotionId: integer("emotion_id").references(() => rulerEmotion.id),
    answeredAt: date("answered_at", { mode: "date" }),
    comment: text("comment"),
    processed: boolean("processed").default(false),
  },
  // composite primary key on (userId, rulerSurveyId)
);

export const questionTypeEnum = pgEnum("type_question", [
  "SPRINT_QUESTION",
  "COWORKER_QUESTION",
  "COWORKER_COMMENT",
  "FINAL_PROJECT_QUESTION",
  "FINAL_PROJECT_COMMENT",
]);

export const question = pgTable("question", {
  id: serial("question_id").primaryKey(),
  description: text("description").notNull(),
  type: questionTypeEnum("type").notNull(),
});

export const skill = pgTable("skill", {
  id: serial("skill_id").primaryKey(),
  positiveSkill: varchar("positive_skill", { length: 30 }),
  negativeSkill: varchar("negative_skill", { length: 30 }),
  positiveDescription: varchar("positive_description", { length: 1024 }),
  negativeDescription: varchar("negative_description", { length: 1024 }),
});

export const questionSkill = pgTable("question_skill", {
  questionId: integer("question_id").references(() => question.id),
  skillId: integer("skill_id").references(() => skill.id),
});

export const pipResourceSkill = pgTable("pip_resource_skill", {
  pipResourceId: integer("pip_resource_id").references(() => pipResource.id),
  skillId: integer("skill_id").references(() => skill.id),
});

export const sprintSurveyQuestion = pgTable("sprint_survey_question", {
  sprintSurveyId: integer("sprint_survey_id").references(() => sprintSurvey.id),
  questionId: integer("question_id").references(() => question.id),
});

export const sprintSurvey = pgTable("sprint_survey", {
  id: serial("sprint_survey_id").primaryKey(),
  projectId: integer("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  scheduledAt: date("scheduled_at", { mode: "date" }),
  processed: boolean("processed").default(false),
  isProcessing: boolean("is_processing").default(false).notNull(),
});

export type SelectSprintSurvey = typeof sprintSurvey.$inferSelect;

export const sprintSurveyAnswerProject = pgTable(
  "sprint_survey_answer_project",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
      { onDelete: "cascade" },
    ),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    questionId: integer("question_id").references(() => question.id),
    answer: integer("answer"),
  },
  // composite primary key on (userId, sprintSurveyId)
);

export const sprintSurveyAnswerCoworkers = pgTable(
  "sprint_survey_answer_coworkers",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
      { onDelete: "cascade" },
    ),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    coworkerId: uuid("coworker_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    questionId: integer("question_id").references(() => question.id),
    answer: integer("answer"),
    comment: text("comment"),
  },
  // composite primary key on (userId, sprintSurveyId)
);

export const finalSurvey = pgTable("final_survey", {
  id: serial("final_survey_id").primaryKey(),
  scheduledAt: date("scheduled_at", { mode: "date" }),
  projectId: integer("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  processed: boolean("processed").default(false),
  isProcessing: boolean("is_processing").default(false).notNull(),
});

export const finalSurveyAnswer = pgTable(
  "final_survey_answer",
  {
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    finalSurveyId: integer("final_survey_id").references(() => finalSurvey.id, {
      onDelete: "cascade",
    }),
    questionId: integer("question_id").references(() => question.id),
    answer: integer("answer"),
    answeredAt: date("answered_at", { mode: "date" }),
    comment: text("comment"),
  },
  // composite primary key on (userId, finalSurveyId)
);