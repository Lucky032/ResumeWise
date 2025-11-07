'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDocumentData } from 'react-firebase-hooks/firestore';

const UPI_ID = 'your-upi-id@okhdfcbank'; // Replace with your actual UPI ID

export default function BillingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const [userData, isUserDataLoading, error] = useDocumentData(userDocRef);

  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user || !userDocRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to upgrade.',
      });
      return;
    }

    setIsUpgrading(true);
    try {
      // This is a mock payment confirmation.
      // In a real app, you would verify the payment with a backend service.
      updateDocumentNonBlocking(userDocRef, { subscription: 'pro' });

      toast({
        title: 'Upgrade Successful!',
        description: "Welcome to Pro! You now have access to all features.",
        className: 'bg-green-500 text-white',
      });

      // Redirect or update UI
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Upgrade failed', err);
      toast({
        variant: 'destructive',
        title: 'Upgrade Failed',
        description: 'Could not update your subscription. Please try again.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };
  
  const isLoading = isUserLoading || isUserDataLoading;

  if (isLoading) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error loading user data: {error.message}
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-headline text-2xl">Upgrade to Pro</CardTitle>
          <CardDescription className="text-center">
            {userData?.subscription === 'pro'
              ? 'You are already a Pro member.'
              : 'Unlock premium features and create unlimited resumes.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userData?.subscription === 'pro' ? (
            <div className="text-center p-8 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold">Thank You!</h3>
              <p className="text-muted-foreground">Your Pro membership is active.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="bg-primary/10 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400"/> Pro Plan</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-2 text-sm">
                    <p className='flex items-center'><CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Unlimited Resumes</p>
                    <p className='flex items-center'><CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Premium Templates</p>
                    <p className='flex items-center'><CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Advanced AI Features</p>
                    <p className='flex items-center'><CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Priority Support</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="font-semibold">To upgrade, please pay via UPI:</p>
                <div className="my-2 select-all rounded-md bg-muted p-2 font-mono text-sm">{UPI_ID}</div>
                <img
                    src="https://picsum.photos/seed/qr/200/200"
                    data-ai-hint="qr code"
                    alt="UPI QR Code"
                    className="mx-auto mt-2 rounded-md"
                    width={150}
                    height={150}
                />
              </div>
            </div>
          )}
        </CardContent>
        {userData?.subscription !== 'pro' && (
          <CardFooter className="flex flex-col gap-2">
            <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full bg-accent hover:bg-accent/90">
              {isUpgrading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              I have paid. Upgrade my account!
            </Button>
            <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Maybe Later</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
