import { useState, useEffect } from "react";
import Calendario from "./Calendario";
import { loadDB, saveDB, uid } from "../lib/vagupDb";

export default function FormProp() {
  const [condos, setCondos] = useState([]);
  const [form, setForm] = useState({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
  const [dias, setDias] = useState(new Set());
  const [status, setStatus] = useState(null); // 'ok' | 'err'

  useEffect(() => {
    setCondos(loadDB().condos);
  }, []);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function submit() {
    if (!form.nome || !form.tel || !form.vaga || !form.diaria || !form.condoId) {
      setStatus("err");
      return;
    }
    const db = loadDB();
    db.props.push({
      id: uid(),
      ...form,
      diaria: +form.diaria,
      diasDisponiveis: Array.from(dias),
      status: "pendente",
      origem: "publico",
      criadoEm: new Date().toISOString(),
    });
    saveDB(db);
    setStatus("ok");
    setForm({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
    setDias(new Set());
  }

  const inp = { background: "#1E293B", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#E2E8F0", fontFamily: "inherit", outline: "none", width: "100%" };
  const lbl = { fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#94A3B8", display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>Vag<span style={{ color: "#06B6D4" }}>Up</span></div>
        <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Gerenciamento inteligente de vagas</div>
      </div>
      <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 12, padding: 28, maxWidth: 520, width: "100%" }}>
        {status === "ok" ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>Cadastro enviado!</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Nossa equipe entrará em contato em breve.</div>
            <button onClick={() => setStatus(null)} style={{ background: "#06B6D4", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13 }}>Cadastrar outra vaga</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Cadastrar minha vaga</div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Preencha os dados e escolha seus dias disponíveis.</div>
            {status === "err" && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#EF4444", borderRadius: 8, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>Preencha todos os campos obrigatórios.</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={lbl}>Nome completo *</label><input style={inp} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="João Silva" /></div>
              <div><label style={lbl}>Telefone / WhatsApp *</label><input style={inp} value={form.tel} onChange={(e) => set("tel", e.target.value)} placeholder="(31) 99999-0000" /></div>
              <div><label style={lbl}>Número da vaga *</label><input style={inp} value={form.vaga} onChange={(e) => set("vaga", e.target.value)} placeholder="Ex: 42" /></div>
              <div><label style={lbl}>Valor por diária (R$) *</label><input style={inp} type="number" value={form.diaria} onChange={(e) => set("diaria", e.target.value)} placeholder="35" /></div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Condomínio *</label>
                <select style={inp} value={form.condoId} onChange={(e) => set("condoId", e.target.value)}>
                  <option value="">Selecione o condomínio</option>
                  {condos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Observações (opcional)</label>
                <textarea style={{ ...inp, resize: "vertical", minHeight: 64 }} value={form.obs} onChange={(e) => set("obs", e.target.value)} placeholder="Tipo da vaga, restrições, etc." />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Dias disponíveis * <span style={{ color: "#64748B", fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>{dias.size} selecionados</span></label>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8 }}>Clique nos dias em que sua vaga estará disponível.</div>
                <Calendario selected={dias} onChange={setDias} />
              </div>
            </div>
            <button onClick={submit} style={{ background: "#06B6D4", color: "#fff", border: "none", borderRadius: 8, padding: 11, width: "100%", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Cadastrar minha vaga
            </button>
          </>
        )}
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <a href="#/" style={{ fontSize: 12, color: "#475569" }}>← Voltar</a>
        </div>
      </div>
    </div>
  );
}
