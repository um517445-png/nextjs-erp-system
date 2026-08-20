
import type { Cliente, Proveedor, Empleado, Producto, Almacen, Factura, DetalleFactura, EmpleadoRole, FacturaTipo, FacturaEstado, CurrencyCode, TeamActivityLog, TeamActivityModule, TeamActivityAction, NotificationConfig, NotificationTargetRole } from '@/types';
import { subDays, subHours, subMinutes } from 'date-fns';

let clientes: Cliente[] = [
  { id: 'CLI001', nombre: 'شركة الأمل للمقاولات والتطوير', nif: '304928102', direccion: 'شارع التسعين الشمالي، التجمع الخامس', poblacion: 'القاهرة الجديدة', telefono: '01012345678', email: 'info@alamal-dev.com' },
  { id: 'CLI002', nombre: 'مؤسسة الفرسان للتجارة والتوريدات', nif: '592019483', direccion: 'برج الفرسان، طريق الكورنيش', poblacion: 'الإسكندرية', telefono: '01298765432', email: 'contact@alforsan.eg' },
  { id: 'CLI003', nombre: 'المهندس أحمد مصطفى', nif: '109283746', direccion: 'حي الأشجار، الشيخ زايد', poblacion: 'الجيزة', telefono: '01155443322', email: 'ahmed.mostafa@gmail.com' },
];

let proveedores: Proveedor[] = [
  { id: 'PRO001', nombre: 'السويدي للكابلات والأنظمة الكهربائية', nif: '983726154', direccion: 'المنطقة الصناعية الأولى، مدينة 6 أكتوبر', poblacion: 'الجيزة', telefono: '0238383838', email: 'sales@elsewedy.com', personaContacto: 'م. تامر حسني', terminosPago: '30 يوماً' },
  { id: 'PRO002', nombre: 'مجموعة حديد عز للصلب والهياكل', nif: '472918374', direccion: 'طريق الإسكندرية الصحراوي', poblacion: 'الإسكندرية', telefono: '0237666555', email: 'orders@ezzsteel.com', personaContacto: 'أ. خالد راشد', terminosPago: 'عند التسليم' },
];

let empleados: Empleado[] = [
  { id: 'EMP001', nombre: 'المهندس محمد أحمد', email: 'mohamed.ahmed@vorder.com', telefono: '01000000001', role: 'admin', isBlocked: false, avatarColor: '#3498db', emailNotifications: true },
  { id: 'EMP002', nombre: 'أ.د. أحمد محمود السايس', email: 'ahmed.mahmoud@vorder.com', telefono: '01011223344', role: 'admin', isBlocked: false, avatarColor: '#e74c3c', emailNotifications: true },
  { id: 'EMP003', nombre: 'م. ياسر فاروق عبد السميع', email: 'yasser.farouk@vorder.com', telefono: '01222334455', role: 'moderator', isBlocked: false, avatarColor: '#2ecc71', emailNotifications: true },
  { id: 'EMP004', nombre: 'أ. سارة حسن الشريف', email: 'sara.hassan@vorder.com', telefono: '01133445566', role: 'user', isBlocked: false, avatarColor: '#f1c40f', emailNotifications: true },
  { id: 'EMP005', nombre: 'م. كريم الدين الشاذلي', email: 'kareem.elshazly@vorder.com', telefono: '01555667788', role: 'user', isBlocked: false, avatarColor: '#9b59b6', emailNotifications: false },
];

let almacenes: Almacen[] = [
  { id: 'ALM001', nombre: 'المستودع الرئيسي - العابور', ubicacion: 'المنطقة الصناعية ب، العابور', capacidad: '2500 م²', personaContacto: 'م. هاني سعيد', telefonoContacto: '01099887766', notas: 'استلام التوريدات الرئيسية والمعدات.' },
  { id: 'ALM002', nombre: 'مخزن العاصمة الإدارية', ubicacion: 'الحي الحكومي، العاصمة الإدارية', capacidad: '800 م²', personaContacto: 'أ. سامح عبد الفتاح', telefonoContacto: '01233445566', notas: 'المخزون السريع لمشروعات العاصمة.' },
];

let productos: Producto[] = [
  { id: 'PROD001', codigo: 'P-CAB-01', nombre: 'كابلات نحاسية مسلح 4*16 مم', descripcion: 'كابلات كهربائية معزولة ومسلحة للمشروعات الكبرى', precioCompra: 450.00, precioVenta: 680.00, moneda: 'EGP', iva: 14.00, stock: 1500, categoria: 'كهرباء', referencia: 'EL-SEW-416'},
  { id: 'PROD002', codigo: 'P-STL-02', nombre: 'حديد تسليح عالي الإجهاد 12 مم', descripcion: 'حديد تسليح مشرشر مطابق للمواصفات القياسية', precioCompra: 38000.00, precioVenta: 42500.00, moneda: 'EGP', iva: 14.00, stock: 250, categoria: 'إنشاءات', referencia: 'EZ-STL-12M' },
  { id: 'PROD003', codigo: 'P-GEN-03', nombre: 'مولد كهربائي ديزل 100 ك.ف.أ', descripcion: 'مولد كاتم للصوت مناسب للمواقع الميدانية', precioCompra: 320000.00, precioVenta: 395000.00, moneda: 'EGP', iva: 14.00, stock: 12, categoria: 'معدات', referencia: 'CAT-GEN-100K' },
];

