import { useState, useEffect } from "react";
import { loadDB, saveDB, uid } from "../lib/vagupDb";

export default function FormLoc() {
  const [condos, setCondos] = useState([]);
  const [form, setForm] = useState({ nome: "", tel: "", condoId: "", dataIn: "", dataOut: "", modelo: "", cor: "", placa: "", obs: "" });
  const [status, setStatus] = useState(null); // 'ok' | 'err'

  useEffect(() => {
    setCondos(loadDB().condos);
  }, []);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function submit() {
    if (!form.nome || !form.tel || !form.condoId || !form.dataIn || !form.dataOut || !form.modelo || !form.placa) {
      setStatus("err");
      return;
    }
    const db = loadDB();
    db.locs.push({
      id: uid(),
      ...form,
      placa: form.placa.toUpperCase(),
      status: "aguardando",
      origem: "publico",
      criadoEm: new Date().toISOString(),
    });
    saveDB(db);
    setStatus("ok");
    setForm({ nome: "", tel: "", condoId: "", dataIn: "", dataOut: "", modelo: "", cor: "", placa: "", obs: "" });
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
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 18, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>Solicitação enviada!</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Entraremos em contato com as opções disponíveis.</div>
            <button onClick={() => setStatus(null)} style={{ background: "#06B6D4", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13 }}>Fazer outra solicitação</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Quero alugar uma vaga</div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Informe seus dados e quando precisa da vaga. Entraremos em contato com as opções disponíveis.</div>
            {status === "err" && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#EF4444", borderRadius: 8, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>Preencha todos os campos obrigatórios.</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={lbl}>Nome completo *</label><input style={inp} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Maria Souza" /></div>
              <div><label style={lbl}>Telefone / WhatsApp *</label><input style={inp} value={form.tel} onChange={(e) => set("tel", e.target.value)} placeholder="(31) 99999-0000" /></div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Condomínio *</label>
                <select style={inp} value={form.condoId} onChange={(e) => set("condoId", e.target.value)}>
                  <option value="">Selecione o condomínio</option>
                  {condos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Data de entrada *</label><input type="date" style={inp} value={form.dataIn} onChange={(e) => set("dataIn", e.target.value)} /></div>
              <div><label style={lbl}>Data de saída *</label><input type="date" style={inp} value={form.dataOut} onChange={(e) => set("dataOut", e.target.value)} /></div>
              <div><label style={lbl}>Modelo do carro *</label><input style={inp} value={form.modelo} onChange={(e) => set("modelo", e.target.value)} placeholder="Ex: Onix 2022" /></div>
              <div><label style={lbl}>Cor do carro *</label><input style={inp} value={form.cor} onChange={(e) => set("cor", e.target.value)} placeholder="Ex: Prata" /></div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Placa *</label>
                <input style={{ ...inp, textTransform: "uppercase" }} value={form.placa} onChange={(e) => set("placa", e.target.value)} placeholder="ABC-1234" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={lbl}>Observações (opcional)</label>
                <textarea style={{ ...inp, resize: "vertical", minHeight: 64 }} value={form.obs} onChange={(e) => set("obs", e.target.value)} placeholder="Alguma necessidade específica?" />
              </div>
            </div>
            <button onClick={submit} style={{ background: "#06B6D4", color: "#fff", border: "none", borderRadius: 8, padding: 11, width: "100%", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Enviar solicitação
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
