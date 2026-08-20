import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, description, className }: MetricCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-card text-card-foreground shadow-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide">{title}</CardTitle>
        {Icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
        {description && (
          <p className="text-[11px] font-semibold text-slate-400 mt-1.5 flex items-center gap-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
