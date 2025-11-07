'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  Download,
  Share2,
  Sparkles,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { Resume } from '@/lib/types';
import { initialResumeData, initialTemplates } from '@/lib/initial-data';
import ResumeEditor from '@/components/resume/editor';
import ResumePreview from '@/components/resume/preview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AtsChecker from '@/components/resume/ats-checker';
import { toast } from '@/hooks/use-toast';

export default function ResumeEditPage({ params }: { params: { id: string } }) {
  const [resumeData, setResumeData] = useState<Resume>(initialResumeData);

  const handleTemplateChange = (templateId: string) => {
    setResumeData((prev) => ({ ...prev, templateId }));
  };

  const handleDownloadPdf = () => {
    toast({
        title: "PDF Export",
        description: "PDF generation is a future feature. Stay tuned!",
    });
  }

  const handleShare = () => {
    toast({
        title: "Sharing",
        description: "Sharing functionality is coming soon!",
    });
  }


  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          {resumeData.title}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Select
            value={resumeData.templateId}
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {initialTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AtsChecker resumeText={JSON.stringify(resumeData.content)} />
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 flex-1">
        <div className="lg:col-span-3">
            <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
        </div>
        <div className="lg:col-span-4">
            <ResumePreview resume={resumeData} />
        </div>
      </div>
    </div>
  );
}
