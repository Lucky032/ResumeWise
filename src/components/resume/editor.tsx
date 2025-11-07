'use client';

import type { Resume, WorkExperience, Education } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '../ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import SummaryGenerator from './summary-generator';

interface ResumeEditorProps {
  resumeData: Resume;
  setResumeData: React.Dispatch<React.SetStateAction<Resume>>;
}

export default function ResumeEditor({
  resumeData,
  setResumeData,
}: ResumeEditorProps) {
  const handleContentChange = (
    section: keyof Resume['content'],
    field: string,
    value: any
  ) => {
    setResumeData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          [field]: value,
        },
      },
    }));
  };

  const handleNestedArrayChange = (
    section: 'workExperience' | 'education',
    index: number,
    field: string,
    value: any
  ) => {
    setResumeData((prev) => {
      const newArray = [...prev.content[section]];
      (newArray[index] as any)[field] = value;
      return {
        ...prev,
        content: { ...prev.content, [section]: newArray },
      };
    });
  };

  const addArrayItem = (section: 'workExperience' | 'education') => {
    setResumeData(prev => {
        const newItem = section === 'workExperience' ? 
            { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: [''] } :
            { id: crypto.randomUUID(), degree: '', institution: '', location: '', graduationDate: '' };
        
        return {
            ...prev,
            content: {
                ...prev.content,
                [section]: [...prev.content[section], newItem]
            }
        }
    });
  };

  const removeArrayItem = (section: 'workExperience' | 'education', id: string) => {
      setResumeData(prev => ({
          ...prev,
          content: {
              ...prev.content,
              [section]: prev.content[section].filter(item => (item as any).id !== id)
          }
      }));
  };

  const handleBulletPointChange = (
    expIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    setResumeData(prev => {
        const newWorkExperience = [...prev.content.workExperience];
        newWorkExperience[expIndex].description[bulletIndex] = value;
        return { ...prev, content: { ...prev.content, workExperience: newWorkExperience }};
    });
  };

   const addBulletPoint = (expIndex: number) => {
    setResumeData(prev => {
        const newWorkExperience = [...prev.content.workExperience];
        newWorkExperience[expIndex].description.push('');
        return { ...prev, content: { ...prev.content, workExperience: newWorkExperience }};
    });
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
      setResumeData(prev => {
        const newWorkExperience = [...prev.content.workExperience];
        newWorkExperience[expIndex].description.splice(bulletIndex, 1);
        return { ...prev, content: { ...prev.content, workExperience: newWorkExperience }};
    });
  };

  return (
    <Card className='h-full overflow-y-auto'>
      <CardContent className="p-4">
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Contact Information</AccordionTrigger>
            <AccordionContent className="grid gap-4 p-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={resumeData.content.contactInfo.fullName}
                    onChange={(e) =>
                      handleContentChange(
                        'contactInfo',
                        'fullName',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.content.contactInfo.email}
                    onChange={(e) =>
                      handleContentChange(
                        'contactInfo',
                        'email',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.content.contactInfo.phone}
                    onChange={(e) =>
                      handleContentChange(
                        'contactInfo',
                        'phone',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.content.contactInfo.location}
                    onChange={(e) =>
                      handleContentChange(
                        'contactInfo',
                        'location',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" value={resumeData.content.contactInfo.linkedin} onChange={e => handleContentChange('contactInfo', 'linkedin', e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="portfolio">Portfolio/Website</Label>
                    <Input id="portfolio" value={resumeData.content.contactInfo.portfolio} onChange={e => handleContentChange('contactInfo', 'portfolio', e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Professional Summary</AccordionTrigger>
            <AccordionContent className="grid gap-2 p-1">
              <Textarea
                value={resumeData.content.summary}
                onChange={(e) =>
                  setResumeData(prev => ({...prev, content: {...prev.content, summary: e.target.value}}))
                }
                rows={5}
                placeholder="Write a 2-4 sentence summary of your experience and skills."
              />
              <SummaryGenerator 
                currentSummary={resumeData.content.summary}
                onSummaryGenerated={(summary) => setResumeData(prev => ({...prev, content: {...prev.content, summary}}))}
                jobTitle="Software Engineer"
                yearsOfExperience={5}
                keySkills={resumeData.content.skills.technical.join(', ')}
               />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {resumeData.content.workExperience.map((exp, index) => (
                <Card key={exp.id} className="p-4">
                    <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                            <p className="font-medium">{exp.company || 'New Position'}</p>
                            <Button variant="ghost" size="icon" onClick={() => removeArrayItem('workExperience', exp.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Job Title</Label>
                                <Input value={exp.jobTitle} onChange={e => handleNestedArrayChange('workExperience', index, 'jobTitle', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Company</Label>
                                <Input value={exp.company} onChange={e => handleNestedArrayChange('workExperience', index, 'company', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input placeholder="MM/YYYY" value={exp.startDate} onChange={e => handleNestedArrayChange('workExperience', index, 'startDate', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input placeholder="MM/YYYY or Present" value={exp.endDate} onChange={e => handleNestedArrayChange('workExperience', index, 'endDate', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            {exp.description.map((bullet, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Textarea value={bullet} onChange={e => handleBulletPointChange(index, i, e.target.value)} rows={2} placeholder="Led a project that..."/>
                                    <Button variant="ghost" size="icon" onClick={() => removeBulletPoint(index, i)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground"/>
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => addBulletPoint(index)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Bullet Point
                            </Button>
                        </div>
                    </div>
                </Card>
              ))}
              <Button onClick={() => addArrayItem('workExperience')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Education</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                {resumeData.content.education.map((edu, index) => (
                    <Card key={edu.id} className="p-4">
                        <div className="grid gap-4">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{edu.institution || 'New Institution'}</p>
                                <Button variant="ghost" size="icon" onClick={() => removeArrayItem('education', edu.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Degree</Label>
                                    <Input value={edu.degree} onChange={e => handleNestedArrayChange('education', index, 'degree', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Institution</Label>
                                    <Input value={edu.institution} onChange={e => handleNestedArrayChange('education', index, 'institution', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Graduation Date</Label>
                                    <Input placeholder="MM/YYYY" value={edu.graduationDate} onChange={e => handleNestedArrayChange('education', index, 'graduationDate', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>GPA (Optional)</Label>
                                    <Input type="number" value={edu.gpa} onChange={e => handleNestedArrayChange('education', index, 'gpa', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                <Button onClick={() => addArrayItem('education')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Skills</AccordionTrigger>
            <AccordionContent className="grid gap-4 p-1">
                <div className="grid gap-2">
                  <Label>Technical Skills</Label>
                  <Textarea
                    placeholder="JavaScript, React, Node.js..."
                    value={resumeData.content.skills.technical.join(', ')}
                    onChange={e => handleContentChange('skills', 'technical', e.target.value.split(',').map(s => s.trim()))}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Soft Skills</Label>
                  <Textarea
                    placeholder="Communication, Teamwork, Problem Solving..."
                    value={resumeData.content.skills.soft.join(', ')}
                    onChange={e => handleContentChange('skills', 'soft', e.target.value.split(',').map(s => s.trim()))}
                    rows={3}
                  />
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
