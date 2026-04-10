import { ApplicationStatus } from "@/prisma/generated/prisma/client";

export interface CreateApplicationInput {
    company: string;
    role: string;
  
    location?: string;
    seniority?: string;
  
    requiredSkills?: string[];
    niceToHaveSkills?: string[];
    suggestions?: string[];
  
    jdLink?: string;
    notes?: string;
  
    salaryMin?: number;
    salaryMax?: number;
  }
  
  export type GroupedApplications<T> = {
    [key in ApplicationStatus]: T[];
  };
  