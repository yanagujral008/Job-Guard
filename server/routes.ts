import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        jobType: req.query.jobType ? (req.query.jobType as string).split(',') : undefined,
        experienceLevel: req.query.experienceLevel ? (req.query.experienceLevel as string).split(',') : undefined,
        companySize: req.query.companySize ? (req.query.companySize as string).split(',') : undefined,
        trustScoreMin: req.query.trustScoreMin ? parseInt(req.query.trustScoreMin as string) : undefined,
        status: req.query.status ? (req.query.status as string).split(',') : undefined,
      };

      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      const company = await storage.getCompany(job.companyId);
      res.json({ ...job, company });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Saved jobs routes
  app.get("/api/saved-jobs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const savedJobs = await storage.getSavedJobs(userId);
      res.json(savedJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
  });

  app.post("/api/saved-jobs", async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      
      if (!userId || !jobId) {
        return res.status(400).json({ message: "User ID and Job ID required" });
      }

      const isAlreadySaved = await storage.isJobSaved(userId, jobId);
      if (isAlreadySaved) {
        return res.status(400).json({ message: "Job already saved" });
      }

      const savedJob = await storage.saveJob({ userId, jobId });
      res.json(savedJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to save job" });
    }
  });

  app.delete("/api/saved-jobs", async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      
      if (!userId || !jobId) {
        return res.status(400).json({ message: "User ID and Job ID required" });
      }

      await storage.unsaveJob(userId, jobId);
      res.json({ message: "Job unsaved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave job" });
    }
  });

  // Job reports routes
  app.post("/api/job-reports", async (req, res) => {
    try {
      const validatedData = insertJobReportSchema.parse(req.body);
      const report = await storage.createJobReport(validatedData);
      res.json(report);
    } catch (error) {
      res.status(400).json({ message: "Invalid report data" });
    }
  });

  app.get("/api/job-reports", async (req, res) => {
    try {
      const reports = await storage.getJobReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Companies routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const category = req.query.category as string;
      const courses = await storage.getCourses(category);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Top reporters routes
  app.get("/api/top-reporters", async (req, res) => {
    try {
      const topReporters = await storage.getTopReporters();
      res.json(topReporters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top reporters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
