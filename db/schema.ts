import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["employee", "manager"]);

export const user = pgTable("user", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 32 }),
  email: varchar("email", { length: 32 }),
  jobTitle: varchar("job_title", { length: 32 }),
  department: varchar("department", { length: 32 }),
  photoUrl: varchar("photo_url", { length: 32 }),
  role: userRoleEnum("role"),
});

export const project = pgTable("project", {
  id: integer("id").primaryKey(),
  managerId: integer("manager_id").references(() => user.id),
  name: varchar("name", { length: 32 }),
  description: varchar("description", { length: 256 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  sprintSurveyPeriodicity: integer("sprint_survey_periodicity"),
});

export const projectMember = pgTable(
  "project_member",
  {
    userId: integer("user_id").references(() => user.id),
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

export const traitKindEnum = pgEnum("kind", ["employee", "manager"]);

export const trait = pgTable("trait", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 32 }),
  description: varchar("description", { length: 256 }),
  kind: traitKindEnum("kind"),
});

export const userTrait = pgTable(
  "user_trait",
  {
    userId: integer("user_id").references(() => user.id),
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
  userId: integer("user_id").references(() => user.id),
  title: varchar("title", { length: 32 }),
  description: varchar("description", { length: 256 }),
  isDone: boolean("is_done"),
});

export const pipResource = pgTable("pip_resource", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => user.id),
  title: varchar("title", { length: 32 }),
  description: varchar("description", { length: 256 }),
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
    userId: integer("user_id").references(() => user.id),
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
