
"use client";
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { PurchasesChart } from "@/components/dashboard/PurchasesChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ListChecks, Banknote, Plus, Sparkles, MessageSquare, Briefcase } from "lucide-react";
import { TeamActivityCard } from '@/components/dashboard/TeamActivityCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getRecentSales, getRecentOrders, getWarehouseStatus, getTotalStockValue, getClientes, getFacturas } from '@/lib/mockData';
import type { RecentSale, RecentOrder, WarehouseSummary, CurrencyCode, Factura } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, getMonth, getYear, parseISO } from 'date-fns';

interface DashboardData {
  totalRevenue: number;
  newCustomersCount: number;
  salesCount: number;
  productsInStock: number;
  recentSales: RecentSale[];
  recentOrders: RecentOrder[];
  warehouseStatus: WarehouseSummary[];
  allFacturas: Factura[];
}

type DisplayCurrency = 'EGP' | 'USD' | 'EUR';

const CURRENCY_SYMBOLS: Record<DisplayCurrency, string> = {
  EGP: 'EGP ',
  USD: '$ ',
  EUR: '€ ',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<DisplayCurrency>('EGP');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          stockValueData,
          allClientes,
          salesData,
          ordersData,
          warehouseData,
          allFacturasData,
        ] = await Promise.all([
          getTotalStockValue(),
          getClientes(),
          getRecentSales(),
          getRecentOrders(),
          getWarehouseStatus(),
          getFacturas(),
        ]);

        setData({
          totalRevenue: stockValueData.totalRevenue || 3210,
          newCustomersCount: allClientes.length || 18,
          salesCount: stockValueData.salesCount || 12,
          productsInStock: stockValueData.totalStock || 145,
          recentSales: salesData,
          recentOrders: ordersData,
          warehouseStatus: warehouseData,
          allFacturas: allFacturasData,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl shadow-md" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl shadow-lg" />
          <Skeleton className="h-80 rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            لوحة التحليلات المباشرة <Sparkles className="h-5 w-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            متابعة شاملة للحسابات المالية، الصفقات، الفواتير، وحركة المخازن والمنتجات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="currency-select" className="text-xs font-bold text-slate-400">
            العملة المعروضة:
          </Label>
          <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as DisplayCurrency)}>
            <SelectTrigger id="currency-select" className="w-[110px] bg-slate-900/60 border-slate-800 text-slate-200 text-xs font-bold rounded-xl shadow-sm">
              <Banknote className="h-4 w-4 text-amber-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 text-xs font-bold">
              <SelectItem value="EGP">EGP (جنيه)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Action Buttons Pill Bar matching Vorder CRM Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-violet-950/40 border border-violet-800/50 text-violet-300 hover:bg-violet-900/60 transition-all shadow-sm font-bold text-xs">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>أتمتة جديدة</span>
        </Button>

        <Button className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-blue-950/40 border border-blue-800/50 text-blue-300 hover:bg-blue-900/60 transition-all shadow-sm font-bold text-xs">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <span>حملة جديدة</span>
        </Button>

        <Button className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-amber-950/40 border border-amber-800/50 text-amber-300 hover:bg-amber-900/60 transition-all shadow-sm font-bold text-xs">
          <Briefcase className="h-4 w-4 text-amber-400" />
          <span>صفقة جديدة</span>
        </Button>

        <Link href="/dashboard/clientes/new" className="w-full">
          <Button className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60 transition-all shadow-sm font-bold text-xs">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>جهة اتصال جديدة</span>
          </Button>
        </Link>
      </div>

      {/* Bento Grid Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="إجمالي قيمة القمع الكلية"
          value={`${currencySymbol}${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="إجمالي قيمة كافة الصفقات بجميع المراحل"
        />
        <MetricCard
          title="المبيعات والأرباح المحسومة"
          value={`${currencySymbol}1,900`}
          icon={ShoppingCart}
          description="إجمالي قيمة الصفقات المحسومة بنجاح"
        />
        <MetricCard
          title="إجمالي قيمة الصفقات النشطة"
          value={`${currencySymbol}1,310`}
          icon={Package}
          description="صفقة مفتوحة في مرحلة المفاوضات"
        />
        <MetricCard
          title="العملاء والشركاء المسجلين"
          value={`${data.newCustomersCount}`}
          icon={Users}
          description="عميل مسجل في قاعدة البيانات الحالية"
        />
      </div>

      {/* Charts Layer */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SalesChart chartData={[
          { month: 'يناير', sales: 1200 },
          { month: 'فبراير', sales: 1900 },
          { month: 'مارس', sales: 2400 },
          { month: 'أبريل', sales: 1800 },
          { month: 'مايو', sales: 3200 },
          { month: 'يونيو', sales: 2900 },
        ]} currencySymbol={currencySymbol} />
        <PurchasesChart chartData={[
          { month: 'يناير', purchases: 800 },
          { month: 'فبراير', purchases: 1100 },
          { month: 'مارس', purchases: 1500 },
          { month: 'أبريل', purchases: 1200 },
          { month: 'مايو', purchases: 2100 },
          { month: 'يونيو', purchases: 1800 },
        ]} currencySymbol={currencySymbol} />
      </div>

      {/* Warehouse Status & Recent Sales Tables */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-2xl border border-slate-800 bg-[#131B2E] text-slate-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-100">
              <ListChecks className="h-5 w-5 text-amber-400" />
              حالة المخازن وسلسلة الإمداد
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              متابعة السعة الاستيعابية ومستوى التخزين بالفروع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-900/60">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300 font-bold text-xs">اسم المخزن</TableHead>
                  <TableHead className="text-slate-300 font-bold text-xs">الموقع</TableHead>
                  <TableHead className="text-right text-slate-300 font-bold text-xs">المنتجات المخزنة</TableHead>
                  <TableHead className="text-right text-slate-300 font-bold text-xs">السعة القصوى</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.warehouseStatus.map((item) => (
                  <TableRow key={item.name} className="border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-bold text-xs text-slate-200">{item.name}</TableCell>
                    <TableCell className="text-xs text-slate-400">{item.location}</TableCell>
                    <TableCell className="text-right text-xs font-bold text-amber-400">{item.items.toFixed(0)}</TableCell>
                    <TableCell className="text-right text-xs text-slate-400">{item.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-[#131B2E] text-slate-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100">أحدث فواتير المبيعات</CardTitle>
            <CardDescription className="text-xs text-slate-400">ملخص آخر المبيعات والعمليات المحسومة مؤخراً</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-900/60">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300 font-bold text-xs">رقم الفاتورة</TableHead>
                  <TableHead className="text-slate-300 font-bold text-xs">العميل</TableHead>
                  <TableHead className="text-slate-300 font-bold text-xs">التاريخ</TableHead>
                  <TableHead className="text-right text-slate-300 font-bold text-xs">المبلغ الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentSales.map((sale) => (
                  <TableRow key={sale.id} className="border-slate-800/60 hover:bg-slate-800/40">
                    <TableCell className="font-mono text-xs text-amber-400 font-bold">{sale.id}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-200">{sale.customer}</TableCell>
                    <TableCell className="text-xs text-slate-400">{format(parseISO(sale.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right text-xs font-extrabold text-emerald-400">{currencySymbol}{sale.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TeamActivityCard />
    </div>
  );
}
