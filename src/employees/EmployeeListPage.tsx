import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { deleteEmployee, getEmployees } from "./employeeService";
import type { EmployeeDto } from "../shared/types";

export function EmployeeListPage() {
  const auth = useAuth();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EmployeeDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees(page, pageSize, search);
      if (!res.success || !res.data) {
        setError(res.message || "Erro ao carregar.");
        setItems([]);
        return;
      }
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    await load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    const res = await deleteEmployee(id);
    if (!res.success) {
      alert(res.message);
      return;
    }
    await load();
  };

  return (
    <div className="page">
      <div className="row">
        <h1>Employees</h1>

        <div className="row">
          <Link className="btn" to="/employees/new">Novo</Link>
          <button className="btn secondary" onClick={auth.logout}>Logout</button>
        </div>
      </div>

      <div className="hint">
        Logado como: {auth.currentUser?.email} (role: {auth.currentUser?.role})
      </div>

      <form className="row" onSubmit={onSearch}>
        <input
          placeholder="Buscar por nome/email/doc..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn" type="submit">Buscar</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="hint">Carregando...</div>}

      <div className="table">
        <div className="thead">
          <div>Nome</div>
          <div>Email</div>
          <div>Doc</div>
          <div>Role</div>
          <div>Ações</div>
        </div>

        {items.map((e) => (
          <div className="trow" key={e.id}>
            <div>{e.firstName} {e.lastName}</div>
            <div>{e.email}</div>
            <div>{e.docNumber}</div>
            <div>{e.role}</div>
            <div className="row" style={{ justifyContent: "flex-start" }}>
              <Link className="btn secondary" to={`/employees/${e.id}/edit`}>Editar</Link>
              <button className="btn danger" type="button" onClick={() => onDelete(e.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ justifyContent: "flex-start" }}>
        <button className="btn secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          Anterior
        </button>
        <div className="hint">Página {page} / {totalPages}</div>
        <button className="btn secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}
