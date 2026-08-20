
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Producto, CurrencyCode } from '@/types';
import { getProductos, deleteProducto as deleteProductoApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from '@/components/ui/checkbox';

const ITEMS_PER_PAGE = 25;
const ALL_PRODUCT_CURRENCIES: CurrencyCode[] = ['EUR', 'USD', 'GBP'];

export default function ProductoClientPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCurrencies, setSelectedCurrencies] = useState<Set<CurrencyCode>>(new Set(ALL_PRODUCT_CURRENCIES));
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProductos() {
      setIsLoading(true);
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('products.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductos();
  }, [toast, t]);

  const filteredProductosData = useMemo(() => {
    let currentProductos = productos;

    if (selectedCurrencies.size < ALL_PRODUCT_CURRENCIES.length) {
        currentProductos = currentProductos.filter(producto => selectedCurrencies.has(producto.moneda));
    }

    return currentProductos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.codigo && producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (producto.referencia && producto.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
      producto.moneda.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm, selectedCurrencies]);

  const totalPages = Math.ceil(filteredProductosData.length / ITEMS_PER_PAGE);

  const paginatedProductos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProductosData.slice(startIndex, endIndex);
  }, [filteredProductosData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage > 1) {
        setCurrentPage(1);
    }
  }, [searchTerm, selectedCurrencies, totalPages, currentPage]);

  const handleDeleteProducto = async () => {
    if (!productoToDelete || !user) {
        toast({ title: t('common.error'), description: !productoToDelete ? t('products.notFound') : "User not authenticated.", variant: "destructive" });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteProductoApi(productoToDelete.id, user.id, t);
      const updatedProductos = productos.filter(p => p.id !== productoToDelete.id);
      setProductos(updatedProductos);

      let newFilteredData = updatedProductos;
      if (selectedCurrencies.size < ALL_PRODUCT_CURRENCIES.length) {
        newFilteredData = newFilteredData.filter(producto => selectedCurrencies.has(producto.moneda));
      }
      newFilteredData = newFilteredData.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (producto.referencia && producto.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        producto.moneda.toLowerCase().includes(searchTerm.toLowerCase())
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

      toast({ title: t('common.success'), description: t('products.successDelete', { name: productoToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('products.failDelete', { name: productoToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setProductoToDelete(null);
    }
  };

  const openDeleteDialog = (producto: Producto) => {
    setProductoToDelete(producto);
  };

  const toggleCurrencyFilter = (currency: CurrencyCode) => {
    setSelectedCurrencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currency)) {
        newSet.delete(currency);
      } else {
        newSet.add(currency);
      }
      const finalSet = newSet.size === 0 ? new Set(ALL_PRODUCT_CURRENCIES) : newSet;
      setCurrentPage(1);
      return finalSet;
    });
  };

  const isRtl = language === 'ar';

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('productos.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="rounded-xl border border-border bg-card shadow-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(7)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
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
        title={t('productos.title')}
        description={t('productos.description')}
        actionButton={
          <Button asChild className="shadow-lg shadow-amber-500/10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl">
            <Link href="/dashboard/productos/new">
              <PlusCircle className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> {t('productos.addNewProductoButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
          <Input
            type="search"
            placeholder={t('productos.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full bg-card border-border text-foreground rounded-xl ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          />
        </div>
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-xl border-border bg-card text-foreground hover:bg-muted shadow-xs">
                <Filter className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {t('productos.filterByCurrency')} ({selectedCurrencies.size === ALL_PRODUCT_CURRENCIES.length ? t('common.all') : selectedCurrencies.size})
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-card border-border text-card-foreground shadow-xl rounded-xl" align="end">
            <Command>
                <CommandInput placeholder={t('productos.searchCurrency')} />
                <CommandList>
                <CommandEmpty>{t('productos.noCurrencyFound')}</CommandEmpty>
                <CommandGroup>
                    {ALL_PRODUCT_CURRENCIES.map((currency) => (
                    <CommandItem
                        key={currency}
                        onSelect={() => toggleCurrencyFilter(currency)}
                        className="flex items-center justify-between"
                    >
                        {currency}
                        <Checkbox
                        checked={selectedCurrencies.has(currency)}
                        className={isRtl ? "mr-2" : "ml-2"}
                        />
                    </CommandItem>
                    ))}
                </CommandGroup>
                </CommandList>
            </Command>
            </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('products.tableCode')}</TableHead>
              <TableHead>{t('products.tableRef')}</TableHead>
              <TableHead>{t('products.tableName')}</TableHead>
              <TableHead>{t('products.tableCategory')}</TableHead>
              <TableHead className="text-right">{t('products.tablePrice')}</TableHead>
              <TableHead className="text-right">{t('products.tableStock')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProductos.length > 0 ? (
              paginatedProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">{producto.codigo}</TableCell>
                  <TableCell>{producto.referencia || '-'}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria ? <Badge variant="outline">{producto.categoria}</Badge> : '-'}</TableCell>
                  <TableCell className="text-right">{producto.precioVenta.toFixed(2)} {producto.moneda}</TableCell>
                  <TableCell className="text-right">{producto.stock}</TableCell>
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
                          <Link href={`/dashboard/productos/${producto.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(producto)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t('productos.noProductosFound')}
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
        totalItems={filteredProductosData.length}
      />

      <AlertDialog open={!!productoToDelete} onOpenChange={() => setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('products.deleteDialogDescription', { name: productoToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProducto} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
