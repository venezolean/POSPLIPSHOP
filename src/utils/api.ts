// src/utils/api.ts
import { supabase } from '../lib/supabase';
import type {ProductoRegistro, ProductoBusqueda, RegistrarVentaParams, InventoryItemAd, Customer, VentaRPC, PaymentDetail, CierreCaja } from './types';

export async function fetchSuggestions(term: string): Promise<ProductoBusqueda[]> {
  const { data, error } = await supabase
    .rpc('buscar_productos', { term });
  if (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
  return data as ProductoBusqueda[];
}

//Registrar ventas

export async function registrarVenta(params: RegistrarVentaParams): Promise<number | null> {
  const { data, error } = await supabase.rpc('registrar_venta', {
    ...params,
    p_detalles: params.p_detalles,
    p_pagos: params.p_pagos,
  });

  if (error) {
    console.error('Error al registrar venta:', error.message);
    return null;
  }

  return data; // Devuelve el ID de la venta registrada
}



//inventario avanzado

export async function fetchInventarioAvanzado(
  term: string = '',
  stockFilter: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' = 'all',
  categoria: string | null = null,
  subcategoria: string | null = null,
  rubro: string | null = null,
  temporada: string | null = null
): Promise<InventoryItemAd[]> {
  const { data, error } = await supabase.rpc('buscar_inventario_avanzado', {
    term,
    stock_filter: stockFilter,
    p_categoria: categoria,
    p_subcategoria: subcategoria,
    p_rubro: rubro,
    p_temporada: temporada,
  });

  if (error) {
    console.error('Error al obtener inventario:', error.message);
    return [];
  }

  return data as InventoryItemAd[];
}




export async function fetchOpcionesFiltros(): Promise<{
  rubros: string[];
  categorias: string[];
  subcategorias: string[];
  temporadas: string[];
}> {
  const { data, error } = await supabase.rpc('obtener_opciones_filtros');

  if (error) {
    console.error('Error al obtener filtros:', error.message);
    return { rubros: [], categorias: [], subcategorias: [], temporadas: [] };
  }

  return data;
}



export async function fetchUpsertInventario(item: Partial<InventoryItemAd> & { id: number }) {
  const { error } = await supabase
    .from('inventario')
    .update({
      stock: item.stock,
      precio: item.precio,
      link: item.link,
      updated_at: new Date().toISOString(),
    })
    .eq('id', item.id);

  if (error) {
    console.error(`Error al guardar el item con ID ${item.id}`, error);
    alert(`Error al guardar cambios para el item con ID ${item.id}`);
  } else {
    console.log(`Cambios guardados correctamente para ID ${item.id}`);
  }
}


// buscar cliente

export async function fetchCustomerByDocument(document: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .rpc('buscar_cliente_por_documento', { p_documento: document });

  if (error) {
    console.error('Error al buscar cliente:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.log('No se encontró ningún cliente con ese documento');
    return null;
  }

  const cliente = data[0]; // 👈 accedemos al primer resultado

  console.log('Cliente encontrado:', cliente);

  const tipo = cliente.tipo === 'juridico' ? 'juridico' : 'natural';
  const nombre = cliente.nombre || '';
  const apellido = cliente.apellido || '';
  const razonSocial = cliente.razon_social || '';
  const documento = cliente.dni || cliente.cuit || '';

  return {
    id: String(cliente.id),
    type: tipo,
    name: nombre,
    lastName: apellido,
    document: documento,
    businessName: razonSocial,
    phone: cliente.telefono || '',
    email: cliente.email || '',
    address: cliente.direccion || '',
  };
}


export async function registrarCliente(params: {
  tipo: 'natural' | 'juridico';
  email: string;
  nombre?: string | null;
  apellido?: string | null;
  razon_social?: string | null;
  dni?: string | null;
  cuit?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  created_by: string;
}): Promise<number | null> {
  const { data, error } = await supabase.rpc('insertar_cliente', {
    p_tipo: params.tipo,
    p_email: params.email,
    p_nombre: params.nombre,
    p_apellido: params.apellido,
    p_razon_social: params.razon_social,
    p_dni: params.dni,
    p_cuit: params.cuit,
    p_telefono: params.telefono,
    p_direccion: params.direccion,
    p_created_by: params.created_by,
  });

  if (error) {
    console.error('Error al registrar cliente:', error.message);
    return null;
  }

  return data; // devuelve el id del cliente
}


//registrar producto

export async function registrarProducto(params: ProductoRegistro): Promise<number | null> {
  const { data, error } = await supabase.rpc('registrar_producto', params);

  if (error) {
    console.error('Error al registrar producto:', error.message);
    return null;
  }

  return data; // Devuelve el ID del producto registrado
}


// buscador de presupuestos api/ventas.ts (usando fetch)

export async function buscarPresupuestos(term: string): Promise<VentaRPC[]> {
  const termino = term.trim()

  // Llamás al RPC sin genéricos
  const { data, error } = await supabase
    .rpc('buscar_ventas_presupuesto', { termino })

  if (error) {
    console.error('[buscarPresupuestos] RPC error:', error)
    throw new Error(error.message)
  }

  // Data viene como any[] | null, se la casteamos
  return (data as VentaRPC[]) ?? []
}


export async function actualizarPresupuestoVenta(
  presupuestoId: number,
  pagos: PaymentDetail[],
): Promise<void> {
  // 1) Actualizar el estado de la venta (presupuesto → entregado o pagado)
  const { error: errV } = await supabase
    .from('ventas')
    .update({ estado: 'presupuesto pagado' })        // o 'pagado', según tu lógica
    .eq('id', presupuestoId);

  if (errV) throw errV;

  // 2) Insertar los pagos asociados
  const pagosInsert = pagos.map(p => ({
    venta_id: presupuestoId,
    metodo: p.method,
    monto: p.amount,
    created_at: new Date().toISOString(),
  }));

  const { error: errP } = await supabase
    .from('pagos')
    .insert(pagosInsert);

  if (errP) throw errP;
}



// trae la última apertura (o falla si no existe)
export async function getAperturaCaja(userId: string) {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as { monto: number; created_at: string };
}

export async function registrarAperturaCaja({
  userId,
  monto,
}: {
  userId: string;
  monto: number;
}) {
  const { data, error } = await supabase
    .from('apertura_caja')
    .insert({ user_id: userId, monto });
  if (error) throw error;
  return data;
}


export async function getCierreCaja(userId: string): Promise<CierreCaja> {
  // 1) Llamás al RPC sin genéricos
  const { data, error } = await supabase
    .rpc('get_cierre_caja', { p_user_id: userId })

  // 2) Manejo de error
  if (error) {
    console.error('[getCierreCaja] RPC error:', error)
    throw new Error(error.message)
  }

  // 3) Cast y validación de datos
  const rows = (data as CierreCaja[]) ?? []
  if (rows.length === 0) {
    throw new Error('No se encontró cierre de caja para este usuario.')
  }

  // 4) Devolvés el primer (y único) registro
  return rows[0]
}



export async function registrarCierreCaja({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<void> {
  const { error } = await supabase.rpc('registrar_cierre_caja', {
    p_user_id: userId,
    p_monto_cierre: amount,
  });
  if (error) {
    console.error('[registrarCierreCaja] RPC error:', error);
    throw error;
  }
}
