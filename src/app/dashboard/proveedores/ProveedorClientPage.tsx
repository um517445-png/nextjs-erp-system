
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Proveedor } from '@/types';
import { getProveedores, deleteProveedor as deleteProveedorApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/shared/PaginationControls';

const ITEMS_PER_PAGE = 25;

export default function ProveedorClientPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProveedores() {
      setIsLoading(true);
      try {
        const data = await getProveedores();
        setProveedores(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('suppliers.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProveedores();
  }, [toast, t]);

  const filteredProveedoresData = useMemo(() => {
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.nif.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proveedores, searchTerm]);

  const totalPages = Math.ceil(filteredProveedoresData.length / ITEMS_PER_PAGE);

  const paginatedProveedores = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProveedoresData.slice(startIndex, endIndex);
  }, [filteredProveedoresData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage > 1) {
        setCurrentPage(1);
    }
  }, [searchTerm, totalPages, currentPage]);

  const handleDeleteProveedor = async () => {
    if (!proveedorToDelete || !user) {
        toast({ title: t('common.error'), description: !proveedorToDelete ? t('suppliers.notFound') : "User not authenticated.", variant: "destructive" });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteProveedorApi(proveedorToDelete.id, user.id, t);
      const updatedProveedores = proveedores.filter(p => p.id !== proveedorToDelete.id);
      setProveedores(updatedProveedores);

      const newFilteredData = updatedProveedores.filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.nif.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      toast({ title: t('common.success'), description: t('suppliers.successDelete', { name: proveedorToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('suppliers.failDelete', { name: proveedorToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setProveedorToDelete(null);
    }
  };

  const openDeleteDialog = (proveedor: Proveedor) => {
    setProveedorToDelete(proveedor);
  };

  const isRtl = language === 'ar';

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('proveedores.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-32" />} />
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="rounded-xl border border-border bg-card shadow-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(6)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('proveedores.title')}
        description={t('proveedores.description')}
        actionButton={
          <Button asChild className="shadow-lg shadow-amber-500/10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl">
            <Link href="/dashboard/proveedores/new">
              <PlusCircle className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {t('proveedores.addNewProveedorButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative max-w-md">
        <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
        <Input
          type="search"
          placeholder={t('proveedores.searchPlaceholder')}
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
              <TableHead>{t('suppliers.tableId')}</TableHead>
              <TableHead>{t('suppliers.tableName')}</TableHead>
              <TableHead>{t('suppliers.tableNif')}</TableHead>
              <TableHead>{t('suppliers.tableEmail')}</TableHead>
              <TableHead>{t('suppliers.tablePhone')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProveedores.length > 0 ? (
              paginatedProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">{proveedor.id}</TableCell>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.nif}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>{proveedor.telefono || '-'}</TableCell>
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
                          <Link href={`/dashboard/proveedores/${proveedor.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(proveedor)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t('proveedores.noProveedoresFound')}
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
        totalItems={filteredProveedoresData.length}
      />

      <AlertDialog open={!!proveedorToDelete} onOpenChange={() => setProveedorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('suppliers.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('suppliers.deleteDialogDescription', { name: proveedorToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProveedor} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
