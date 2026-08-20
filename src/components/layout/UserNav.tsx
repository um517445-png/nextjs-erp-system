"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, UserCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function UserNav() {
  const { user, logout } = useAuth();
  const { t, language } = useTranslation();

  const isRtl = language === 'ar';

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return "??";
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Language Switcher (AR / EN) */}
      <LanguageToggle />

      {/* Theme Toggle Sun/Moon Button */}
      <ThemeToggle />

      {/* User Profile Pill & Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative flex items-center gap-2.5 h-10 px-2 rounded-full border border-border bg-card hover:bg-muted transition-all">
            <Avatar className="h-8 w-8 border border-amber-500/40">
              <AvatarImage src={`https://picsum.photos/seed/${user.email}/40/40`} alt={user.name} />
              <AvatarFallback className="bg-amber-500 text-slate-950 font-bold text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold text-foreground hidden md:inline-block">
              {user.name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2 bg-card border-border text-card-foreground shadow-xl rounded-2xl" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  SUPER ADMIN ⚡
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center gap-2 text-xs font-medium">
                <UserCircle className="h-4 w-4 text-amber-500" />
                <span>{isRtl ? 'الملف الشخصي' : 'User Profile'}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-2 text-xs font-medium">
                <Settings className="h-4 w-4 text-amber-500" />
                <span>{isRtl ? 'إعدادات النظام' : 'System Settings'}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem onClick={logout} className="hover:bg-red-500/10 text-red-500 cursor-pointer">
            <LogOut className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