let facturas: Factura[] = [
  {
    id: 'INV-2026-001', fecha: '2026-08-01', tipo: 'Venta', clienteId: 'CLI001', empleadoId: 'EMP001', almacenId: 'ALM001',
    baseImponible: 68000.00, totalIva: 9520.00, totalFactura: 77520.00, estado: 'Pagada', moneda: 'EGP',
    detalles: [
      { id: 'DET001', productoId: 'PROD001', productoNombre: 'كابلات نحاسية مسلح 4*16 مم', cantidad: 100, precioUnitario: 680.00, porcentajeIva: 14.00, subtotal: 68000.00, subtotalConIva: 77520.00 }
    ],
    clienteNombre: 'شركة الأمل للمقاولات والتطوير', empleadoNombre: 'المهندس محمد أحمد'
  },
  {
    id: 'INV-2026-002', fecha: '2026-08-15', tipo: 'Compra', proveedorId: 'PRO001', empleadoId: 'EMP002', almacenId: 'ALM001',
    baseImponible: 225000.00, totalIva: 31500.00, totalFactura: 256500.00, estado: 'Pendiente', moneda: 'EGP',
    detalles: [
      { id: 'DET002', productoId: 'PROD001', productoNombre: 'كابلات نحاسية مسلح 4*16 مم', cantidad: 500, precioUnitario: 450.00, porcentajeIva: 14.00, subtotal: 225000.00, subtotalConIva: 256500.00 }
    ],
    proveedorNombre: 'السويدي للكابلات والأنظمة الكهربائية', empleadoNombre: 'أ.د. أحمد محمود السايس'
  },
];

const AVATAR_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#d35400'];
let colorIndex = 0;
const getNextAvatarColor = () => {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  colorIndex++;
  return color;
}

let teamActivityLogs: TeamActivityLog[] = [];
let notificationConfigs: NotificationConfig[] = [];

const LOG_LIMIT = 20;

const generateId = (prefix: string, currentItems: any[], idKey: string = 'id', padLength: number = 3) => {
  const maxNum = currentItems.reduce((max, item) => {
    if (!item || !item[idKey]) return max;
    const numStr = String(item[idKey]).replace(prefix, '').replace(/^.*-/, '');
    if (numStr && /^\d+$/.test(numStr)) {
        const num = parseInt(numStr, 10);
        return Math.max(max, num);
    }
    return max;
  }, 0);
  return `${prefix}${(maxNum + 1).toString().padStart(padLength, '0')}`;
};


interface AddTeamActivityLogData {
  usuario_id: string;
  modulo: TeamActivityModule;
  accion: TeamActivityAction;
  descripcionKey: string;
  descripcionParams?: Record<string, string | number | undefined | null>;
  entidad_id?: string;
  entidad_nombre?: string;
  t: (key: string, params?: any) => string;
}

export const addTeamActivityLog = async (logData: AddTeamActivityLogData): Promise<TeamActivityLog> => {
  const actingUser = await getEmpleadoById(logData.usuario_id);
  if (!actingUser) {
    console.warn(`Activity Log: User with ID ${logData.usuario_id} not found. Logging as System.`);
  }

  const userName = actingUser?.nombre || 'System';
  const userAvatarColor = actingUser?.avatarColor || getNextAvatarColor();

  const descripcion = logData.t(logData.descripcionKey, {
    ...logData.descripcionParams,
    userName: userName,
  });

  const newLog: TeamActivityLog = {
    id: generateId('ACT', teamActivityLogs, 'id', 3),
    usuario_id: logData.usuario_id,
    nombre_usuario: userName,
    avatar_color: userAvatarColor,
    modulo: logData.modulo,
    accion: logData.accion,
    descripcion: descripcion,
    timestamp: new Date().toISOString(),
    entidad_id: logData.entidad_id,
    entidad_nombre: logData.entidad_nombre,
  };

  teamActivityLogs.unshift(newLog);
  if (teamActivityLogs.length > LOG_LIMIT) {
    teamActivityLogs = teamActivityLogs.slice(0, LOG_LIMIT);
  }
  return newLog;
};


// Clientes CRUD
export const getClientes = async (): Promise<Cliente[]> => [...clientes];
export const getClienteById = async (id: string): Promise<Cliente | undefined> => clientes.find(c => c.id === id);

export const addCliente = async (clienteData: Omit<Cliente, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Cliente> => {
  const newCliente = { ...clienteData, id: generateId('CLI', clientes, 'id', 3) };
  clientes.push(newCliente);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Clientes',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.clienteCreado',
    descripcionParams: { entidadNombre: newCliente.nombre },
    entidad_id: newCliente.id,
    entidad_nombre: newCliente.nombre,
    t,
  });
  return newCliente;
};

