// src/utils/api.ts
import { supabase } from '../lib/supabase';
import type { ProductoBusqueda, RegistrarVentaParams, InventoryItemAd, Customer } from './types';

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
