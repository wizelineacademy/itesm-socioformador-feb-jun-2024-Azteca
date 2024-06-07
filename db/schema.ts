import {
  pgTable,
  pgEnum,
  serial,
  text,
  foreignKey,
  integer,
  boolean,
  date,
  uuid,
  varchar,
  json,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("role", ["ADMIN", "MANAGER", "EMPLOYEE"]);
export const quadrant = pgEnum("quadrant", ["4", "3", "2", "1"]);
export const kind = pgEnum("kind", ["AREA_OF_OPPORTUNITY", "STRENGTH"]);
export const typeQuestion = pgEnum("type_question", [
  "FINAL_PROJECT_COMMENT",
  "COWORKER_COMMENT",
  "FINAL_PROJECT_QUESTION",
  "COWORKER_QUESTION",
  "SPRINT_QUESTION",
]);
export const status = pgEnum("status", ["DONE", "IN_PROGRESS", "PENDING"]);
export const typeResource = pgEnum("type_resource", [
  "ARTICLE",
  "VIDEO",
  "BOOK",
]);
export const traitKind = pgEnum("trait_kind", [
  "AREA_OF_OPPORTUNITY",
  "STRENGTH",
]);

export const question = pgTable("question", {
  questionId: serial("question_id").primaryKey().notNull(),
  description: text("description").notNull(),
  type: typeQuestion("type").notNull(),
});

export const finalSurvey = pgTable("final_survey", {
  finalSurveyId: serial("final_survey_id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  processed: boolean("processed").default(false),
  scheduledAt: date("scheduled_at"),
  isProcessing: boolean("is_processing").default(false).notNull(),
});

export const userSkill = pgTable("user_skill", {
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  skillId: integer("skill_id").references(() => skill.skillId, {
    onDelete: "cascade",
  }),
  kind: traitKind("kind"),
});

export const questionSkill = pgTable("question_skill", {
  questionId: integer("question_id").references(() => question.questionId),
  skillId: integer("skill_id").references(() => skill.skillId),
});

export const sprintSurveyQuestion = pgTable("sprint_survey_question", {
  sprintSurveyId: integer("sprint_survey_id").references(
    () => sprintSurvey.sprintSurveyId,
  ),
  questionId: integer("question_id").references(() => question.questionId),
});

export const pipResourceSkill = pgTable("pip_resource_skill", {
  pipResourceId: integer("pip_resource_id").references(() => pipResource.id),
  skillId: integer("skill_id").references(() => skill.skillId),
});

export const user = pgTable("_user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  jobTitle: varchar("job_title", { length: 64 }),
  department: varchar("department", { length: 64 }),
  photoUrl: varchar("photo_url", { length: 1024 }),
  role: role("role").notNull(),
  bannerId: varchar("banner_id", { length: 24 })
    .default("Banner1.svg")
    .notNull(),
  primaryColor: varchar("primary_color", { length: 7 })
    .default("#6640D5")
    .notNull(),
  lightMode: boolean("light_mode").default(true),
});

export const sprintSurveyAnswerCoworkers = pgTable(
  "sprint_survey_answer_coworkers",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.sprintSurveyId,
      { onDelete: "cascade" },
    ),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    coworkerId: uuid("coworker_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    answer: integer("answer"),
    comment: text("comment"),
    questionId: integer("question_id").references(() => question.questionId),
  },
);

export const pipResource = pgTable("pip_resource", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 64 }),
  typeResource: typeResource("type_resource"),
  description: varchar("description", { length: 1024 }),
  embedding: json("embedding"),
});

export const rulerEmotion = pgTable("ruler_emotion", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name", { length: 16 }),
  description: text("description"),
  embedding: json("embedding"),
  pleasantness: integer("pleasantness"),
  energy: integer("energy"),
});

export const sprintSurveyAnswerProject = pgTable(
  "sprint_survey_answer_project",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.sprintSurveyId,
      { onDelete: "cascade" },
    ),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    answer: integer("answer"),
    questionId: integer("question_id").references(() => question.questionId),
  },
);

export const project = pgTable("project", {
  id: serial("id").primaryKey().notNull(),
  managerId: uuid("manager_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 64 }).notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  sprintSurveyPeriodicityInDays: integer(
    "sprint_survey_periodicity_in_days",
  ).notNull(),
});

export const projectMember = pgTable("project_member", {
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const userResource = pgTable("user_resource", {
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  resourceId: serial("resource_id")
    .notNull()
    .references(() => pipResource.id, { onDelete: "cascade" }),
  sprintSurveyId: integer("sprint_survey_id").references(
    () => sprintSurvey.sprintSurveyId,
  ),
  finalSurveyId: integer("final_survey_id").references(
    () => finalSurvey.finalSurveyId,
  ),
  rulerSurveyId: integer("ruler_survey_id").references(
    () => rulerSurveyAnswers.id,
  ),
});

export const sprintSurvey = pgTable("sprint_survey", {
  sprintSurveyId: serial("sprint_survey_id").primaryKey().notNull(),
  projectId: integer("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  processed: boolean("processed").default(false),
  scheduledAt: date("scheduled_at"),
  isProcessing: boolean("is_processing").default(false).notNull(),
});

export const pipTask = pgTable("pip_task", {
  id: serial("id").primaryKey().notNull(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 64 }),
  description: varchar("description", { length: 256 }),
  sprintSurveyId: integer("sprint_survey_id").references(
    () => sprintSurvey.sprintSurveyId,
  ),
  status: status("status").default("PENDING").notNull(),
  finalSurveyId: integer("final_survey_id").references(
    () => finalSurvey.finalSurveyId,
  ),
  rulerSurveyId: integer("ruler_survey_id").references(
    () => rulerSurveyAnswers.id,
  ),
});

export const finalSurveyAnswer = pgTable("final_survey_answer", {
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  finalSurveyId: integer("final_survey_id").references(
    () => finalSurvey.finalSurveyId,
    { onDelete: "cascade" },
  ),
  answer: integer("answer"),
  comment: text("comment"),
  questionId: integer("question_id").references(() => question.questionId),
  answeredAt: date("answered_at"),
});

export const skill = pgTable("skill", {
  skillId: serial("skill_id").primaryKey().notNull(),
  positiveSkill: varchar("positive_skill", { length: 30 }),
  negativeSkill: varchar("negative_skill", { length: 30 }),
  positiveDescription: varchar("positive_description", { length: 1024 }),
  negativeDescription: varchar("negative_description", { length: 1024 }),
});

export const rulerSurveyAnswers = pgTable("ruler_survey_answers", {
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  answeredAt: date("answered_at"),
  comment: text("comment"),
  emotionId: integer("emotion_id").references(() => rulerEmotion.id),
  processed: boolean("processed").default(false),
  id: serial("id").primaryKey().notNull(),
});