export const updateCliente = async (id: string, updates: Partial<Cliente>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Cliente | null> => {
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Clientes',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.clienteModificado',
    descripcionParams: { entidadNombre: clientes[index].nombre },
    entidad_id: clientes[index].id,
    entidad_nombre: clientes[index].nombre,
    t,
  });
  return clientes[index];
};

export const deleteCliente = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
  const clienteToDelete = clientes.find(c => c.id === id);
  if (!clienteToDelete) return false;
  const initialLength = clientes.length;
  clientes = clientes.filter(c => c.id !== id);
  const success = clientes.length < initialLength;
  if (success) {
    await addTeamActivityLog({
      usuario_id: actingUserId,
      modulo: 'Clientes',
      accion: 'eliminar',
      descripcionKey: 'teamActivity.log.clienteEliminado',
      descripcionParams: { entidadNombre: clienteToDelete.nombre },
      entidad_id: clienteToDelete.id,
      entidad_nombre: clienteToDelete.nombre,
      t,
    });
  }
  return success;
};


// Proveedores CRUD
export const getProveedores = async (): Promise<Proveedor[]> => [...proveedores];
export const getProveedorById = async (id: string): Promise<Proveedor | undefined> => proveedores.find(p => p.id === id);
export const addProveedor = async (proveedorData: Omit<Proveedor, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Proveedor> => {
  const newProveedor = { ...proveedorData, id: generateId('PRO', proveedores, 'id', 3) };
  proveedores.push(newProveedor);
   await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Proveedores',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.proveedorCreado',
    descripcionParams: { entidadNombre: newProveedor.nombre },
    entidad_id: newProveedor.id,
    entidad_nombre: newProveedor.nombre,
    t,
  });
  return newProveedor;
};
export const updateProveedor = async (id: string, updates: Partial<Proveedor>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Proveedor | null> => {
  const index = proveedores.findIndex(p => p.id === id);
  if (index === -1) return null;
  proveedores[index] = { ...proveedores[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Proveedores',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.proveedorModificado',
    descripcionParams: { entidadNombre: proveedores[index].nombre },
    entidad_id: proveedores[index].id,
    entidad_nombre: proveedores[index].nombre,
    t,
  });
  return proveedores[index];
};
export const deleteProveedor = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
   const proveedorToDelete = proveedores.find(p => p.id === id);
   if(!proveedorToDelete) return false;
   const initialLength = proveedores.length;
   proveedores = proveedores.filter(p => p.id !== id);
   const success = proveedores.length < initialLength;
   if(success){
        await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Proveedores',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.proveedorEliminado',
            descripcionParams: { entidadNombre: proveedorToDelete.nombre },
            entidad_id: proveedorToDelete.id,
            entidad_nombre: proveedorToDelete.nombre,
            t,
        });
   }
   return success;
};

// Empleados CRUD
export const getEmpleados = async (): Promise<Empleado[]> => [...empleados];
export const getEmpleadoById = async (id: string): Promise<Empleado | undefined> => empleados.find(e => e.id === id);
export const getEmpleadoByEmail = async (email: string): Promise<Empleado | undefined> => empleados.find(e => e.email.toLowerCase() === email.toLowerCase());

export const addEmpleado = async (empleadoData: Omit<Empleado, 'id' | 'isBlocked' | 'role' | 'avatarColor' | 'emailNotifications'> & {password?: string, role?: EmpleadoRole}, actingUserId?: string, t?: (key: string, params?: any) => string): Promise<Empleado> => {
  const role: EmpleadoRole = empleadoData.role || (empleados.length === 0 ? 'admin' : 'user');

  const newEmpleado: Empleado = {
    nombre: empleadoData.nombre,
    email: empleadoData.email,
    telefono: empleadoData.telefono,
    id: generateId('EMP', empleados, 'id', 3),
    role: role,
    isBlocked: false,
    password: empleadoData.password || 'password123',
    avatarColor: getNextAvatarColor(),
    bio: empleadoData.bio || '',
    emailNotifications: true,
    lastLogin: empleadoData.lastLogin || new Date().toISOString(),
  };

  empleados.push(newEmpleado);

  if(actingUserId && t){
     await addTeamActivityLog({
        usuario_id: actingUserId,
        modulo: 'Empleados',
        accion: 'crear',
        descripcionKey: 'teamActivity.log.empleadoCreado',
        descripcionParams: { entidadNombre: newEmpleado.nombre },
        entidad_id: newEmpleado.id,
        entidad_nombre: newEmpleado.nombre,
        t,
      });
  }
  return newEmpleado;
};

