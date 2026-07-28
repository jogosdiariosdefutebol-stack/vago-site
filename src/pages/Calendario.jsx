import { useState } from "react";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export default function Calendario({ selected, onChange }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  function toggle(key) {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange(next);
  }

  function nav(dir) {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  }

  const canPrev = !(year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button type="button" onClick={() => nav(-1)} disabled={!canPrev} style={{
          background: "#1E293B", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 6,
          width: 28, height: 28, color: "#94A3B8", cursor: canPrev ? "pointer" : "default", opacity: canPrev ? 1 : 0.4,
        }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{MESES[month]} {year}</span>
        <button type="button" onClick={() => nav(1)} style={{
          background: "#1E293B", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 6,
          width: 28, height: 28, color: "#94A3B8", cursor: "pointer",
        }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {DIAS_SEMANA.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, color: "#64748B", padding: "3px 0", fontWeight: 600, letterSpacing: ".06em" }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const date = new Date(year, month, d); date.setHours(0, 0, 0, 0);
          const isPast = date < today;
          const isSel = selected.has(key);
          const isToday = date.getTime() === today.getTime();
          return (
            <div key={d} onClick={() => !isPast && toggle(key)} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, fontSize: 12, cursor: isPast ? "default" : "pointer",
              border: isSel ? "1px solid #06B6D4" : isToday ? "1px solid #F59E0B" : "1px solid transparent",
              background: isSel ? "rgba(6,182,212,0.2)" : "transparent",
              color: isPast ? "#334155" : isSel ? "#06B6D4" : isToday ? "#F59E0B" : "#94A3B8",
              opacity: isPast ? 0.4 : 1, fontWeight: isSel ? 600 : 400,
            }}>{d}</div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#64748B", display: "flex", gap: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(6,182,212,0.2)", border: "1px solid #06B6D4", display: "inline-block" }} />Disponível
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", display: "inline-block" }} />Bloqueado
        </span>
      </div>
    </div>
  );
}
