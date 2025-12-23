import { useEffect, useState } from "react";
import type { EmployeeLookupDto, } from "../shared/types";
import { lookupEmployees } from "./employeeService";

type Props = {
  value: string | null;
  onChange: (managerId: string | null) => void;
};

export function ManagerPicker({ value, onChange }: Props) {
  const [text, setText] = useState("");
  const [items, setItems] = useState<EmployeeLookupDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = text.trim();
    if (s.length < 2) {
      setItems([]);
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await lookupEmployees(s, 15);
        setItems(res.success && res.data ? res.data : []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [text]);

  return (
    <div className="field" style={{ position: "relative" }}>
      <label>Manager (opcional)</label>

      <input
        placeholder="Digite para buscar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="hint-row">
        <small>ManagerId selecionado: {value ?? "(nenhum)"}</small>
        {value && (
          <button type="button" className="link" onClick={() => onChange(null)}>
            Limpar
          </button>
        )}
      </div>

      {loading && <div className="hint">Buscando...</div>}

      {items.length > 0 && (
        <div className="dropdown">
          {items.map((x) => (
            <button
              key={x.id}
              type="button"
              className="dropdown-item"
              onClick={() => {
                onChange(x.id);
                setText(x.fullName);
                setItems([]);
              }}
            >
              {x.fullName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}