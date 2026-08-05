import { useState, useEffect } from "react";
import Calendario from "./Calendario";
import { fetchCondos, createCondo, createProp } from "../lib/vagupDb";

const NOVO_CONDO = "__novo__";

export default function FormProp() {
  const [condos, setCondos] = useState([]);
  const [form, setForm] = useState({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
  const [dias, setDias] = useState(new Set());
  const [status, setStatus] = useState(null); // 'ok' | 'err'
  const [errorMsg, setErrorMsg] = useState("Preencha todos os campos obrigatórios.");
  const [novoCondo, setNovoCondo] = useState({ nome: "", endereco: "", sindico: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCondos().then(setCondos).catch(() => {});
  }, []);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function setNovo(k, v) { setNovoCondo((c) => ({ ...c, [k]: v })); }

  async function submit() {
    const criandoCondo = form.condoId === NOVO_CONDO;
    if (!form.nome || !form.tel || !form.vaga || !form.diaria || !form.condoId) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      setStatus("err");
      return;
    }
    if (criandoCondo && (!novoCondo.nome.trim() || !novoCondo.endereco.trim())) {
      setErrorMsg("Preencha nome e endereço do novo condomínio.");
      setStatus("err");
      return;
    }

    setSaving(true);
    try {
      let condoId = form.condoId;
      if (criandoCondo) {
        const condo = await createCondo(novoCondo);
        condoId = condo.id;
        setCondos((c) => [...c, condo]);
      }
      await createProp({
        nome: form.nome,
        tel: form.tel,
        vaga: form.vaga,
        diaria: +form.diaria,
        condoId,
        obs: form.obs,
        diasDisponiveis: Array.from(dias),
        status: "pendente",
        origem: "publico",
      });
      setStatus("ok");
      setForm({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
      setNovoCondo({ nome: "", endereco: "", sindico: "" });
      setDias(new Set());
    } catch (e) {
      setErrorMsg("Não foi possível enviar. Tente novamente.");
      setStatus("err");
    } finally {
      setSaving(false);
    }
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
            {status === "err" && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#EF4444", borderRadius: 8, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>{errorMsg}</div>}
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
                  <option value={NOVO_CONDO}>+ Cadastrar novo condomínio</option>
                </select>
              </div>
              {form.condoId === NOVO_CONDO && (
                <div style={{ gridColumn: "span 2", background: "#0F172A", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 8, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>Nome do condomínio *</label>
                    <input style={inp} value={novoCondo.nome} onChange={(e) => setNovo("nome", e.target.value)} placeholder="Residencial Central" />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>Endereço completo *</label>
                    <input style={inp} value={novoCondo.endereco} onChange={(e) => setNovo("endereco", e.target.value)} placeholder="Rua das Flores, 100 - Bairro, Cidade" />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>Responsável / síndico</label>
                    <input style={inp} value={novoCondo.sindico} onChange={(e) => setNovo("sindico", e.target.value)} placeholder="Nome do síndico ou administradora" />
                  </div>
                </div>
              )}
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
            <button onClick={submit} disabled={saving} style={{ background: "#06B6D4", color: "#fff", border: "none", borderRadius: 8, padding: 11, width: "100%", fontSize: 14, fontWeight: 500, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Enviando..." : "Cadastrar minha vaga"}
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