export const updateEmpleado = async (id: string, updates: Partial<Empleado>, actingUserId: string, t: (key: string, params?: any) => string, skipLog: boolean = false): Promise<Empleado | null> => {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) return null;

  const currentEmpleado = {...empleados[index]};
  empleados[index] = { ...currentEmpleado, ...updates };

  if (skipLog) {
    return empleados[index];
  }

  let logData: Partial<AddTeamActivityLogData> = {
    usuario_id: actingUserId,
    modulo: 'Empleados',
    entidad_id: empleados[index].id,
    entidad_nombre: empleados[index].nombre,
    t,
  };

  if (updates.bio !== undefined && updates.bio !== currentEmpleado.bio) {
    logData.modulo = 'Perfil';
    logData.accion = 'modificar';
    logData.descripcionKey = 'teamActivity.log.perfilBioActualizado';
  } else if (updates.email !== undefined && updates.email !== currentEmpleado.email) {
     logData.modulo = 'Perfil';
     logData.accion = 'modificar';
     logData.descripcionKey = 'teamActivity.log.perfilEmailActualizado';
  } else if (updates.password !== undefined && updates.password !== currentEmpleado.password) {
     logData.modulo = 'Perfil';
     logData.accion = 'modificar';
     logData.descripcionKey = 'teamActivity.log.perfilContrasenaActualizada';
  } else if (updates.emailNotifications !== undefined && updates.emailNotifications !== currentEmpleado.emailNotifications) {
     logData.modulo = 'Perfil';
     logData.accion = 'modificar';
     logData.descripcionKey = 'teamActivity.log.perfilNotificacionesActualizadas';
  } else if (updates.role && updates.role !== currentEmpleado.role) {
    logData.accion = 'asignar_rol';
    logData.descripcionKey = 'teamActivity.log.empleadoRolAsignado';
    logData.descripcionParams = { rol: t(`employees.role${updates.role.charAt(0).toUpperCase() + updates.role.slice(1)}`), entidadNombre: empleados[index].nombre };
  } else if (updates.isBlocked !== undefined && updates.isBlocked !== currentEmpleado.isBlocked) {
    logData.accion = updates.isBlocked ? 'bloquear' : 'desbloquear';
    logData.descripcionKey = updates.isBlocked ? 'teamActivity.log.empleadoBloqueado' : 'teamActivity.log.empleadoDesbloqueado';
  } else {
    const hasOtherChanges = Object.keys(updates).some(key => key !== 'lastLogin' && (updates as any)[key] !== (currentEmpleado as any)[key]);
    if (hasOtherChanges) {
        logData.accion = 'modificar';
        logData.descripcionKey = 'teamActivity.log.empleadoModificado';
    } else {
        return empleados[index];
    }
  }

  if(logData.accion && logData.descripcionKey && logData.modulo) {
    await addTeamActivityLog(logData as AddTeamActivityLogData);
  }


  return empleados[index];
};

export const deleteEmpleado = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const empleadoToDelete = empleados.find(e => e.id === id);
    if (!empleadoToDelete) return false;

    if (empleadoToDelete?.role === 'admin') {
      const adminCount = empleados.filter(e => e.role === 'admin').length;
      if (adminCount <= 1) {
        console.warn("Cannot delete the last admin.");
        throw new Error(t('employees.failDeleteLastAdmin'));
      }
    }
    const initialLength = empleados.length;
    empleados = empleados.filter(e => e.id !== id);
    const success = empleados.length < initialLength;

    if (success) {
      await addTeamActivityLog({
        usuario_id: actingUserId,
        modulo: 'Empleados',
        accion: 'eliminar',
        descripcionKey: 'teamActivity.log.empleadoEliminado',
        descripcionParams: { entidadNombre: empleadoToDelete.nombre },
        entidad_id: empleadoToDelete.id,
        entidad_nombre: empleadoToDelete.nombre,
        t,
      });
    }
    return success;
};

// Productos CRUD
export const getProductos = async (): Promise<Producto[]> => [...productos];
export const getProductoById = async (id: string): Promise<Producto | undefined> => productos.find(p => p.id === id);

export const addProducto = async (productoData: Omit<Producto, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Producto> => {
  let newProductCode = productoData.codigo;
  if (newProductCode) {
    if (productos.some(p => p.codigo === newProductCode)) {
      throw new Error(t('products.validation.codeExists', { code: newProductCode }));
    }
  } else {
    const pCodedProducts = productos.filter(p => p.codigo?.startsWith("P"));
    let maxCodeNum = 0;
    pCodedProducts.forEach(p => {
        if (p.codigo) {
            const numStr = p.codigo.replace('P', '');
            if (numStr && /^\d+$/.test(numStr)) {
                const num = parseInt(numStr, 10);
                if (num > maxCodeNum) {
                    maxCodeNum = num;
                }
            }
        }
    });
    newProductCode = `P${(maxCodeNum + 1).toString().padStart(3, '0')}`;
     if (productos.some(p => p.codigo === newProductCode)) { 
        throw new Error(t('products.validation.codeGenerationError'));
    }
  }

  const newProducto: Producto = {
    ...productoData,
    id: generateId('PROD', productos, 'id', 3),
    codigo: newProductCode,
  };
  productos.push(newProducto);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Productos',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.productoCreado',
    descripcionParams: { entidadNombre: newProducto.nombre },
    entidad_id: newProducto.id,
    entidad_nombre: newProducto.nombre,
    t,
  });
  return newProducto;
};

