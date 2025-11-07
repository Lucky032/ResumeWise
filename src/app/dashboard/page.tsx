import Link from 'next/link';
import {
  ArrowUpRight,
  FileText,
  PlusCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { initialResumeData } from '@/lib/initial-data';
import { format } from 'date-fns';

const mockResumes = [
  { ...initialResumeData, id: '1', title: 'Software Engineer Resume', metadata: { ...initialResumeData.metadata, updatedAt: new Date() } },
  { ...initialResumeData, id: '2', title: 'Product Manager Application', metadata: { ...initialResumeData.metadata, updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } },
  { ...initialResumeData, id: '3', title: 'UX Designer Portfolio', metadata: { ...initialResumeData.metadata, updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } },
  { ...initialResumeData, id: '4', title: 'Data Scientist CV', metadata: { ...initialResumeData.metadata, updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) } },
];

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Resumes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="h-8 gap-1 bg-accent hover:bg-accent/90">
            <Link href={`/resumes/${crypto.randomUUID()}/edit`}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create New Resume
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Resumes</CardTitle>
          <CardDescription>
            Manage your resumes and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Template</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Updated
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResumes.map((resume) => (
                <TableRow key={resume.id}>
                  <TableCell className="font-medium">
                    {resume.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell capitalize">
                    {resume.templateId.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(resume.metadata.updatedAt, 'PPP')}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                       <Link href={`/resumes/${resume.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
