import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createEmployee, getEmployeeById, updateEmployee } from "./employeeService";
import { ManagerPicker } from "./ManagerPicker";
import type { EmployeeDto } from "../shared/types";

function isAdult(dateIso: string) {
  const dob = new Date(dateIso + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18;
}

export function EmployeeFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const nav = useNavigate();
  const auth = useAuth();

  const isEdit = mode === "edit";
  const title = useMemo(() => (isEdit ? "Editar Employee" : "Novo Employee"), [isEdit]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1990-01-01");
  const [managerId, setManagerId] = useState<string | null>(null);
  const [phones, setPhones] = useState<string[]>(["", ""]);

  const [readOnlyRole, setReadOnlyRole] = useState<string>("Employee");

  useEffect(() => {
    if (!isEdit) return;
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEmployeeById(id);
        if (!res.success || !res.data) {
          setError(res.message || "Erro ao carregar employee.");
          return;
        }

        const e: EmployeeDto = res.data;
        setFirstName(e.firstName);
        setLastName(e.lastName);
        setEmail(e.email);
        setDocNumber(e.docNumber);
        setDateOfBirth(e.birthDate);
        setManagerId(e.managerId);
        setPhones(e.phones.length >= 2 ? e.phones : ["", ""]);
        setReadOnlyRole(e.role);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit]);

  const addPhone = () => setPhones((p) => [...p, ""]);
  const removePhone = (idx: number) => setPhones((p) => p.filter((_, i) => i !== idx));
  const setPhone = (idx: number, value: string) =>
    setPhones((p) => p.map((x, i) => (i === idx ? value : x)));

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Nome é obrigatório.";
    if (!email.trim() || !email.includes("@")) return "Email inválido.";
    if (!docNumber.trim()) return "DocNumber é obrigatório.";
    if (!dateOfBirth) return "Data de nascimento é obrigatória.";
    if (!isAdult(dateOfBirth)) return "Deve ser maior de idade (18+).";

    const cleanPhones = phones.map(p => p.trim()).filter(Boolean);
    if (cleanPhones.length < 2) return "Informe pelo menos 2 telefones.";

    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const cleanPhones = phones.map(p => p.trim()).filter(Boolean);

    setLoading(true);
    try {
      if (!isEdit) {
        // opção 1: sempre cria como Employee
        const payload = {
          firstName,
          lastName,
          email,
          docNumber,
          dateOfBirth,
          role: "Employee",
          password: "TempPass@123!", // recomendação: depois trocar por campo ou gerar e exibir
          managerId,
          phones: cleanPhones
        };

        const res = await createEmployee(payload);
        if (!res.success) {
          setError(res.message || "Erro ao criar.");
          return;
        }
      } else {
        if (!id) return;
        const payload = {
          firstName,
          lastName,
          email,
          docNumber,
          dateOfBirth,
          role: readOnlyRole, // mantém, mas UI não deixa alterar
          managerId,
          phones: cleanPhones
        };

        const res = await updateEmployee(id, payload);
        if (!res.success) {
          setError(res.message || "Erro ao atualizar.");
          return;
        }
      }

      nav("/employees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="row">
        <h1>{title}</h1>
        <Link className="btn secondary" to="/employees">Voltar</Link>
      </div>

      <div className="hint">
        Usuário: {auth.currentUser?.email} (role: {auth.currentUser?.role})
      </div>

      <form className="card wide" onSubmit={onSubmit}>
        <div className="grid2">
          <div className="field">
            <label>First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="field">
            <label>Last name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Doc number</label>
            <input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
          </div>

          <div className="field">
            <label>Date of birth</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div className="field">
            <label>Role (somente leitura)</label>
            <input value={isEdit ? readOnlyRole : "Employee"} readOnly />
          </div>
        </div>

        <ManagerPicker value={managerId} onChange={setManagerId} />

        <div className="field">
          <label>Phones (mínimo 2)</label>

          {phones.map((p, idx) => (
            <div className="row" key={idx} style={{ justifyContent: "flex-start" }}>
              <input
                value={p}
                onChange={(e) => setPhone(idx, e.target.value)}
                placeholder={idx === 0 ? "Primary phone" : "Phone"}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn secondary"
                disabled={phones.length <= 2}
                onClick={() => removePhone(idx)}
              >
                Remover
              </button>
            </div>
          ))}

          <button type="button" className="btn secondary" onClick={addPhone}>
            Adicionar telefone
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="btn" disabled={loading} type="submit">
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
