import { httpClient } from "../api/httpClient";
import type { ApiResult, LoginResponse } from "../shared/types";

export async function login(email: string, password: string) {

  const { data } = await httpClient.post<ApiResult<LoginResponse>>(
    "/api/auth/login",
    { 
        email, 
        password 
    }
  );
  return data;
}
