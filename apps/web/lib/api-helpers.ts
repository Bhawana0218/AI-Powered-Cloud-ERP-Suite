import api from './api';

export function extractData(res: any, fallback: any = []) {
  if (!res?.data) return fallback;
  const d = res.data;
  return d.data ?? d.contacts ?? d.deals ?? d.products ?? d.invoices ?? d.employees ?? d.departments ?? d.projects ?? d.tasks ?? d.pipeline ?? d.stats ?? d.forecasts ?? d.vendors ?? d;
}

export function extractTotalPages(res: any, defaultLimit = 10) {
  if (!res?.data) return 1;
  const d = res.data;
  const total = d.total ?? d.totalPages ?? 0;
  const limit = d.limit ?? defaultLimit;
  return total > 0 ? Math.ceil(total / limit) : 1;
}

export function extractTotal(res: any) {
  return res?.data?.total ?? 0;
}

export async function apiGet<T = any>(url: string, params?: any): Promise<{ data: T[]; total: number; page: number }> {
  try {
    const res = await api.get(url, { params });
    return {
      data: extractData(res) as T[],
      total: extractTotal(res),
      page: res?.data?.page ?? 1,
    };
  } catch (err: any) {
    console.error(`API GET ${url} failed:`, err?.message);
    return { data: [], total: 0, page: 1 };
  }
}

export async function apiGetOne<T = any>(url: string): Promise<T | null> {
  try {
    const res = await api.get(url);
    return res.data as T;
  } catch (err: any) {
    console.error(`API GET ${url} failed:`, err?.message);
    return null;
  }
}

export async function apiPost<T = any>(url: string, body: any): Promise<T | null> {
  try {
    const res = await api.post(url, body);
    return res.data as T;
  } catch (err: any) {
    console.error(`API POST ${url} failed:`, err?.response?.data?.message || err?.message);
    throw err;
  }
}

export async function apiPatch<T = any>(url: string, body: any): Promise<T | null> {
  try {
    const res = await api.patch(url, body);
    return res.data as T;
  } catch (err: any) {
    console.error(`API PATCH ${url} failed:`, err?.response?.data?.message || err?.message);
    throw err;
  }
}

export async function apiDelete(url: string): Promise<boolean> {
  try {
    await api.delete(url);
    return true;
  } catch (err: any) {
    console.error(`API DELETE ${url} failed:`, err?.response?.data?.message || err?.message);
    throw err;
  }
}
