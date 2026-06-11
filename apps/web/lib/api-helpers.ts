import api from './api';

function unwrapPayload(res: any) {
  if (!res?.data) return res;
  const d = res.data;
  if (d && typeof d === 'object' && 'success' in d) {
    return d.data ?? d;
  }
  return d;
}

export function extractData(res: any, fallback: any = []) {
  const payload = unwrapPayload(res);
  if (!payload) return fallback;
  return payload.data ?? payload.contacts ?? payload.deals ?? payload.products ?? payload.invoices ?? payload.employees ?? payload.departments ?? payload.projects ?? payload.tasks ?? payload.pipeline ?? payload.stats ?? payload.forecasts ?? payload.vendors ?? payload;
}

export function extractTotalPages(res: any, defaultLimit = 10) {
  const payload = unwrapPayload(res);
  if (!payload) return 1;
  const total = payload.total ?? payload.totalPages ?? 0;
  const limit = payload.limit ?? defaultLimit;
  return total > 0 ? Math.ceil(total / limit) : 1;
}

export function extractTotal(res: any) {
  const payload = unwrapPayload(res);
  return payload?.total ?? 0;
}

export async function apiGet<T = any>(url: string, params?: any): Promise<{ data: T[]; total: number; page: number }> {
  try {
    const res = await api.get(url, { params });
    const payload = unwrapPayload(res);
    return {
      data: extractData(res) as T[],
      total: extractTotal(res),
      page: payload?.page ?? 1,
    };
  } catch (err: any) {
    if (err?.response?.status !== 401) {
      console.error(`API GET ${url} failed:`, err?.message);
    }
    return { data: [], total: 0, page: 1 };
  }
}

export async function apiGetOne<T = any>(url: string): Promise<T | null> {
  try {
    const res = await api.get(url);
    return unwrapPayload(res) as T;
  } catch (err: any) {
    if (err?.response?.status !== 401) {
      console.error(`API GET ${url} failed:`, err?.message);
    }
    return null;
  }
}

export async function apiPost<T = any>(url: string, body: any): Promise<T | null> {
  try {
    const res = await api.post(url, body);
    return unwrapPayload(res) as T;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Request failed';
    console.error(`API POST ${url} failed:`, msg);
    throw err;
  }
}

export async function apiPatch<T = any>(url: string, body: any): Promise<T | null> {
  try {
    const res = await api.patch(url, body);
    return unwrapPayload(res) as T;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Request failed';
    console.error(`API PATCH ${url} failed:`, msg);
    throw err;
  }
}

export async function apiDelete(url: string): Promise<boolean> {
  try {
    const res = await api.delete(url);
    const payload = unwrapPayload(res);
    return payload?.deleted ?? true;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Request failed';
    console.error(`API DELETE ${url} failed:`, msg);
    throw err;
  }
}