export const updateProducto = async (id: string, updates: Partial<Producto>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Producto | null> => {
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return null;

  if (updates.codigo && updates.codigo !== productos[index].codigo) {
    if (productos.some(p => p.id !== id && p.codigo === updates.codigo)) {
      throw new Error(t('products.validation.codeExists', { code: updates.codigo }));
    }
  }

  productos[index] = { ...productos[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Productos',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.productoModificado',
    descripcionParams: { entidadNombre: productos[index].nombre },
    entidad_id: productos[index].id,
    entidad_nombre: productos[index].nombre,
    t,
  });
  return productos[index];
};
export const deleteProducto = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const productoToDelete = productos.find(p => p.id === id);
    if(!productoToDelete) return false;
    const initialLength = productos.length;
    productos = productos.filter(p => p.id !== id);
    const success = productos.length < initialLength;
    if(success){
         await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Productos',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.productoEliminado',
            descripcionParams: { entidadNombre: productoToDelete.nombre },
            entidad_id: productoToDelete.id,
            entidad_nombre: productoToDelete.nombre,
            t,
        });
    }
    return success;
};


// Almacenes CRUD
export const getAlmacenes = async (): Promise<Almacen[]> => [...almacenes];
export const getAlmacenById = async (id: string): Promise<Almacen | undefined> => almacenes.find(a => a.id === id);
export const addAlmacen = async (almacenData: Omit<Almacen, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Almacen> => {
  const newAlmacen = { ...almacenData, id: generateId('ALM', almacenes, 'id', 3) };
  almacenes.push(newAlmacen);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Almacén',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.almacenCreado',
    descripcionParams: { entidadNombre: newAlmacen.nombre },
    entidad_id: newAlmacen.id,
    entidad_nombre: newAlmacen.nombre,
    t,
  });
  return newAlmacen;
};
export const updateAlmacen = async (id: string, updates: Partial<Almacen>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Almacen | null> => {
  const index = almacenes.findIndex(a => a.id === id);
  if (index === -1) return null;
  almacenes[index] = { ...almacenes[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Almacén',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.almacenModificado',
    descripcionParams: { entidadNombre: almacenes[index].nombre },
    entidad_id: almacenes[index].id,
    entidad_nombre: almacenes[index].nombre,
    t,
  });
  return almacenes[index];
};
export const deleteAlmacen = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const almacenToDelete = almacenes.find(a => a.id === id);
    if(!almacenToDelete) return false;
    const initialLength = almacenes.length;
    almacenes = almacenes.filter(a => a.id !== id);
    const success = almacenes.length < initialLength;
    if(success){
        await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Almacén',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.almacenEliminado',
            descripcionParams: { entidadNombre: almacenToDelete.nombre },
            entidad_id: almacenToDelete.id,
            entidad_nombre: almacenToDelete.nombre,
            t,
        });
    }
    return success;
};

// Facturas
export const getFacturas = async (): Promise<Factura[]> => {
  return facturas.map(f => ({
    ...f,
    clienteNombre: f.clienteId ? clientes.find(c=>c.id === f.clienteId)?.nombre : undefined,
    proveedorNombre: f.proveedorId ? proveedores.find(p=>p.id === f.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === f.empleadoId)?.nombre,
    detalles: f.detalles.map(d => ({
      ...d,
      productoNombre: productos.find(p=>p.id === d.productoId)?.nombre
    }))
  }));
};

export const getFacturaById = async (id: string): Promise<Factura | undefined> => {
  const factura = facturas.find(f => f.id === id);
  if (!factura) return undefined;
  return {
    ...factura,
    clienteNombre: factura.clienteId ? clientes.find(c=>c.id === factura.clienteId)?.nombre : undefined,
    proveedorNombre: factura.proveedorId ? proveedores.find(p=>p.id === factura.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === factura.empleadoId)?.nombre,
    detalles: factura.detalles.map(d => ({
      ...d,
      productoNombre: productos.find(p=>p.id === d.productoId)?.nombre
    }))
  };
};

const generateDetalleId = (facturaId: string, index: number) => `${facturaId}-DET${(index + 1).toString().padStart(3, '0')}`;

const adjustStock = (productoId: string, cantidad: number, tipoAjuste: 'increment' | 'decrement', t: (key: string, params?: any) => string) => {
  const productoIndex = productos.findIndex(p => p.id === productoId);
  if (productoIndex !== -1) {
    if (tipoAjuste === 'increment') {
      productos[productoIndex].stock += cantidad;
    } else {
      if (productos[productoIndex].stock < cantidad) {
         throw new Error(t('facturas.validation.insufficientStock', {
            productName: productos[productoIndex].nombre,
            availableStock: productos[productoIndex].stock,
            requestedQuantity: cantidad
        }));
      }
      productos[productoIndex].stock -= cantidad;
    }
  } else {
    throw new Error(t('facturas.validation.productNotFound', { productId: productId }));
  }
};

