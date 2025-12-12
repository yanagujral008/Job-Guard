// src/pages/SavedJobs.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Job = {
  id: string;
  title: string;
  company_name?: string;
  url?: string;
  company_logo?: string;
};

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("savedJobs");
    if (raw) {
      try {
        setSavedJobs(JSON.parse(raw));
      } catch {
        setSavedJobs([]);
      }
    }
  }, []);

  function clearAll() {
    localStorage.removeItem("savedJobs");
    setSavedJobs([]);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">Back Home</Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">No saved jobs yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <a
              key={job.id}
              href={job.url || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
            >
              <img
                src={job.company_logo || "/default-company.png"}
                alt={job.company_name}
                className="w-10 h-10 rounded object-cover"
                onError={(e) => ((e.target as HTMLImageElement).src = "/default-company.png")}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{job.title}</div>
                <div className="text-xs text-gray-500 truncate">{job.company_name}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
