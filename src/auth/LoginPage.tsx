import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const auth = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@teste.com.br");
  const [password, setPassword] = useState("Senha@123");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = await auth.doLogin(email, password);
    if (!ok) {
      setError("Login inválido.");
      return;
    }

    nav("/employees");
  };

  return (
    <div className="page">
      <h1>Employee Management</h1>

      <form className="card" onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit">Entrar</button>
      </form>
    </div>
  );
}
