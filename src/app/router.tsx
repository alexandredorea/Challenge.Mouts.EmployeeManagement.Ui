import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { EmployeeListPage } from "../employees/EmployeeListPage";
import { EmployeeFormPage } from "../employees/EmployeeFormPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/employees",
    element: (
      <ProtectedRoute>
        <EmployeeListPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/employees/new",
    element: (
      <ProtectedRoute>
        <EmployeeFormPage mode="create" />
      </ProtectedRoute>
    )
  },
  {
    path: "/employees/:id/edit",
    element: (
      <ProtectedRoute>
        <EmployeeFormPage mode="edit" />
      </ProtectedRoute>
    )
  },
  { path: "*", element: <LoginPage /> }
]);
