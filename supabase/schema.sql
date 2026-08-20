-- =========================================================
-- FORDER ERP - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- =========================================================

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
    is_blocked BOOLEAN DEFAULT false,
    avatar_color TEXT DEFAULT '#3498db',
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nif TEXT,
    direccion TEXT,
    poblacion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nif TEXT,
    direccion TEXT,
    poblacion TEXT,
    telefono TEXT,
    email TEXT,
    persona_contacto TEXT,
    terminos_pago TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio_compra NUMERIC(12, 2) NOT NULL,
    precio_venta NUMERIC(12, 2) NOT NULL,
    moneda TEXT DEFAULT 'EGP',
    iva NUMERIC(5, 2) DEFAULT 14.00,
    stock INTEGER DEFAULT 0,
    categoria TEXT,
    referencia TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Warehouses Table
CREATE TABLE IF NOT EXISTS public.warehouses (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    capacidad TEXT,
    persona_contacto TEXT,
    telefono_contacto TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    fecha DATE DEFAULT CURRENT_DATE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Venta', 'Compra')),
    cliente_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    proveedor_id TEXT REFERENCES public.suppliers(id) ON DELETE SET NULL,
    empleado_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    almacen_id TEXT REFERENCES public.warehouses(id) ON DELETE SET NULL,
    base_imponible NUMERIC(12, 2) NOT NULL,
    total_iva NUMERIC(12, 2) NOT NULL,
    total_factura NUMERIC(12, 2) NOT NULL,
    estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pagada', 'Pendiente', 'Cancelada')),
    moneda TEXT DEFAULT 'EGP',
    detalles JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS Policies
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow Public Access for Demo (Replace with auth.uid() in production)
CREATE POLICY "Allow public read access on employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on employees" ON public.employees FOR ALL USING (true);

CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on customers" ON public.customers FOR ALL USING (true);

CREATE POLICY "Allow public read access on suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on suppliers" ON public.suppliers FOR ALL USING (true);

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read access on warehouses" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on warehouses" ON public.warehouses FOR ALL USING (true);

CREATE POLICY "Allow public read access on invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on invoices" ON public.invoices FOR ALL USING (true);
