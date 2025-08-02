import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"),
  description: text("description"),
  website: text("website"),
  size: text("size"), // "startup", "medium", "large"
  rating: decimal("rating", { precision: 3, scale: 2 }),
  trustScore: integer("trust_score").default(85),
  verifiedJobs: integer("verified_jobs").default(0),
  reportedJobs: integer("reported_jobs").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  companyId: varchar("company_id").references(() => companies.id).notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  jobType: text("job_type").notNull(), // "full-time", "part-time", "remote", "internship"
  experienceLevel: text("experience_level").notNull(), // "entry", "mid", "senior"
  skills: text("skills").array(),
  status: text("status").default("pending"), // "verified", "suspicious", "pending", "fake"
  reportCount: integer("report_count").default(0),
  postedAt: timestamp("posted_at").defaultNow(),
  externalUrl: text("external_url"),
});

export const savedJobs = pgTable("saved_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const jobReports = pgTable("job_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  reporterId: varchar("reporter_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  evidence: text("evidence").array(),
  status: text("status").default("pending"), // "pending", "verified", "dismissed"
  reportedAt: timestamp("reported_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  category: text("category").notNull(), // "web-dev", "data-science", "cybersecurity", etc.
  price: decimal("price", { precision: 10, scale: 2 }),
  isFree: boolean("is_free").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  instructor: text("instructor"),
  duration: text("duration"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  trustScore: true,
  verifiedJobs: true,
  reportedJobs: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
  reportCount: true,
  status: true,
});

export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  savedAt: true,
});

export const insertJobReportSchema = createInsertSchema(jobReports).omit({
  id: true,
  reportedAt: true,
  status: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;
export type JobReport = typeof jobReports.$inferSelect;
export type InsertJobReport = z.infer<typeof insertJobReportSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type JobWithCompany = Job & { company: Company };
export type JobReportWithDetails = JobReport & { job: Job; reporter: User };
