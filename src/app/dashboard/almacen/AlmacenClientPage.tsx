
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search } from 'lucide-react'; // Removed WarehouseIcon as it's not used directly here
import { PageHeader } from '@/components/shared/PageHeader';
import type { Almacen } from '@/types';
import { getAlmacenes, deleteAlmacen as deleteAlmacenApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/shared/PaginationControls';

const ITEMS_PER_PAGE = 25;

export default function AlmacenClientPage() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [almacenToDelete, setAlmacenToDelete] = useState<Almacen | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAlmacenes() {
      setIsLoading(true);
      try {
        const data = await getAlmacenes();
        setAlmacenes(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('warehouse.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlmacenes();
  }, [toast, t]);

  const filteredAlmacenesData = useMemo(() => {
    return almacenes.filter(almacen =>
      almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (almacen.ubicacion && almacen.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (almacen.capacidad && almacen.capacidad.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [almacenes, searchTerm]);

  const totalPages = Math.ceil(filteredAlmacenesData.length / ITEMS_PER_PAGE);

  const paginatedAlmacenes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAlmacenesData.slice(startIndex, endIndex);
  }, [filteredAlmacenesData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage > 1) {
        setCurrentPage(1);
    }
  }, [searchTerm, totalPages, currentPage]);

  const handleDeleteAlmacen = async () => {
    if (!almacenToDelete || !user) {
      toast({ title: t('common.error'), description: t('warehouse.failDelete', {name: almacenToDelete?.nombre || ''}), variant: "destructive" });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAlmacenApi(almacenToDelete.id, user.id, t); 
      const updatedAlmacenes = almacenes.filter(a => a.id !== almacenToDelete.id);
      setAlmacenes(updatedAlmacenes);

      const newFilteredData = updatedAlmacenes.filter(almacen =>
        almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (almacen.ubicacion && almacen.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (almacen.capacidad && almacen.capacidad.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      const newTotalPages = Math.ceil(newFilteredData.length / ITEMS_PER_PAGE);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) { 
        setCurrentPage(1);
      } else {
         const itemsOnCurrentPage = newFilteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).length;
        if (itemsOnCurrentPage === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
      }

      toast({ title: t('common.success'), description: t('warehouse.successDelete', { name: almacenToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('warehouse.failDelete', { name: almacenToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setAlmacenToDelete(null);
    }
  };

  const openDeleteDialog = (almacen: Almacen) => {
    setAlmacenToDelete(almacen);
  };

  const isRtl = language === 'ar';

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('almacen.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-32" />} />
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="rounded-xl border border-border bg-card shadow-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
  

  const warehouseMetrics = useMemo(() => {
    const totalCount = filteredAlmacenesData.length;
    return { totalCount };
  }, [filteredAlmacenesData]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('almacen.title')}
        description={t('almacen.description')}
        actionButton={
          <Button asChild className="shadow-lg shadow-amber-500/10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl">
            <Link href="/dashboard/almacen/new">
              <PlusCircle className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {t('almacen.addNewAlmacenButton')}
            </Link>
          </Button>
        }
      />

      {/* Warehouse Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <span>إجمالي المستودعات والفروع</span>
            <span className="text-xs font-black bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{warehouseMetrics.totalCount}</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {warehouseMetrics.totalCount} فروع مسجلة
          </div>
          <p className="text-[11px] text-slate-400 mt-1">مستودع رئيسي وفرعي فعال</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>متوسط نسبة الإشغال التخزيني</span>
            <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">78%</span>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            78.5% مستغلة
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">معدل تشغيل استيعابي ممتاز</p>
        </div>

        <div className="rounded-2xl border border-purple-200 dark:border-purple-950 bg-purple-50/50 dark:bg-purple-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
            <span>السعة الاستيعابية القصوى</span>
            <span className="text-xs font-black bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">12,500 طن</span>
          </div>
          <div className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
            12,500 وحدة تخزينية
          </div>
          <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80 mt-1">إجمالي الحجم المتاح للإنتاج</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
        <Input
          type="search"
          placeholder={t('almacen.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full bg-card border-border text-foreground rounded-xl ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('warehouse.tableId')}</TableHead>
              <TableHead>{t('warehouse.tableName')}</TableHead>
              <TableHead>{t('warehouse.tableLocation')}</TableHead>
              <TableHead>{t('warehouse.tableCapacity')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAlmacenes.length > 0 ? (
              paginatedAlmacenes.map((almacen) => (
                <TableRow key={almacen.id}>
                  <TableCell className="font-medium">{almacen.id}</TableCell>
                  <TableCell>{almacen.nombre}</TableCell>
                  <TableCell>{almacen.ubicacion || '-'}</TableCell>
                  <TableCell>{almacen.capacidad || '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('common.actions')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/almacen/${almacen.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(almacen)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t('almacen.noAlmacenesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredAlmacenesData.length}
      />

      <AlertDialog open={!!almacenToDelete} onOpenChange={() => setAlmacenToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.deleteDialogDescription', { name: almacenToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlmacen} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
