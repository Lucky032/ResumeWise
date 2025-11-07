'use client';

import type { Resume } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  MapPin,
} from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const { content, design } = resume;
  const {
    contactInfo,
    summary,
    workExperience,
    education,
    skills,
  } = content;
  
  // A simple mapping for now. In a real app, this would involve more complex CSS.
  const templateClasses = {
    modern_clean: "grid grid-cols-3 gap-8",
    professional: "flex flex-col gap-6",
    creative: "grid grid-cols-4 gap-6",
    minimal: "flex flex-col gap-4",
    executive: "grid grid-cols-3 gap-8",
  };

  const selectedLayout = resume.templateId as keyof typeof templateClasses;
  const isTwoColumn = selectedLayout === 'modern_clean' || selectedLayout === 'creative' || selectedLayout === 'executive';

  const MainContent = () => (
    <div className={cn("space-y-6", isTwoColumn ? "col-span-2" : "")}>
        <section>
          <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2 font-headline">
            Professional Summary
          </h2>
          <p className="text-sm">{summary}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2 font-headline">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{exp.jobTitle}</h3>
                    <div className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-sm italic">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.location}</p>
                </div>
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
    </div>
  );

  const SidebarContent = () => (
     <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2 font-headline">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm italic">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.graduationDate}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary border-b-2 border-primary pb-1 mb-2 font-headline">
            Skills
          </h2>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm">Technical</h4>
              <p className="text-sm">{skills.technical.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Soft</h4>
              <p className="text-sm">{skills.soft.join(', ')}</p>
            </div>
          </div>
        </section>
     </div>
  )

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-0 h-full">
        <div className="bg-gray-200 dark:bg-gray-800 p-4 sm:p-8 h-full overflow-y-auto">
          <div
            className="bg-white dark:bg-gray-900 shadow-lg p-6 sm:p-8 aspect-[8.5/11] w-full max-w-4xl mx-auto"
            style={{
              // @ts-ignore
              '--primary-color': design.primaryColor,
            }}
          >
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">
                {contactInfo.fullName}
              </h1>
              <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contactInfo.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{contactInfo.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{contactInfo.location}</span>
                <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{contactInfo.linkedin}</span>
                <span className="flex items-center gap-1"><Github className="h-3 w-3" />{contactInfo.github}</span>
              </div>
            </header>

            <Separator className="my-4" />
            
            <div className={cn("text-sm", isTwoColumn ? templateClasses[selectedLayout] : "flex flex-col gap-6")}>
              {isTwoColumn ? (
                <>
                  <SidebarContent />
                  <MainContent />
                </>
              ) : (
                 <>
                  <MainContent />
                  <SidebarContent />
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
