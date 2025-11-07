'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, CheckCircle, Star, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const UPI_ID = '9502657244@ptsbi'; 

const plans = {
  fresher: {
    name: 'Fresher Resume',
    price: 50,
    features: [
      'Perfect for students and recent graduates',
      'ATS-Optimized Template',
      'AI Summary Generator',
      'Single Resume creation',
    ],
  },
  experienced: {
    name: 'Experienced Resume',
    price: 100,
    features: [
      'For professionals with work experience',
      'Advanced ATS Optimization',
      'AI-Powered Bullet Point Enhancement',
      'Create up to 5 Resumes',
    ],
  },
};

type PlanKey = keyof typeof plans;

export default function BillingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const [userData, isUserDataLoading, error] = useDocumentData(userDocRef);

  const initialPlan = searchParams.get('plan') as PlanKey | null;
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(initialPlan || null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const planDetails = useMemo(() => {
    if (!selectedPlan) return null;
    return plans[selectedPlan];
  }, [selectedPlan]);

  const handleUpgrade = async () => {
    if (!user || !userDocRef || !selectedPlan) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in and select a plan to upgrade.',
      });
      return;
    }

    setIsUpgrading(true);
    try {
      // This is a mock payment confirmation.
      // In a real app, you would verify the payment with a backend service.
      updateDocumentNonBlocking(userDocRef, { plan: selectedPlan });

      toast({
        title: 'Upgrade Successful!',
        description: `Welcome! Your ${plans[selectedPlan].name} plan is now active.`,
        className: 'bg-green-500 text-white',
      });

      // Redirect or update UI
      router.push('/dashboard');

    } catch (err: any)      {
      console.error('Upgrade failed', err);
      toast({
        variant: 'destructive',
        title: 'Upgrade Failed',
        description: 'Could not update your plan. Please try again.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };
  
  const isLoading = isUserLoading || isUserDataLoading;
  const currentPlan = userData?.plan;

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

  if (currentPlan && currentPlan !== 'free') {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-center font-headline text-2xl">Your Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                      <h3 className="mt-4 text-xl font-semibold">Thank You!</h3>
                      <p className="text-muted-foreground capitalize">Your <span className='font-bold'>{currentPlan}</span> plan is active.</p>
                      <Button asChild className="mt-4">
                        <Link href="/dashboard">Back to Dashboard</Link>
                      </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center font-headline text-2xl">Choose Your Plan</CardTitle>
          <CardDescription className="text-center">
            Select a plan that fits your needs to create a tailored resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <RadioGroup 
            defaultValue={selectedPlan || undefined} 
            onValueChange={(value: PlanKey) => setSelectedPlan(value)} 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {(Object.keys(plans) as PlanKey[]).map(planKey => {
              const plan = plans[planKey];
              return (
                <Label
                  key={planKey}
                  htmlFor={planKey}
                  className={cn(
                    "border-2 rounded-lg p-4 cursor-pointer transition-all",
                    selectedPlan === planKey ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold font-headline">{plan.name}</h3>
                    <RadioGroupItem value={planKey} id={planKey} className="mt-1"/>
                  </div>
                  <div className="flex items-baseline my-4">
                    <IndianRupee className="h-5 w-5"/>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/one-time</span>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {plan.features.map((feature, i) => (
                       <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                       </li>
                    ))}
                  </ul>
                </Label>
              )
            })}
          </RadioGroup>

          {planDetails && (
              <div className="text-center border-t pt-6 space-y-4">
                <p className="font-semibold">To get your <span className="text-primary">{planDetails.name}</span>, please pay ₹{planDetails.price} via UPI:</p>
                <div className="my-2 select-all rounded-md bg-muted p-2 font-mono text-sm">{UPI_ID}</div>
                <Image
                    src="https://picsum.photos/seed/qr-code/200/200"
                    data-ai-hint="qr code"
                    alt="UPI QR Code"
                    className="mx-auto mt-2 rounded-md"
                    width={150}
                    height={150}
                />
              </div>
          )}

        </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-6">
            <Button onClick={handleUpgrade} disabled={isUpgrading || !selectedPlan} className="w-full bg-accent hover:bg-accent/90">
              {isUpgrading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              I have paid. Activate my plan!
            </Button>
            <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Maybe Later</Link>
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