export const addFactura = async (facturaData: Omit<Factura, 'id' | 'clienteNombre' | 'proveedorNombre' | 'empleadoNombre' >, actingUserId: string, t: (key: string, params?: any) => string): Promise<Factura> => {
  if (facturaData.tipo === 'Venta' && facturaData.estado !== 'Cancelada') {
    for (const detalle of facturaData.detalles) {
      const producto = productos.find(p => p.id === detalle.productoId);
      if (!producto) throw new Error(t('facturas.validation.productNotFound', {productId: detalle.productoId}));
      if (producto.stock < detalle.cantidad) {
        throw new Error(t('facturas.validation.insufficientStock', {productName: producto.nombre, availableStock: producto.stock, requestedQuantity: detalle.cantidad}));
      }
    }
  }

  const yearPrefix = facturaData.tipo === 'Venta' ? 'FV' : 'FC';
  const year = new Date(facturaData.fecha).getFullYear();
  const yearFacturas = facturas.filter(f => f.id.startsWith(`${yearPrefix}${year}-`));
  const nextIdNum = yearFacturas.length > 0 ? Math.max(...yearFacturas.map(f => parseInt(f.id.split('-')[1])).filter(num => !isNaN(num))) + 1 : 1;
  const newId = `${yearPrefix}${year}-${nextIdNum.toString().padStart(5, '0')}`;

  const processedDetalles = facturaData.detalles.map((d, index) => {
    const producto = productos.find(p => p.id === d.productoId);
    const subtotal = d.cantidad * d.precioUnitario;
    const subtotalConIva = subtotal * (1 + d.porcentajeIva / 100);
    return {
      ...d,
      id: d.id || generateDetalleId(newId, index),
      productoNombre: producto?.nombre,
      subtotal: parseFloat(subtotal.toFixed(2)),
      subtotalConIva: parseFloat(subtotalConIva.toFixed(2)),
    };
  });

  const baseImponible = processedDetalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
  const totalIva = processedDetalles.reduce((sum, d) => sum + ((d.subtotalConIva || 0) - (d.subtotal || 0)), 0);

  const newFactura: Factura = {
    ...facturaData,
    id: newId,
    detalles: processedDetalles,
    baseImponible: parseFloat(baseImponible.toFixed(2)),
    totalIva: parseFloat(totalIva.toFixed(2)),
    totalFactura: parseFloat((baseImponible + totalIva).toFixed(2)),
  };
  facturas.push(newFactura);

  // Adjust stock based on invoice type and status
  if (newFactura.tipo === 'Venta' && newFactura.estado !== 'Cancelada') {
    newFactura.detalles.forEach(detalle => adjustStock(detalle.productoId, detalle.cantidad, 'decrement', t));
  } else if (newFactura.tipo === 'Compra' && newFactura.estado === 'Pagada') {
    newFactura.detalles.forEach(detalle => adjustStock(detalle.productoId, detalle.cantidad, 'increment', t));
  }

  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.facturaCreada',
    descripcionParams: {
        entidadNombre: newFactura.id,
        tipoFactura: t(newFactura.tipo === 'Venta' ? 'facturas.typeSale' : 'facturas.typePurchase'),
        clienteProveedorNombre: newFactura.tipo === 'Venta' ? clientes.find(c => c.id === newFactura.clienteId)?.nombre : proveedores.find(p => p.id === newFactura.proveedorId)?.nombre
    },
    entidad_id: newFactura.id,
    t,
  });
  return newFactura;
};


export const updateFactura = async (id: string, updates: Partial<Factura>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Factura | null> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return null;

  const originalFactura = { ...facturas[index], detalles: [...facturas[index].detalles.map(d => ({...d}))] };
  
  // Apply updates to create the tentative new state of the invoice
  const tentativeUpdatedFactura: Factura = {
    ...originalFactura,
    ...updates,
    detalles: updates.detalles ? updates.detalles.map((d, idx) => {
        const producto = productos.find(p => p.id === d.productoId);
        const subtotal = d.cantidad * d.precioUnitario;
        const subtotalConIva = subtotal * (1 + d.porcentajeIva / 100);
        return {
            ...d,
            id: d.id || generateDetalleId(id, idx),
            productoNombre: producto?.nombre,
            subtotal: parseFloat(subtotal.toFixed(2)),
            subtotalConIva: parseFloat(subtotalConIva.toFixed(2)),
        };
    }) : [...originalFactura.detalles],
  };

  // Recalculate totals for the updated invoice
  const newBaseImponible = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
  const newTotalIva = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + ((d.subtotalConIva || 0) - (d.subtotal || 0)), 0);
  tentativeUpdatedFactura.baseImponible = parseFloat(newBaseImponible.toFixed(2));
  tentativeUpdatedFactura.totalIva = parseFloat(newTotalIva.toFixed(2));
  tentativeUpdatedFactura.totalFactura = parseFloat((newBaseImponible + newTotalIva).toFixed(2));

  // --- Stock Adjustment Logic ---
  // 1. Revert original stock effect (if it was one that affected stock)
  if (originalFactura.tipo === 'Venta' && originalFactura.estado !== 'Cancelada') {
    originalFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'increment', t));
  } else if (originalFactura.tipo === 'Compra' && originalFactura.estado === 'Pagada') {
    originalFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'decrement', t));
  }

  // 2. Apply new stock effect (if it's one that affects stock)
  if (tentativeUpdatedFactura.tipo === 'Venta' && tentativeUpdatedFactura.estado !== 'Cancelada') {
    // Before decrementing, ensure sufficient stock for all items. If not, revert the reversion and throw error.
    for (const detalle of tentativeUpdatedFactura.detalles) {
      const currentStockForProduct = productos.find(p => p.id === detalle.productoId)?.stock || 0;
      if (currentStockForProduct < detalle.cantidad) {
        // Revert the stock reversion done in step 1 before throwing error
        if (originalFactura.tipo === 'Venta' && originalFactura.estado !== 'Cancelada') {
          originalFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'decrement', t)); // Re-decrement
        } else if (originalFactura.tipo === 'Compra' && originalFactura.estado === 'Pagada') {
          originalFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'increment', t)); // Re-increment
        }
        throw new Error(t('facturas.validation.insufficientStock', {
          productName: productos.find(p => p.id === detalle.productoId)?.nombre || detalle.productoId,
          availableStock: currentStockForProduct,
          requestedQuantity: detalle.cantidad
        }));
      }
    }
    // If all checks pass, decrement stock
    tentativeUpdatedFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'decrement', t));
  } else if (tentativeUpdatedFactura.tipo === 'Compra' && tentativeUpdatedFactura.estado === 'Pagada') {
    tentativeUpdatedFactura.detalles.forEach(d => adjustStock(d.productoId, d.cantidad, 'increment', t));
  }
  // If the invoice is now 'Cancelada', stock reversion (if applicable) was handled in step 1.
  // No new stock effect is applied for 'Cancelada' invoices.
  // --- End Stock Adjustment Logic ---

  facturas[index] = tentativeUpdatedFactura; // Save the updated invoice

  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.facturaModificada',
    descripcionParams: { entidadNombre: facturas[index].id },
    entidad_id: facturas[index].id,
    entidad_nombre: facturas[index].id,
    t,
  });

  const updatedFactura = facturas[index];
  return { // Return the fully populated invoice object for UI update
    ...updatedFactura,
    clienteNombre: updatedFactura.clienteId ? clientes.find(c=>c.id === updatedFactura.clienteId)?.nombre : undefined,
    proveedorNombre: updatedFactura.proveedorId ? proveedores.find(p=>p.id === updatedFactura.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === updatedFactura.empleadoId)?.nombre,
  };
};

