DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('EMPLOYEE', 'MANAGER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "quadrant" AS ENUM('1', '2', '3', '4');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "kind" AS ENUM('STRENGTH', 'AREA_OF_OPPORTUNITY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "final_survey" (
	"final_survey_id" serial PRIMARY KEY NOT NULL,
	"created_at" date,
	"project_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "final_survey_answer" (
	"user_id" uuid,
	"final_survey_id" integer,
	"question_name" varchar(8),
	"answer" integer,
	CONSTRAINT "final_survey_answer_user_id_final_survey_id_pk" PRIMARY KEY("user_id","final_survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pip_resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(64),
	"kind" "role",
	"description" varchar(1024),
	"embedding" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pip_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"title" varchar(64),
	"description" varchar(256),
	"is_done" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"manager_id" uuid NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"sprint_survey_periodicity_in_days" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_member" (
	"user_id" uuid,
	"project_id" integer,
	"start_date" date,
	"end_date" date,
	CONSTRAINT "project_member_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ruler_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ruler_survey_answers" (
	"ruler_survey_id" integer,
	"user_id" uuid,
	"quadrant" "quadrant",
	"emotion" varchar(16),
	"created_at" date,
	CONSTRAINT "ruler_survey_answers_user_id_ruler_survey_id_pk" PRIMARY KEY("user_id","ruler_survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sprint_survey" (
	"sprint_survey_id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"created_at" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sprint_survey_answer_coworkers" (
	"sprint_survey_id" integer,
	"user_id" uuid,
	"coworker_id" integer,
	"question_name" varchar(8),
	"answer" integer,
	CONSTRAINT "sprint_survey_answer_coworkers_user_id_sprint_survey_id_pk" PRIMARY KEY("user_id","sprint_survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sprint_survey_answer_project" (
	"sprint_survey_id" integer,
	"user_id" uuid,
	"question_name" varchar(8),
	"answer" integer,
	CONSTRAINT "sprint_survey_answer_project_user_id_sprint_survey_id_pk" PRIMARY KEY("user_id","sprint_survey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trait" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64),
	"description" varchar(1024),
	"kind" "kind"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(256) NOT NULL,
	"job_title" varchar(64),
	"department" varchar(64),
	"photo_url" varchar(1024),
	"role" "role" NOT NULL,
	CONSTRAINT "_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_resource" (
	"user_id" uuid,
	"resource_id" serial NOT NULL,
	CONSTRAINT "user_resource_user_id_resource_id_pk" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_trait" (
	"user_id" uuid,
	"trait_id" integer,
	CONSTRAINT "user_trait_user_id_trait_id_pk" PRIMARY KEY("user_id","trait_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "final_survey" ADD CONSTRAINT "final_survey_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "final_survey_answer" ADD CONSTRAINT "final_survey_answer_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "final_survey_answer" ADD CONSTRAINT "final_survey_answer_final_survey_id_final_survey_final_survey_id_fk" FOREIGN KEY ("final_survey_id") REFERENCES "final_survey"("final_survey_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pip_task" ADD CONSTRAINT "pip_task_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_manager_id__user_id_fk" FOREIGN KEY ("manager_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_member" ADD CONSTRAINT "project_member_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ruler_survey_answers" ADD CONSTRAINT "ruler_survey_answers_ruler_survey_id_ruler_survey_id_fk" FOREIGN KEY ("ruler_survey_id") REFERENCES "ruler_survey"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ruler_survey_answers" ADD CONSTRAINT "ruler_survey_answers_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sprint_survey" ADD CONSTRAINT "sprint_survey_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sprint_survey_answer_coworkers" ADD CONSTRAINT "sprint_survey_answer_coworkers_sprint_survey_id_sprint_survey_sprint_survey_id_fk" FOREIGN KEY ("sprint_survey_id") REFERENCES "sprint_survey"("sprint_survey_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sprint_survey_answer_coworkers" ADD CONSTRAINT "sprint_survey_answer_coworkers_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sprint_survey_answer_project" ADD CONSTRAINT "sprint_survey_answer_project_sprint_survey_id_sprint_survey_sprint_survey_id_fk" FOREIGN KEY ("sprint_survey_id") REFERENCES "sprint_survey"("sprint_survey_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sprint_survey_answer_project" ADD CONSTRAINT "sprint_survey_answer_project_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_resource" ADD CONSTRAINT "user_resource_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_resource" ADD CONSTRAINT "user_resource_resource_id_pip_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "pip_resource"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_trait" ADD CONSTRAINT "user_trait_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_trait" ADD CONSTRAINT "user_trait_trait_id_trait_id_fk" FOREIGN KEY ("trait_id") REFERENCES "trait"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
