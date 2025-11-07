export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: 'free' | 'pro';
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    defaultTemplate: string;
    defaultTheme: string;
    language: string;
  };
};

export type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
};

export type WorkExperience = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string[];
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: number;
  coursework?: string[];
};

export type Skills = {
  technical: string[];
  soft: string[];
  categories: {
    [category: string]: string[];
  };
};

export type Resume = {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: {
    contactInfo: ContactInfo;
    summary: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skills;
  };
  design: {
    primaryColor: string;
    fontFamily: string;
    fontSize: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
};

export type Template = {
  id: string;
  name: string;
  category: string;
  layout: 'single-column' | 'two-column';
  previewImageUrl: string;
  isPremium: boolean;
};