export const deleteFactura = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return false;

  const facturaToDelete = facturas[index];

  // Revert stock changes if the invoice was affecting stock
  if (facturaToDelete.tipo === 'Venta' && facturaToDelete.estado !== 'Cancelada') {
    facturaToDelete.detalles.forEach(detalle => adjustStock(detalle.productoId, detalle.cantidad, 'increment', t));
  } else if (facturaToDelete.tipo === 'Compra' && facturaToDelete.estado === 'Pagada') {
    facturaToDelete.detalles.forEach(detalle => adjustStock(detalle.productoId, detalle.cantidad, 'decrement', t));
  }

  facturas.splice(index, 1);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'eliminar',
    descripcionKey: 'teamActivity.log.facturaEliminada',
    descripcionParams: { entidadNombre: facturaToDelete.id },
    entidad_id: facturaToDelete.id,
    t,
  });
  return true;
};


// For dashboard summaries
export const getRecentSales = async (limit: number = 3): Promise<Array<{id: string, customer: string, amount: number, date: string, currency: CurrencyCode}>> => {
  return facturas
    .filter(f => f.tipo === 'Venta' && f.estado !== 'Cancelada')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      customer: f.clienteNombre || clientes.find(c => c.id === f.clienteId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
      currency: f.moneda,
    }));
};

export const getRecentOrders = async (limit: number = 2): Promise<Array<{id: string, supplier: string, amount: number, date: string, currency: CurrencyCode}>> => {
   return facturas
    .filter(f => f.tipo === 'Compra' && f.estado !== 'Cancelada')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      supplier: f.proveedorNombre || proveedores.find(p => p.id === f.proveedorId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
      currency: f.moneda,
    }));
};

export const getWarehouseStatus = async (): Promise<Array<{name: string, capacity: string, items: number, location: string }>> => {
  if (almacenes.length === 0) return [];
  // Simplified: calculate total stock and distribute somewhat evenly for demo
  const totalSystemStock = productos.reduce((sum, p) => sum + p.stock, 0);
  const itemsPerWarehouse = almacenes.length > 0 ? Math.floor(totalSystemStock / almacenes.length) : 0;
  
  return almacenes.map((alm, index) => ({
    name: alm.nombre,
    capacity: alm.capacidad || 'N/A',
    // Distribute remaining stock to the last warehouse for a bit of variation
    items: index === almacenes.length - 1 ? totalSystemStock - (itemsPerWarehouse * (almacenes.length -1)) : itemsPerWarehouse,
    location: alm.ubicacion || 'N/A',
  }));
};


export const getTotalStockValue = async (): Promise<{totalStock: number, totalRevenue: number, salesCount: number}> => {
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const totalRevenue = facturas
      .filter(f => f.tipo === 'Venta' && f.estado === 'Pagada') // Only count paid sales invoices for revenue
      .reduce((sum, f) => {
        if (f.moneda === 'EUR') return sum + f.totalFactura;
        if (f.moneda === 'USD') return sum + f.totalFactura / 1.08; // USD to EUR approx
        if (f.moneda === 'GBP') return sum + f.totalFactura / 0.85; // GBP to EUR approx
        return sum + f.totalFactura; // Fallback
      }, 0);
    const salesCount = facturas.filter(f => f.tipo === 'Venta' && f.estado !== 'Cancelada').length; // Count non-cancelled sales
    return { totalStock, totalRevenue, salesCount };
};


