"use client";
import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { UserNav } from '@/components/layout/UserNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <div className="hidden md:block w-72 bg-background p-4 space-y-4 border-l border-border">
          <Skeleton className="h-12 w-3/4 bg-muted" />
          <Skeleton className="h-8 w-full bg-muted" />
          <Skeleton className="h-8 w-full bg-muted" />
          <Skeleton className="h-8 w-5/6 bg-muted" />
        </div>
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
            <Skeleton className="h-8 w-8 md:hidden bg-muted" />
            <div className="flex-1" />
            <Skeleton className="h-10 w-32 rounded-full bg-muted" />
          </header>
          <main className="flex-1 p-6">
            <Skeleton className="h-12 w-1/2 mb-6 bg-muted" />
            <Skeleton className="h-64 w-full bg-muted" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[1fr_280px] bg-background text-foreground dir-rtl transition-colors duration-200">
      {/* Main Content Pane */}
      <div className="flex flex-col min-w-0 bg-background">
        {/* Sticky Header Bar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden border-border bg-card text-foreground hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col p-0 w-[280px] bg-background border-border text-foreground">
                <SheetTitle className="sr-only">قائمة التصفح الرئيسية</SheetTitle>
                <SidebarNav />
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="h-3 w-3" /> Vorder ERP Live
              </span>
            </div>
          </div>

          {/* User Nav and Theme Toggle */}
          <UserNav />
        </header>

        {/* Dynamic Page Body */}
        <main className="flex-1 flex flex-col gap-6 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Desktop RTL Right Sidebar - Unified Seamless Background */}
      <div className="hidden border-l border-border bg-background md:block sticky top-0 h-screen overflow-y-auto transition-colors duration-200">
        <SidebarNav />
      </div>
    </div>
  );
}
