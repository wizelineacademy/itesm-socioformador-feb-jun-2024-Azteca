import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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
  },
);

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  managerId: uuid("manager_id")
    .references(() => user.id)
    .notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  sprintSurveyPeriodicityInDays: integer(
    "sprint_survey_periodicity_in_days",
  ).notNull(),
});

export const projectMember = pgTable(
  "project_member",
  {
    userId: uuid("user_id").references(() => user.id),
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

export const traitKindEnum = pgEnum("trait_kind", [
  "STRENGTH",
  "AREA_OF_OPPORTUNITY",
]);

export const trait = pgTable("trait", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }),
  description: varchar("description", { length: 1024 }),
  kind: traitKindEnum("kind"),
});

export const userTrait = pgTable(
  "user_trait",
  {
    userId: uuid("user_id").references(() => user.id),
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
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => user.id),
  title: varchar("title", { length: 64 }),
  description: varchar("description", { length: 256 }),
  isDone: boolean("is_done"),
});

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
  embedding: text("embedding")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
});

export const userResource = pgTable(
  "user_resource",
  {
    userId: uuid("user_id").references(() => user.id),
    resourceId: serial("resource_id").references(() => pipResource.id),
  },
  // composite primary key on (userId, rulerSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.resourceId] }),
    };
  },
);

export const rulerSurvey = pgTable("ruler_survey", {
  id: serial("id").primaryKey(),
  createdAt: date("created_at"),
});

export const quadrantEnum = pgEnum("quadrant", ["1", "2", "3", "4"]);

export const rulerSurveyAnswers = pgTable(
  "ruler_survey_answers",
  {
    rulerSurveyId: integer("ruler_survey_id").references(() => rulerSurvey.id),
    userId: uuid("user_id").references(() => user.id),
    quadrant: quadrantEnum("quadrant"),
    emotion: varchar("emotion", { length: 16 }),
    createdAt: date("created_at"),
    comment: text("comment"),
  },
  // composite primary key on (userId, rulerSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.rulerSurveyId] }),
    };
  },
);

export const sprintSurvey = pgTable("sprint_survey", {
  id: serial("sprint_survey_id").primaryKey(),
  projectId: integer("project_id").references(() => project.id),
  createdAt: date("created_at"),
});

export const sprintSurveyAnswerProject = pgTable(
  "sprint_survey_answer_project",
  {
    sprintSurveyId: integer("sprint_survey_id").references(
      () => sprintSurvey.id,
    ),
    userId: uuid("user_id").references(() => user.id),
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
    userId: uuid("user_id").references(() => user.id),
    coworkerId: uuid("coworker_id").references(() => user.id),
    questionName: varchar("question_name", { length: 8 }),
    answer: integer("answer"),
    comment: text("comment"),
  },
  // composite primary key on (userId, sprintSurveyId)
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.sprintSurveyId] }),
    };
  },
);

export const finalSurvey = pgTable("final_survey", {
  id: serial("final_survey_id").primaryKey(),
  created_at: date("created_at"),
  projectId: integer("project_id").references(() => project.id),
});

export const finalSurveyAnswer = pgTable(
  "final_survey_answer",
  {
    userId: uuid("user_id").references(() => user.id),
    finalSurveyId: integer("final_survey_id").references(() => finalSurvey.id),
    questionName: varchar("question_name", { length: 8 }),
    answer: integer("answer"),
    comment: text("comment"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.finalSurveyId] }),
    };
  },
);
