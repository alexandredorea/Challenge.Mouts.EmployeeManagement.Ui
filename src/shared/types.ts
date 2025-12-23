export type ApiError = { 
  code: string; 
  message: string 
};

export type ApiResult<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiError[];
};

export type EmployeeRole = "Employee" | "Leader" | "Director";

export type LoginResponse = { 
  accessToken: string; 
  tokenType: string;
  expiresInMinutes: number;
  employee: EmployeeDto;
};

export type MeDto = { 
  id: string; 
  email: string; 
  role: EmployeeRole 
};

export type EmployeeDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  docNumber: string;
  birthDate: string; // YYYY-MM-DD
  role: EmployeeRole;
  managerId: string | null;
  phones: string[];
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type EmployeeLookupDto = { 
  id: string; 
  fullName: string 
};