export const getTeamActivityLogs = async (limit: number = LOG_LIMIT): Promise<TeamActivityLog[]> => {
  return [...teamActivityLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

// Notification Configurations CRUD
export const getNotificationConfigs = async (): Promise<NotificationConfig[]> => {
  return notificationConfigs.map(nc => ({
    ...nc,
    createdByName: empleados.find(e => e.id === nc.createdBy)?.nombre || 'Unknown User'
  }));
};

export const getNotificationConfigById = async (id: string): Promise<NotificationConfig | undefined> => {
  const config = notificationConfigs.find(nc => nc.id === id);
  if (!config) return undefined;
  return {
    ...config,
    createdByName: empleados.find(e => e.id === config.createdBy)?.nombre || 'Unknown User'
  }
};

export const addNotificationConfig = async (
  configData: Omit<NotificationConfig, 'id' | 'createdAt' | 'lastSent' | 'createdByName'>,
  actingUserId: string,
  t: (key: string, params?: any) => string
): Promise<NotificationConfig> => {
  const creator = await getEmpleadoById(actingUserId);
  const newConfig: NotificationConfig = {
    ...configData,
    id: generateId('NOTIF', notificationConfigs, 'id', 3),
    createdAt: new Date().toISOString(),
    createdBy: actingUserId,
    createdByName: creator?.nombre || 'System',
    isEnabled: true,
  };
  notificationConfigs.push(newConfig);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Notificaciones',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.notificationConfigCreated',
    descripcionParams: { entidadNombre: newConfig.title },
    entidad_id: newConfig.id,
    entidad_nombre: newConfig.title,
    t,
  });
  return newConfig;
};

export const updateNotificationConfig = async (
  id: string,
  updates: Partial<Omit<NotificationConfig, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>>,
  actingUserId: string,
  t: (key: string, params?: any) => string
): Promise<NotificationConfig | null> => {
  const index = notificationConfigs.findIndex(nc => nc.id === id);
  if (index === -1) return null;
  notificationConfigs[index] = { ...notificationConfigs[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Notificaciones',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.notificationConfigUpdated',
    descripcionParams: { entidadNombre: notificationConfigs[index].title },
    entidad_id: notificationConfigs[index].id,
    entidad_nombre: notificationConfigs[index].title,
    t,
  });
  return {
    ...notificationConfigs[index],
    createdByName: empleados.find(e => e.id === notificationConfigs[index].createdBy)?.nombre || 'Unknown User'
  };
};

export const deleteNotificationConfig = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
  const configToDelete = notificationConfigs.find(nc => nc.id === id);
  if (!configToDelete) return false;
  const initialLength = notificationConfigs.length;
  notificationConfigs = notificationConfigs.filter(nc => nc.id !== id);
  const success = notificationConfigs.length < initialLength;
  if (success) {
    await addTeamActivityLog({
      usuario_id: actingUserId,
      modulo: 'Notificaciones',
      accion: 'eliminar',
      descripcionKey: 'teamActivity.log.notificationConfigDeleted',
      descripcionParams: { entidadNombre: configToDelete.title },
      entidad_id: configToDelete.id,
      entidad_nombre: configToDelete.title,
      t,
    });
  }
  return success;
};

export const sendNotificationByConfig = async (configId: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<{success: boolean, message?: string}> => {
  const config = await getNotificationConfigById(configId);
  if (!config) {
    return { success: false, message: t('notifications.configNotFound') };
  }

  const allUsers = await getEmpleados();
  const targetUsers = allUsers.filter(emp => {
    if (!emp.emailNotifications) return false; // Check if user wants notifications
    if (config.targetRoles.includes('all')) return true;
    return config.targetRoles.some(targetRole => emp.role === targetRole);
  });

  if (targetUsers.length === 0) {
    return { success: false, message: t('notifications.noTargetUsers') };
  }

  // Simulate sending email
  targetUsers.forEach(emp => {
    console.log(`Simulated email sent to ${emp.email}:`);
    console.log(`Subject: ${config.title}`);
    console.log(`Body: ${config.message}`);
  });

  const now = new Date().toISOString();
  const updatedFields: Partial<NotificationConfig> = { lastSent: now };
  // Only disable 'once' notifications after sending. Recurring ones remain enabled until manually disabled.
  if (config.frequency === 'once') {
    updatedFields.isEnabled = false; 
  }

  await updateNotificationConfig(config.id, updatedFields, actingUserId, t);

  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Notificaciones',
    accion: 'enviar',
    descripcionKey: 'teamActivity.log.notificationSent',
    descripcionParams: { entidadNombre: config.title, count: targetUsers.length },
    entidad_id: config.id,
    entidad_nombre: config.title,
    t,
  });

  return { success: true, message: t('notifications.sentSuccess', {count: targetUsers.length})};
};
