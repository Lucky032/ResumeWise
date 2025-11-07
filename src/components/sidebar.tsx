'use client';

import Link from 'next/link';
import {
  FileText,
  Home,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './icons';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';


export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const [userData] = useDocumentData(userDocRef);

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/resumes', icon: FileText, label: 'My Resumes' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isProUser = userData?.subscription === 'pro';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
            <Logo className="h-6 w-6 text-primary" />
            <span className="">ResumeWise</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  {
                    'bg-muted text-primary': pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard'),
                  }
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
        {!isProUser && (
           <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full bg-accent hover:bg-accent/90" asChild>
                  <Link href="/billing">Upgrade</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
    </Sidebar>
  );
}
