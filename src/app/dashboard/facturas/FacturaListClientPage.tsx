
"use client";
import type { ReactNode } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Eye, Filter } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Factura, FacturaTipo, CurrencyCode } from '@/types';
import { getFacturas, deleteFactura as deleteFacturaApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface FacturaListClientPageProps {
  pageTitleKey: string;
  pageDescriptionKey: string;
  newButtonTextKey: string;
  newButtonLink?: string; 
  invoiceTypeFilter?: FacturaTipo;
  hideNewButton?: boolean;
}

const ALL_CURRENCIES: CurrencyCode[] = ['EUR', 'USD', 'GBP']; 

export default function FacturaListClientPage({
  pageTitleKey,
  pageDescriptionKey,
  newButtonTextKey,
  newButtonLink: providedNewButtonLink,
  invoiceTypeFilter,
  hideNewButton = false,
}: FacturaListClientPageProps) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [facturaToDelete, setFacturaToDelete] = useState<Factura | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<Set<CurrencyCode>>(new Set(ALL_CURRENCIES));
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth(); // Get user from context

  useEffect(() => {
    async function fetchFacturas() {
      setIsLoading(true);
      try {
        const data = await getFacturas();
        setFacturas(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('facturas.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacturas();
  }, [toast, t]);

  const filteredFacturas = useMemo(() => {
    let currentFacturas = facturas;
    if (invoiceTypeFilter) {
      currentFacturas = facturas.filter(factura => factura.tipo === invoiceTypeFilter);
    }
    
    if (selectedCurrencies.size < ALL_CURRENCIES.length) { 
        currentFacturas = currentFacturas.filter(factura => selectedCurrencies.has(factura.moneda));
    }

    return currentFacturas.filter(factura =>
      factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.clienteNombre && factura.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (factura.proveedorNombre && factura.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      factura.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.moneda.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facturas, searchTerm, invoiceTypeFilter, selectedCurrencies]);

  const getBadgeVariant = (estado: Factura['estado']) => {
    switch (estado) {
      case 'Pagada': return 'default'; 
      case 'Pendiente': return 'secondary'; 
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const translateStatus = (status: Factura['estado']) => {
    switch (status) {
      case 'Pagada': return t('facturas.statusPaid');
      case 'Pendiente': return t('facturas.statusPending');
      case 'Cancelada': return t('facturas.statusCancelled');
      default: return status;
    }
  }

  const translateType = (type: Factura['tipo']) => {
     switch (type) {
      case 'Venta': return t('facturas.typeSale');
      case 'Compra': return t('facturas.typePurchase');
      default: return type;
    }
  }

  const handleDeleteFactura = async () => {
    if (!facturaToDelete || !user) { // Check for user
        toast({
            title: t('common.error'),
            description: !facturaToDelete ? t('facturas.notFound') : "User not authenticated.",
            variant: "destructive",
        });
        setIsDeleting(false);
        return;
    }
    setIsDeleting(true);
    try {
      // Pass user.id and t to deleteFacturaApi
      await deleteFacturaApi(facturaToDelete.id, user.id, t); 
      setFacturas(prev => prev.filter(f => f.id !== facturaToDelete.id));
      toast({ title: t('common.success'), description: t('facturas.successDelete', { id: facturaToDelete.id }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('facturas.failDelete', { id: facturaToDelete.id }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setFacturaToDelete(null);
    }
  };

  const openDeleteDialog = (factura: Factura) => {
    setFacturaToDelete(factura);
  };
  
  const toggleCurrencyFilter = (currency: CurrencyCode) => {
    setSelectedCurrencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currency)) {
        newSet.delete(currency);
      } else {
        newSet.add(currency);
      }
      return newSet.size === 0 ? new Set(ALL_CURRENCIES) : newSet;
    });
  };

  const newButtonLink = providedNewButtonLink || 
                        (invoiceTypeFilter === 'Venta' ? '/dashboard/facturas/new?tipo=venta' 
                        : invoiceTypeFilter === 'Compra' ? '/dashboard/facturas/new?tipo=compra' 
                        : '/dashboard/facturas/new');


  if (isLoading) {
     return (
      <>
        <PageHeader title={t(pageTitleKey)} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(8)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  const metrics = useMemo(() => {
    const total = filteredFacturas.reduce((sum, f) => sum + (f.totalFactura || 0), 0);
    const paid = filteredFacturas.filter(f => f.estado === 'Pagada');
    const paidSum = paid.reduce((sum, f) => sum + (f.totalFactura || 0), 0);
    const pending = filteredFacturas.filter(f => f.estado === 'Pendiente');
    const pendingSum = pending.reduce((sum, f) => sum + (f.totalFactura || 0), 0);
    const cancelled = filteredFacturas.filter(f => f.estado === 'Cancelada');
    const cancelledSum = cancelled.reduce((sum, f) => sum + (f.totalFactura || 0), 0);

    return { total, paidCount: paid.length, paidSum, pendingCount: pending.length, pendingSum, cancelledCount: cancelled.length, cancelledSum };
  }, [filteredFacturas]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(pageTitleKey)}
        description={t(pageDescriptionKey)}
        actionButton={
          !hideNewButton ? (
            <Button asChild className="shadow-sm">
              <Link href={newButtonLink}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t(newButtonTextKey)}
              </Link>
            </Button>
          ) : null
        }
      />

      {/* Invoice Analytics Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <span>إجمالي قيمة الفواتير</span>
            <Filter className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
            EGP {metrics.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{filteredFacturas.length} فاتورة مسجلة بالنظام</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>الفواتير المدفوعة</span>
            <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{metrics.paidCount}</span>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            EGP {metrics.paidSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">عمليات محسومة بالكامل</p>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
            <span>الفواتير المعلقة</span>
            <span className="text-xs font-black bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">{metrics.pendingCount}</span>
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
            EGP {metrics.pendingSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">بانتظار التحصيل والسداد</p>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
            <span>الفواتير الملغاة</span>
            <span className="text-xs font-black bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">{metrics.cancelledCount}</span>
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            EGP {metrics.cancelledSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">عمليات ملغاة أو مرتجعة</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder={t('facturas.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md pl-10 shadow-sm"
            />
        </div>
        <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className="shadow-sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('facturas.filterByCurrency')} ({selectedCurrencies.size})
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
            <Command>
                <CommandInput placeholder={t('facturas.searchCurrency')} />
                <CommandList>
                <CommandEmpty>{t('facturas.noCurrencyFound')}</CommandEmpty>
                <CommandGroup>
                    {ALL_CURRENCIES.map((currency) => (
                    <CommandItem
                        key={currency}
                        onSelect={() => toggleCurrencyFilter(currency)}
                        className="flex items-center justify-between"
                    >
                        {currency}
                        <Checkbox
                        checked={selectedCurrencies.has(currency)}
                        onCheckedChange={() => toggleCurrencyFilter(currency)}
                        className="ml-2"
                        />
                    </CommandItem>
                    ))}
                </CommandGroup>
                </CommandList>
            </Command>
            </PopoverContent>
        </Popover>
      </div>


      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('facturas.tableNumber')}</TableHead>
              <TableHead>{t('facturas.tableDate')}</TableHead>
              <TableHead>{t('facturas.tableType')}</TableHead>
              <TableHead>{t('facturas.tableClientSupplier')}</TableHead>
              <TableHead>{t('facturas.tableTotal')}</TableHead>
              <TableHead>{t('facturas.tableCurrency')}</TableHead>
              <TableHead>{t('facturas.tableStatus')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacturas.length > 0 ? (
              filteredFacturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.id}</TableCell>
                  <TableCell>{format(new Date(factura.fecha), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={factura.tipo === 'Venta' ? 'outline' : 'secondary'}>
                      {translateType(factura.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{factura.clienteNombre || factura.proveedorNombre || '-'}</TableCell>
                  <TableCell>{factura.totalFactura.toFixed(2)}</TableCell>
                  <TableCell>{factura.moneda}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(factura.estado)}>
                      {translateStatus(factura.estado)}
                    </Badge>
                  </TableCell>
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
                           <Link href={`/dashboard/facturas/${factura.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" /> {t('common.viewDetails')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/facturas/${factura.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(factura)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {t('facturas.noFacturasFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!facturaToDelete} onOpenChange={() => setFacturaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('facturas.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('facturas.deleteDialogDescription', { id: facturaToDelete?.id })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFactura} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

