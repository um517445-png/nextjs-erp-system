"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Truck,
  Briefcase,
  Package,
  FileText,
  Warehouse,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as React from 'react';

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, language } = useTranslation();
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>(undefined);

  const isRtl = language === 'ar';

  const mainNavItems = React.useMemo(() => {
    const items = [
      { href: '/dashboard', label: isRtl ? 'لوحة التحليلات المباشرة' : 'Analytics Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/clientes', label: t('clientes.title'), icon: Users },
      { href: '/dashboard/proveedores', label: t('proveedores.title'), icon: Truck },
      { href: '/dashboard/empleados', label: t('employees.title'), icon: Briefcase },
      { href: '/dashboard/productos', label: t('productos.title'), icon: Package },
      { 
        label: t('facturas.title'), 
        icon: FileText,
        subItems: [
          { href: '/dashboard/facturas/ventas', label: isRtl ? 'فواتير المبيعات' : 'Sales Invoices' },
          { href: '/dashboard/facturas/compras', label: isRtl ? 'فواتير المشتريات' : 'Purchase Invoices' },
          { href: '/dashboard/facturas', label: isRtl ? 'جميع الفواتير' : 'All Invoices' },
        ]
      },
      { href: '/dashboard/almacen', label: t('almacen.title'), icon: Warehouse },
    ];

    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      items.push({ href: '/dashboard/notificaciones', label: isRtl ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts', icon: Bell });
    }
    return items;
  }, [user, t, isRtl]);

  React.useEffect(() => {
    const activeParent = mainNavItems.find(item => 
      item.subItems?.some(subItem => pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
    );
    if (activeParent) {
      setOpenAccordion(activeParent.label);
    } else {
      setOpenAccordion(undefined);
    }
  }, [pathname, mainNavItems]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground border-l border-border select-none transition-colors duration-200">
      {/* Brand Header & Logo - Vorder CRM Style */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl tracking-wider">
          V
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-wide text-foreground flex items-center gap-1">
            Vorder <span className="text-amber-500 font-black">ERP</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold tracking-wider">
            {isRtl ? 'نظام المحاسبة والـ ERP الذكي' : 'Smart Accounting & ERP System'}
          </span>
        </div>
      </div>

      {/* Main Menu Links */}
      <nav className="flex-grow px-3 py-4 space-y-1.5 overflow-y-auto">
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion} className="w-full space-y-1">
          {mainNavItems.map((item) =>
            item.subItems ? (
              <AccordionItem value={item.label} key={item.label} className="border-none">
                <AccordionTrigger 
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-muted hover:text-amber-500",
                    item.subItems.some(sub => pathname === sub.href || pathname?.startsWith(sub.href + '/'))
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "text-foreground/80"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-amber-500" />
                    <span>{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn("pt-1 pb-1 space-y-1", isRtl ? "pr-6 pl-2" : "pl-6 pr-2")}>
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href} className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-muted',
                      (pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}>
                      <span>{subItem.label}</span>
                      {isRtl ? (
                        <ChevronLeft className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link key={item.href} href={item.href} className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-muted hover:text-amber-500',
                (pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/dashboard')) || (pathname === '/dashboard' && item.href === '/dashboard')
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs'
                  : 'text-foreground/80'
              )}>
                <item.icon className="h-4 w-4 text-amber-500" />
                <span>{item.label}</span>
              </Link>
            )
          )}
        </Accordion>
      </nav>

      {/* User Info Footer */}
      <div className="p-3 mt-auto border-t border-border bg-card/60">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-background border border-border">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-foreground truncate max-w-[120px]">
              {user?.name || (isRtl ? "المهندس محمد أحمد" : "Eng. Mohamed Ahmed")}
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> SUPER ADMIN
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            title={isRtl ? "تسجيل الخروج" : "Logout"}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
