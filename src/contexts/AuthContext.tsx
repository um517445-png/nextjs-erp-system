"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getEmpleadoByEmail, addEmpleado as addUserToMockData, updateEmpleado as updateEmpleadoInMockData } from '@/lib/mockData';
import type { Empleado, EmpleadoRole } from '@/types';
import { useTranslation } from '@/hooks/useTranslation'; 

interface User {
  id: string;
  name: string;
  email: string;
  role: EmpleadoRole;
  lastLogin?: string; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
  updateUserInContext: (updatedUserFields: Partial<User>) => void;
}

const DEFAULT_SUPER_ADMIN: User = {
  id: 'EMP001',
  name: 'المهندس محمد أحمد',
  email: 'mohamed.ahmed@vorder.com',
  role: 'admin',
  lastLogin: '2026-08-20T12:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always default to Super Admin logged in instantly (Auth Bypass Enabled)
  const [user, setUser] = useState<User | null>(DEFAULT_SUPER_ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation(); 

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('erpUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if ((parsedUser.role as string) === 'Administrador') {
          parsedUser.role = 'admin';
        }
        setUser(parsedUser);
      } else {
        localStorage.setItem('erpUser', JSON.stringify(DEFAULT_SUPER_ADMIN));
        setUser(DEFAULT_SUPER_ADMIN);
      }
    } catch {
      setUser(DEFAULT_SUPER_ADMIN);
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const updateUserInContext = useCallback((updatedUserFields: Partial<User>) => {
    setUser(prevUser => {
      const activeUser = prevUser || DEFAULT_SUPER_ADMIN;
      const newUser = { ...activeUser, ...updatedUserFields };
      try {
        localStorage.setItem('erpUser', JSON.stringify(newUser));
      } catch {}
      return newUser;
    });
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const targetEmpleado: Empleado | undefined = await getEmpleadoByEmail(email);

    if (targetEmpleado) {
      if (targetEmpleado.password && password !== targetEmpleado.password) {
        setIsLoading(false);
        return { success: false, message: t('loginPage.loginFailed') };
      }
      
      if (targetEmpleado.isBlocked) {
        setIsLoading(false);
        return { success: false, message: t('loginPage.userBlocked') };
      }
      
      const lastLoginTime = new Date().toISOString();
      const userData: User = { 
        id: targetEmpleado.id, 
        name: targetEmpleado.nombre, 
        email: targetEmpleado.email,
        role: targetEmpleado.role,
        lastLogin: lastLoginTime,
      };
      try {
        localStorage.setItem('erpUser', JSON.stringify(userData));
        await updateEmpleadoInMockData(targetEmpleado.id, { lastLogin: lastLoginTime }, targetEmpleado.id, t, true);
      } catch {}
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push('/dashboard'); 
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, message: t('loginPage.loginFailed') };
    }
  }, [router, t]);

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.removeItem('erpUser');
    } catch {}
    setUser(DEFAULT_SUPER_ADMIN);
    setIsAuthenticated(true);
    setIsLoading(false);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const existingUser = await getEmpleadoByEmail(email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, message: t('registerPage.emailExistsError') };
    }
    
    const newEmpleadoData: Partial<Empleado> = { 
      nombre: name, 
      email, 
      password, 
      bio: '', 
      emailNotifications: true,
      lastLogin: new Date().toISOString() 
    };
    
    const newEmpleado = await addUserToMockData(newEmpleadoData as Omit<Empleado, 'id' | 'isBlocked' | 'role' | 'avatarColor'> & {password?: string, role?: EmpleadoRole});

    setIsLoading(false);
    if (newEmpleado) {
      return { success: true, message: t('registerPage.registrationSuccessMessage') };
    } else {
      return { success: false, message: t('registerPage.genericError') };
    }
  }, [t]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: user || DEFAULT_SUPER_ADMIN, login, logout, register, isLoading: false, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
