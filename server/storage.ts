import { type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type SavedJob, type InsertSavedJob, type JobReport, type InsertJobReport, type Course, type InsertCourse, type JobWithCompany } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company methods
  getCompany(id: string): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompanyTrustScore(id: string, trustScore: number): Promise<void>;
  
  // Job methods
  getJob(id: string): Promise<Job | undefined>;
  getJobs(filters?: {
    search?: string;
    location?: string;
    jobType?: string[];
    experienceLevel?: string[];
    companySize?: string[];
    trustScoreMin?: number;
    status?: string[];
  }): Promise<JobWithCompany[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJobStatus(id: string, status: string): Promise<void>;
  incrementJobReports(id: string): Promise<void>;
  
  // Saved jobs methods
  getSavedJobs(userId: string): Promise<JobWithCompany[]>;
  saveJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  unsaveJob(userId: string, jobId: string): Promise<void>;
  isJobSaved(userId: string, jobId: string): Promise<boolean>;
  
  // Job report methods
  getJobReports(): Promise<JobReport[]>;
  createJobReport(report: InsertJobReport): Promise<JobReport>;
  getTopReporters(): Promise<{ userId: string; username: string; reportCount: number }[]>;
  
  // Course methods
  getCourses(category?: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Stats methods
  getStats(): Promise<{
    totalJobs: number;
    verifiedCompanies: number;
    fakeJobsDetected: number;
    successRate: number;
    weeklyStats: {
      jobsVerified: number;
      fakeJobsDetected: number;
      newCompanies: number;
    };
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private companies: Map<string, Company>;
  private jobs: Map<string, Job>;
  private savedJobs: Map<string, SavedJob>;
  private jobReports: Map<string, JobReport>;
  private courses: Map<string, Course>;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.jobs = new Map();
    this.savedJobs = new Map();
    this.jobReports = new Map();
    this.courses = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create sample companies
    const google: Company = {
      id: randomUUID(),
      name: "Google",
      logo: "fab fa-google",
      description: "Search engine and technology company",
      website: "https://google.com",
      size: "large",
      rating: "4.8",
      trustScore: 98,
      verifiedJobs: 245,
      reportedJobs: 2,
      createdAt: new Date(),
    };
    
    const microsoft: Company = {
      id: randomUUID(),
      name: "Microsoft",
      logo: "fab fa-microsoft",
      description: "Technology corporation",
      website: "https://microsoft.com",
      size: "large",
      rating: "4.6",
      trustScore: 95,
      verifiedJobs: 189,
      reportedJobs: 1,
      createdAt: new Date(),
    };
    
    const techCorp: Company = {
      id: randomUUID(),
      name: "TechCorp Solutions",
      logo: "fas fa-building",
      description: "Software development company",
      website: "https://techcorp.com",
      size: "medium",
      rating: "3.2",
      trustScore: 62,
      verifiedJobs: 12,
      reportedJobs: 8,
      createdAt: new Date(),
    };

    this.companies.set(google.id, google);
    this.companies.set(microsoft.id, microsoft);
    this.companies.set(techCorp.id, techCorp);

    // Create sample jobs
    const jobs: Job[] = [
      {
        id: randomUUID(),
        title: "Senior Frontend Developer",
        description: "We're looking for a passionate Senior Frontend Developer to join our growing team. You'll work on cutting-edge projects using React, TypeScript, and modern web technologies.",
        companyId: google.id,
        location: "San Francisco, CA",
        salary: "$120k - $160k",
        jobType: "remote",
        experienceLevel: "senior",
        skills: ["React", "TypeScript", "Node.js"],
        status: "verified",
        reportCount: 0,
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        externalUrl: "https://careers.google.com/jobs/1",
      },
      {
        id: randomUUID(),
        title: "Data Scientist",
        description: "Join our Data Science team to work on machine learning models and analytics that impact millions of users worldwide. Looking for someone with strong Python and ML experience.",
        companyId: microsoft.id,
        location: "Seattle, WA",
        salary: "$130k - $170k",
        jobType: "full-time",
        experienceLevel: "mid",
        skills: ["Python", "ML", "TensorFlow"],
        status: "pending",
        reportCount: 0,
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        externalUrl: "https://careers.microsoft.com/jobs/1",
      },
      {
        id: randomUUID(),
        title: "Marketing Manager",
        description: "Excellent opportunity for marketing manager. High salary, immediate start. Contact us directly for fast hiring process.",
        companyId: techCorp.id,
        location: "New York, NY",
        salary: "$90k - $110k",
        jobType: "full-time",
        experienceLevel: "mid",
        skills: ["Digital Marketing", "SEO"],
        status: "suspicious",
        reportCount: 3,
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        externalUrl: "https://techcorp.com/jobs/1",
      },
    ];

    jobs.forEach(job => this.jobs.set(job.id, job));

    // Create sample courses
    const courses: Course[] = [
      {
        id: randomUUID(),
        title: "React Masterclass",
        description: "Learn modern React development from scratch",
        thumbnail: "fas fa-code",
        category: "web-dev",
        price: "0.00",
        isFree: true,
        rating: "4.8",
        instructor: "John Smith",
        duration: "40 hours",
        tags: ["React", "JavaScript", "Frontend"],
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Data Science Bootcamp",
        description: "Python, ML, and data analysis",
        thumbnail: "fas fa-chart-bar",
        category: "data-science",
        price: "299.00",
        isFree: false,
        rating: "4.9",
        instructor: "Sarah Johnson",
        duration: "120 hours",
        tags: ["Python", "Machine Learning", "Data Analysis"],
        createdAt: new Date(),
      },
    ];

    courses.forEach(course => this.courses.set(course.id, course));

    // Create sample user
    const user: User = {
      id: randomUUID(),
      username: "johndoe",
      password: "password",
      email: "john@example.com",
      avatar: null,
      createdAt: new Date(),
    };
    
    this.users.set(user.id, user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = {
      ...insertCompany,
      id,
      trustScore: 85,
      verifiedJobs: 0,
      reportedJobs: 0,
      createdAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompanyTrustScore(id: string, trustScore: number): Promise<void> {
    const company = this.companies.get(id);
    if (company) {
      company.trustScore = trustScore;
      this.companies.set(id, company);
    }
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(filters?: {
    search?: string;
    location?: string;
    jobType?: string[];
    experienceLevel?: string[];
    companySize?: string[];
    trustScoreMin?: number;
    status?: string[];
  }): Promise<JobWithCompany[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchLower)))
        );
      }

      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        jobs = jobs.filter(job => job.location.toLowerCase().includes(locationLower));
      }

      if (filters.jobType && filters.jobType.length > 0) {
        jobs = jobs.filter(job => filters.jobType!.includes(job.jobType));
      }

      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        jobs = jobs.filter(job => filters.experienceLevel!.includes(job.experienceLevel));
      }

      if (filters.status && filters.status.length > 0) {
        jobs = jobs.filter(job => filters.status!.includes(job.status || "pending"));
      }

      if (filters.trustScoreMin) {
        jobs = jobs.filter(job => {
          const company = this.companies.get(job.companyId);
          return company && company.trustScore >= filters.trustScoreMin!;
        });
      }

      if (filters.companySize && filters.companySize.length > 0) {
        jobs = jobs.filter(job => {
          const company = this.companies.get(job.companyId);
          return company && filters.companySize!.includes(company.size || "");
        });
      }
    }

    return jobs.map(job => ({
      ...job,
      company: this.companies.get(job.companyId)!,
    })).sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      ...insertJob,
      id,
      status: "pending",
      reportCount: 0,
      postedAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJobStatus(id: string, status: string): Promise<void> {
    const job = this.jobs.get(id);
    if (job) {
      job.status = status;
      this.jobs.set(id, job);
    }
  }

  async incrementJobReports(id: string): Promise<void> {
    const job = this.jobs.get(id);
    if (job) {
      job.reportCount = (job.reportCount || 0) + 1;
      this.jobs.set(id, job);
    }
  }

  async getSavedJobs(userId: string): Promise<JobWithCompany[]> {
    const userSavedJobs = Array.from(this.savedJobs.values())
      .filter(saved => saved.userId === userId);
    
    return userSavedJobs
      .map(saved => {
        const job = this.jobs.get(saved.jobId);
        const company = job ? this.companies.get(job.companyId) : undefined;
        return job && company ? { ...job, company } : null;
      })
      .filter(Boolean) as JobWithCompany[];
  }

  async saveJob(insertSavedJob: InsertSavedJob): Promise<SavedJob> {
    const id = randomUUID();
    const savedJob: SavedJob = {
      ...insertSavedJob,
      id,
      savedAt: new Date(),
    };
    this.savedJobs.set(id, savedJob);
    return savedJob;
  }

  async unsaveJob(userId: string, jobId: string): Promise<void> {
    const savedJob = Array.from(this.savedJobs.values())
      .find(saved => saved.userId === userId && saved.jobId === jobId);
    
    if (savedJob) {
      this.savedJobs.delete(savedJob.id);
    }
  }

  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    return Array.from(this.savedJobs.values())
      .some(saved => saved.userId === userId && saved.jobId === jobId);
  }

  async getJobReports(): Promise<JobReport[]> {
    return Array.from(this.jobReports.values());
  }

  async createJobReport(insertReport: InsertJobReport): Promise<JobReport> {
    const id = randomUUID();
    const report: JobReport = {
      ...insertReport,
      id,
      status: "pending",
      reportedAt: new Date(),
    };
    this.jobReports.set(id, report);
    await this.incrementJobReports(insertReport.jobId);
    return report;
  }

  async getTopReporters(): Promise<{ userId: string; username: string; reportCount: number }[]> {
    const reportCounts = new Map<string, number>();
    
    Array.from(this.jobReports.values()).forEach(report => {
      const current = reportCounts.get(report.reporterId) || 0;
      reportCounts.set(report.reporterId, current + 1);
    });

    const topReporters = Array.from(reportCounts.entries())
      .map(([userId, reportCount]) => ({
        userId,
        username: this.users.get(userId)?.username || "Unknown",
        reportCount,
      }))
      .sort((a, b) => b.reportCount - a.reportCount)
      .slice(0, 10);

    // Add some sample data if empty
    if (topReporters.length === 0) {
      return [
        { userId: "1", username: "Sarah Chen", reportCount: 23 },
        { userId: "2", username: "Mike Johnson", reportCount: 18 },
        { userId: "3", username: "Alex Rivera", reportCount: 15 },
      ];
    }

    return topReporters;
  }

  async getCourses(category?: string): Promise<Course[]> {
    let courses = Array.from(this.courses.values());
    
    if (category) {
      courses = courses.filter(course => course.category === category);
    }
    
    return courses.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async getStats(): Promise<{
    totalJobs: number;
    verifiedCompanies: number;
    fakeJobsDetected: number;
    successRate: number;
    weeklyStats: {
      jobsVerified: number;
      fakeJobsDetected: number;
      newCompanies: number;
    };
  }> {
    const totalJobs = this.jobs.size;
    const verifiedCompanies = Array.from(this.companies.values())
      .filter(company => company.trustScore >= 90).length;
    const fakeJobsDetected = Array.from(this.jobs.values())
      .filter(job => job.status === "suspicious" || job.status === "fake").length;
    const successRate = totalJobs > 0 ? ((totalJobs - fakeJobsDetected) / totalJobs) * 100 : 100;

    return {
      totalJobs,
      verifiedCompanies,
      fakeJobsDetected,
      successRate: Math.round(successRate * 10) / 10,
      weeklyStats: {
        jobsVerified: 156,
        fakeJobsDetected: 8,
        newCompanies: 34,
      },
    };
  }
}

export const storage = new MemStorage();
