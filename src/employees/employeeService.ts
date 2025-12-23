import { httpClient } from "../api/httpClient";
import type { ApiResult, EmployeeDto, EmployeeLookupDto, PagedResult } from "../shared/types";

export async function getEmployees(page: number, pageSize: number, search: string) {
  const { data } = await httpClient.get<ApiResult<PagedResult<EmployeeDto>>>(
    "/api/employees",
    { params: { page, pageSize, search: search || undefined } }
  );
  return data;
}

export async function getEmployeeById(id: string) {
  const { data } = await httpClient.get<ApiResult<EmployeeDto>>(`/api/employees/${id}`);
  return data;
}

export async function lookupEmployees(search: string, limit = 20) {
  const { data } = await httpClient.get<ApiResult<EmployeeLookupDto[]>>(
    "/api/employees/lookup",
    { params: { search, limit } }
  );
  return data;
}

export async function createEmployee(payload: any) {
  const { data } = await httpClient.post<ApiResult<EmployeeDto>>("/api/employees", payload);
  return data;
}

export async function updateEmployee(id: string, payload: any) {
  const { data } = await httpClient.put<ApiResult<null>>(`/api/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: string) {
  const { data } = await httpClient.delete<ApiResult<null>>(`/api/employees/${id}`);
  return data;
}
