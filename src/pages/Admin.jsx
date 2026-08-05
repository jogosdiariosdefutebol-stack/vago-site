import { useState, useEffect } from "react";
import Calendario from "./Calendario";
import { supabase } from "../lib/supabase";
import {
  fetchCondos, createCondo, deleteCondo,
  fetchProps, createProp, updateProp, deleteProp,
  fetchLocs, createLoc, updateLoc, deleteLoc,
  fetchReservas, createReserva, updateReserva, deleteReserva,
  fmtDate, diasEntre, signIn, signOut,
} from "../lib/vagupDb";

const CLR = {
  bg: "#0F172A", surf: "#1E293B", surf2: "#263548", surf3: "#2E3E54",
  b1: "rgba(255,255,255,0.07)", b2: "rgba(255,255,255,0.13)",
  text: "#E2E8F0", muted: "#64748B", muted2: "#94A3B8",
  cyan: "#06B6D4", green: "#10B981", amber: "#F59E0B", red: "#EF4444",
};

const STATUS_COLOR = { ativo: CLR.green, pendente: CLR.amber, aguardando: CLR.amber, confirmado: CLR.green, cancelado: CLR.red, concluido: CLR.muted };

const inputStyle = { background: CLR.surf2, border: `1px solid ${CLR.b2}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: CLR.text, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%" };
const labelStyle = { fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: CLR.muted2, display: "block", marginBottom: 5 };

function Badge({ children, status }) {
  const color = STATUS_COLOR[status] || CLR.muted2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: `${color}20`, color }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "ghost", small, style, type = "button", disabled }) {
  const variants = {
    primary: { background: CLR.cyan, color: "#fff" },
    success: { background: CLR.green, color: "#fff" },
    ghost: { background: CLR.surf2, color: CLR.text, border: `1px solid ${CLR.b2}` },
    danger: { background: "rgba(239,68,68,0.15)", color: CLR.red, border: "1px solid rgba(239,68,68,0.25)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: small ? "5px 12px" : "9px 18px", borderRadius: 8,
      fontSize: small ? 12 : 13, fontWeight: 500, cursor: disabled ? "default" : "pointer", border: "none",
      fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", opacity: disabled ? 0.6 : 1,
      ...variants[variant], ...style,
    }}>
      {children}
    </button>
  );
}

function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: CLR.muted }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: CLR.muted2, marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, sub, action, children }) {
  return (
    <div style={{ background: CLR.surf, border: `1px solid ${CLR.b1}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: CLR.muted, marginTop: 2 }}>{sub}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: CLR.muted, borderBottom: `1px solid ${CLR.b2}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, first, style }) {
  return <td style={{ padding: "10px 12px", borderBottom: `1px solid ${CLR.b1}`, color: first ? CLR.text : CLR.muted2, fontWeight: first ? 500 : 400, verticalAlign: "middle", ...style }}>{children}</td>;
}

function StatusSelect({ value, options, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ background: CLR.surf2, border: `1px solid ${CLR.b2}`, borderRadius: 4, padding: "3px 6px", fontSize: 11, color: CLR.text }}>
      {options.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function LoginGate({ email, setEmail, pwd, setPwd, err, loading, onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: CLR.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: CLR.surf, border: `1px solid ${CLR.b2}`, borderRadius: 12, padding: 28, maxWidth: 340, width: "100%" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Acesso administrativo</div>
        <div style={{ fontSize: 12, color: CLR.muted, marginBottom: 20 }}>VagUp · Painel interno</div>
        {err && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: CLR.red, borderRadius: 8, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>E-mail ou senha incorretos.</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>E-mail</label>
          <input type="email" style={inputStyle} value={email} autoFocus placeholder="voce@exemplo.com"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Senha</label>
          <input type="password" style={inputStyle} value={pwd} placeholder="••••••••"
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Btn variant="primary" onClick={onLogin} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Btn>
          <a href="#/" style={{ background: CLR.surf2, color: CLR.text, border: `1px solid ${CLR.b2}`, borderRadius: 8, fontSize: 13, textAlign: "center", padding: "9px 18px", textDecoration: "none" }}>Cancelar</a>
        </div>
      </div>
    </div>
  );
}

function FullscreenMessage({ text }) {
  return (
    <div style={{ minHeight: "100vh", background: CLR.bg, color: CLR.muted2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
      {text}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [db, setDb] = useState({ condos: [], props: [], locs: [], reservas: [] });
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCondoForm, setShowCondoForm] = useState(false);
  const [condoForm, setCondoForm] = useState({ nome: "", endereco: "", apts: "", vagas: "", sindico: "", obs: "" });

  const [showPropForm, setShowPropForm] = useState(false);
  const [propForm, setPropForm] = useState({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
  const [propDias, setPropDias] = useState(new Set());

  const [showLocForm, setShowLocForm] = useState(false);
  const [locForm, setLocForm] = useState({ nome: "", tel: "", condoId: "", dataIn: "", dataOut: "", modelo: "", cor: "", placa: "", obs: "" });

  const [matchFilter, setMatchFilter] = useState("");
  const [pixReservaId, setPixReservaId] = useState(null);
  const [editDiasPropId, setEditDiasPropId] = useState(null);
  const [editDias, setEditDias] = useState(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadAll();
  }, [session]);

  async function loadAll() {
    setLoadingData(true);
    try {
      const [condos, props, locs, reservas] = await Promise.all([fetchCondos(), fetchProps(), fetchLocs(), fetchReservas()]);
      setDb({ condos, props, locs, reservas });
    } catch (e) {
      alert("Erro ao carregar dados: " + e.message);
    } finally {
      setLoadingData(false);
    }
  }

  function condoNome(id) { const c = db.condos.find((x) => x.id === id); return c ? c.nome : "—"; }

  async function doLogin() {
    setLoggingIn(true);
    setLoginErr(false);
    try {
      await signIn(email, pwd);
    } catch (e) {
      setLoginErr(true);
    } finally {
      setLoggingIn(false);
    }
  }

  async function doLogout() {
    await signOut();
    setDb({ condos: [], props: [], locs: [], reservas: [] });
  }

  async function saveCondo() {
    if (!condoForm.nome.trim() || !condoForm.endereco.trim()) { alert("Preencha nome e endereço."); return; }
    try {
      const condo = await createCondo(condoForm);
      setDb((d) => ({ ...d, condos: [...d.condos, condo] }));
      setCondoForm({ nome: "", endereco: "", apts: "", vagas: "", sindico: "", obs: "" });
      setShowCondoForm(false);
    } catch (e) { alert("Erro ao salvar condomínio: " + e.message); }
  }

  async function saveProp() {
    const { nome, tel, vaga, diaria, condoId } = propForm;
    if (!nome || !tel || !vaga || !diaria || !condoId) { alert("Preencha todos os campos obrigatórios."); return; }
    try {
      const prop = await createProp({ ...propForm, diaria: +diaria, diasDisponiveis: Array.from(propDias), status: "ativo", origem: "admin" });
      setDb((d) => ({ ...d, props: [...d.props, prop] }));
      setPropForm({ nome: "", tel: "", vaga: "", diaria: "", condoId: "", obs: "" });
      setPropDias(new Set());
      setShowPropForm(false);
    } catch (e) { alert("Erro ao salvar proprietário: " + e.message); }
  }

  async function saveLoc() {
    const { nome, tel, condoId, dataIn, dataOut, modelo, placa } = locForm;
    if (!nome || !tel || !condoId || !dataIn || !dataOut || !modelo || !placa) { alert("Preencha todos os campos obrigatórios."); return; }
    try {
      const loc = await createLoc({ ...locForm, placa: placa.toUpperCase(), status: "aguardando", origem: "admin" });
      setDb((d) => ({ ...d, locs: [...d.locs, loc] }));
      setLocForm({ nome: "", tel: "", condoId: "", dataIn: "", dataOut: "", modelo: "", cor: "", placa: "", obs: "" });
      setShowLocForm(false);
    } catch (e) { alert("Erro ao salvar locatário: " + e.message); }
  }

  async function delItem(col, id) {
    if (!confirm("Remover este item?")) return;
    try {
      if (col === "condos") await deleteCondo(id);
      else if (col === "props") await deleteProp(id);
      else if (col === "locs") await deleteLoc(id);
      else if (col === "reservas") await deleteReserva(id);
      setDb((d) => ({ ...d, [col]: d[col].filter((x) => x.id !== id) }));
    } catch (e) { alert("Erro ao remover: " + e.message); }
  }

  async function changeStatus(col, id, val) {
    try {
      if (col === "props") await updateProp(id, { status: val });
      else if (col === "locs") await updateLoc(id, { status: val });
      else if (col === "reservas") await updateReserva(id, { status: val });
      setDb((d) => ({ ...d, [col]: d[col].map((x) => (x.id === id ? { ...x, status: val } : x)) }));
    } catch (e) { alert("Erro ao atualizar status: " + e.message); }
  }

  async function criarReserva(locId, propId, valor) {
    const l = db.locs.find((x) => x.id === locId);
    const p = db.props.find((x) => x.id === propId);
    if (!l || !p) return;
    const dias = diasEntre(l.dataIn, l.dataOut);
    try {
      const reserva = await createReserva({
        locId, propId, locNome: l.nome, propNome: p.nome, vaga: p.vaga, condoId: l.condoId,
        dataIn: l.dataIn, dataOut: l.dataOut, dias, valor: +valor, pixEnviado: false, status: "aguardando",
      });
      await updateLoc(locId, { status: "confirmado" });
      setDb((d) => ({
        ...d,
        reservas: [...d.reservas, reserva],
        locs: d.locs.map((x) => (x.id === locId ? { ...x, status: "confirmado" } : x)),
      }));
      setPixReservaId(reserva.id);
      setPage("reservas");
    } catch (e) { alert("Erro ao criar reserva: " + e.message); }
  }

  async function confirmPix() {
    if (!pixReservaId) return;
    try {
      await updateReserva(pixReservaId, { pixEnviado: true, status: "confirmado" });
      setDb((d) => ({ ...d, reservas: d.reservas.map((r) => (r.id === pixReservaId ? { ...r, pixEnviado: true, status: "confirmado" } : r)) }));
      setPixReservaId(null);
    } catch (e) { alert("Erro ao confirmar pix: " + e.message); }
  }

  function copyPix() {
    navigator.clipboard.writeText("31984267997");
    alert("Chave Pix copiada!");
  }

  function openEditDias(propId) {
    const p = db.props.find((x) => x.id === propId);
    if (!p) return;
    setEditDiasPropId(propId);
    setEditDias(new Set(p.diasDisponiveis || []));
  }

  async function saveEditDias() {
    if (!editDiasPropId) return;
    try {
      await updateProp(editDiasPropId, { diasDisponiveis: Array.from(editDias) });
      setDb((d) => ({ ...d, props: d.props.map((p) => (p.id === editDiasPropId ? { ...p, diasDisponiveis: Array.from(editDias) } : p)) }));
      setEditDiasPropId(null);
    } catch (e) { alert("Erro ao salvar disponibilidade: " + e.message); }
  }

  if (session === undefined) return <FullscreenMessage text="Carregando..." />;
  if (!session) return <LoginGate email={email} setEmail={setEmail} pwd={pwd} setPwd={setPwd} err={loginErr} loading={loggingIn} onLogin={doLogin} />;
  if (loadingData) return <FullscreenMessage text="Carregando dados..." />;

  const pixReserva = pixReservaId ? db.reservas.find((r) => r.id === pixReservaId) : null;
  const editDiasProp = editDiasPropId ? db.props.find((p) => p.id === editDiasPropId) : null;

  const navGroups = [
    { label: "Visão geral", items: [{ id: "dashboard", label: "Dashboard" }] },
    { label: "Cadastros", items: [
      { id: "condominios", label: "Condomínios", count: db.condos.length },
      { id: "proprietarios", label: "Proprietários", count: db.props.length },
      { id: "locatarios", label: "Locatários", count: db.locs.length },
    ] },
    { label: "Operação", items: [
      { id: "reservas", label: "Reservas", count: db.reservas.length },
      { id: "matching", label: "Matching" },
    ] },
  ];
  const pageTitles = { dashboard: "Dashboard", condominios: "Condomínios", proprietarios: "Proprietários", locatarios: "Locatários", reservas: "Reservas", matching: "Matching de vagas" };

  return (
    <div style={{ minHeight: "100vh", background: CLR.bg, color: CLR.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, display: "flex" }}>
      {/* SIDEBAR */}
      <div style={{
        width: 220, flexShrink: 0, background: CLR.surf, borderRight: `1px solid ${CLR.b1}`,
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100,
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }} className="admin-sidebar">
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${CLR.b1}` }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 800, color: "#fff" }}>Vag<span style={{ color: CLR.cyan }}>Up</span></div>
          <div style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: CLR.muted, marginTop: 2 }}>Painel Admin</div>
        </div>
        <nav style={{ padding: 12, flex: 1, overflowY: "auto" }}>
          {navGroups.map((g) => (
            <div key={g.label} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: CLR.muted, padding: "8px 10px 4px" }}>{g.label}</div>
              {g.items.map((it) => (
                <button key={it.id} onClick={() => { setPage(it.id); setSidebarOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                  color: page === it.id ? CLR.cyan : CLR.muted2, fontSize: 13, fontWeight: 500, width: "100%", border: "none",
                  background: page === it.id ? "rgba(6,182,212,0.12)" : "none", textAlign: "left",
                }}>
                  {it.label}
                  {it.count !== undefined && <span style={{ marginLeft: "auto", background: CLR.surf3, color: CLR.muted2, fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 10 }}>{it.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: `1px solid ${CLR.b1}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontSize: 12, fontWeight: 700, color: CLR.cyan, flexShrink: 0 }}>
              {(session.user.email || "?").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: CLR.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.email}</div>
              <div style={{ fontSize: 10, color: CLR.muted }}>Administrador</div>
            </div>
          </div>
          <button onClick={doLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", color: CLR.muted2, fontSize: 13, fontWeight: 500, width: "100%", border: "none", background: "none", marginTop: 4, textAlign: "left" }}>
            Sair
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="admin-main" style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>
        <div style={{ height: 56, background: CLR.surf, borderBottom: `1px solid ${CLR.b1}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="admin-mob-toggle" onClick={() => setSidebarOpen((o) => !o)} style={{ display: "none", background: "none", border: "none", color: CLR.text, cursor: "pointer", padding: 8 }}>☰</button>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{pageTitles[page]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Btn small onClick={() => { setPage("proprietarios"); setShowPropForm(true); }}>+ Proprietário</Btn>
            <Btn small variant="primary" onClick={() => { setPage("locatarios"); setShowLocForm(true); }}>+ Locatário</Btn>
          </div>
        </div>

        <div style={{ padding: "28px 24px", maxWidth: 900 }}>
          {page === "dashboard" && (() => {
            const totalGMV = db.reservas.filter((r) => r.status === "confirmado").reduce((a, r) => a + (r.valor || 0), 0);
            const vagupRec = totalGMV * 0.16;
            const recentes = (arr) => arr.slice(-5).reverse();
            return (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
                  <div style={{ background: CLR.surf, border: `1px solid ${CLR.b1}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 6 }}>Condomínios</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: CLR.cyan }}>{db.condos.length}</div>
                    <div style={{ fontSize: 11, color: CLR.muted, marginTop: 3 }}>parceiros ativos</div>
                  </div>
                  <div style={{ background: CLR.surf, border: `1px solid ${CLR.b1}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 6 }}>Proprietários</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>{db.props.length}</div>
                    <div style={{ fontSize: 11, color: CLR.muted, marginTop: 3 }}>{db.props.filter((p) => p.status === "pendente").length} aguardando aprovação</div>
                  </div>
                  <div style={{ background: CLR.surf, border: `1px solid ${CLR.b1}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 6 }}>Locatários</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>{db.locs.length}</div>
                    <div style={{ fontSize: 11, color: CLR.muted, marginTop: 3 }}>{db.locs.filter((l) => l.status === "aguardando").length} sem vaga alocada</div>
                  </div>
                  <div style={{ background: CLR.surf, border: `1px solid ${CLR.b1}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 6 }}>GMV total</div>
                    <div style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 700, color: CLR.green }}>R${Math.round(totalGMV).toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize: 11, color: CLR.muted, marginTop: 3 }}>Receita VagUp: R${Math.round(vagupRec).toLocaleString("pt-BR")}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="admin-dash-grid">
                  <Card title="Proprietários recentes" sub="Últimos cadastros">
                    {db.props.length ? recentes(db.props).map((p) => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${CLR.b1}` }}>
                        <div>
                          <div style={{ fontSize: 13, color: CLR.text, fontWeight: 500 }}>{p.nome}</div>
                          <div style={{ fontSize: 11, color: CLR.muted }}>{condoNome(p.condoId)} · Vaga {p.vaga}</div>
                        </div>
                        <Badge status={p.status}>{p.status}</Badge>
                      </div>
                    )) : <Empty icon="🏠" title="Nenhum proprietário" />}
                  </Card>
                  <Card title="Locatários recentes" sub="Últimas solicitações">
                    {db.locs.length ? recentes(db.locs).map((l) => (
                      <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${CLR.b1}` }}>
                        <div>
                          <div style={{ fontSize: 13, color: CLR.text, fontWeight: 500 }}>{l.nome}</div>
                          <div style={{ fontSize: 11, color: CLR.muted }}>{condoNome(l.condoId)} · {fmtDate(l.dataIn)} → {fmtDate(l.dataOut)}</div>
                        </div>
                        <Badge status={l.status}>{l.status}</Badge>
                      </div>
                    )) : <Empty icon="🚗" title="Nenhum locatário" />}
                  </Card>
                </div>
              </>
            );
          })()}

          {page === "condominios" && (
            <Card title="Condomínios" sub="Prédios parceiros cadastrados" action={<Btn small variant="primary" onClick={() => setShowCondoForm((v) => !v)}>+ Novo</Btn>}>
              {showCondoForm && (
                <div style={{ marginBottom: 16, padding: 16, background: CLR.surf2, borderRadius: 8, border: `1px solid ${CLR.b2}` }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Novo condomínio</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label style={labelStyle}>Nome do condomínio *</label><input style={inputStyle} value={condoForm.nome} onChange={(e) => setCondoForm({ ...condoForm, nome: e.target.value })} placeholder="Residencial Central" /></div>
                    <div><label style={labelStyle}>Endereço *</label><input style={inputStyle} value={condoForm.endereco} onChange={(e) => setCondoForm({ ...condoForm, endereco: e.target.value })} placeholder="Rua das Flores, 100" /></div>
                    <div><label style={labelStyle}>Número de apartamentos</label><input type="number" style={inputStyle} value={condoForm.apts} onChange={(e) => setCondoForm({ ...condoForm, apts: e.target.value })} placeholder="80" /></div>
                    <div><label style={labelStyle}>Número total de vagas</label><input type="number" style={inputStyle} value={condoForm.vagas} onChange={(e) => setCondoForm({ ...condoForm, vagas: e.target.value })} placeholder="90" /></div>
                    <div style={{ gridColumn: "span 2" }}><label style={labelStyle}>Responsável / síndico</label><input style={inputStyle} value={condoForm.sindico} onChange={(e) => setCondoForm({ ...condoForm, sindico: e.target.value })} placeholder="Nome do síndico ou administradora" /></div>
                    <div style={{ gridColumn: "span 2" }}><label style={labelStyle}>Observações</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} value={condoForm.obs} onChange={(e) => setCondoForm({ ...condoForm, obs: e.target.value })} placeholder="Regras de acesso, horários, etc." /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="success" onClick={saveCondo}>Salvar</Btn>
                    <Btn variant="ghost" onClick={() => setShowCondoForm(false)}>Cancelar</Btn>
                  </div>
                </div>
              )}
              {db.condos.length ? (
                <Table headers={["Nome", "Endereço", "Apts", "Vagas", "Síndico", "Status", ""]}>
                  {db.condos.map((c) => (
                    <tr key={c.id}>
                      <Td first>{c.nome}</Td>
                      <Td style={{ fontSize: 12 }}>{c.endereco}</Td>
                      <Td>{c.apts || "—"}</Td>
                      <Td>{c.vagas || "—"}</Td>
                      <Td style={{ fontSize: 12 }}>{c.sindico || "—"}</Td>
                      <Td><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: c.ativo ? `${CLR.green}20` : CLR.surf2, color: c.ativo ? CLR.green : CLR.muted2 }}>{c.ativo ? "Ativo" : "Inativo"}</span></Td>
                      <Td><Btn variant="danger" small onClick={() => delItem("condos", c.id)}>✕</Btn></Td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty icon="🏢" title="Nenhum condomínio cadastrado" sub='Clique em "+ Novo" para adicionar' />}
            </Card>
          )}

          {page === "proprietarios" && (
            <Card title="Proprietários" sub="Donos de vagas cadastradas" action={<Btn small variant="primary" onClick={() => setShowPropForm((v) => !v)}>+ Novo</Btn>}>
              {showPropForm && (
                <div style={{ marginBottom: 16, padding: 16, background: CLR.surf2, borderRadius: 8, border: `1px solid ${CLR.b2}` }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Novo proprietário</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label style={labelStyle}>Nome completo *</label><input style={inputStyle} value={propForm.nome} onChange={(e) => setPropForm({ ...propForm, nome: e.target.value })} placeholder="João Silva" /></div>
                    <div><label style={labelStyle}>Telefone / WhatsApp *</label><input style={inputStyle} value={propForm.tel} onChange={(e) => setPropForm({ ...propForm, tel: e.target.value })} placeholder="(31) 99999-0000" /></div>
                    <div><label style={labelStyle}>Número da vaga *</label><input style={inputStyle} value={propForm.vaga} onChange={(e) => setPropForm({ ...propForm, vaga: e.target.value })} placeholder="Ex: 42" /></div>
                    <div><label style={labelStyle}>Valor por diária (R$) *</label><input type="number" style={inputStyle} value={propForm.diaria} onChange={(e) => setPropForm({ ...propForm, diaria: e.target.value })} placeholder="35" /></div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Condomínio *</label>
                      <select style={inputStyle} value={propForm.condoId} onChange={(e) => setPropForm({ ...propForm, condoId: e.target.value })}>
                        <option value="">Selecione</option>
                        {db.condos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                    <div style={{ gridColumn: "span 2" }}><label style={labelStyle}>Observações</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} value={propForm.obs} onChange={(e) => setPropForm({ ...propForm, obs: e.target.value })} placeholder="Tipo, restrições, etc." /></div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={labelStyle}>Dias disponíveis</label>
                      <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 8 }}>Clique nos dias disponíveis. Dias não selecionados ficam bloqueados.</div>
                      <Calendario selected={propDias} onChange={setPropDias} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="success" onClick={saveProp}>Salvar</Btn>
                    <Btn variant="ghost" onClick={() => setShowPropForm(false)}>Cancelar</Btn>
                  </div>
                </div>
              )}
              {db.props.length ? (
                <Table headers={["Nome", "Telefone", "Condomínio", "Vaga", "Diária", "Status", ""]}>
                  {db.props.map((p) => (
                    <tr key={p.id}>
                      <Td first>{p.nome}</Td>
                      <Td><a href={`tel:${p.tel}`} style={{ color: CLR.cyan }}>{p.tel}</a></Td>
                      <Td style={{ fontSize: 12 }}>{condoNome(p.condoId)}</Td>
                      <Td><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: `${CLR.cyan}20`, color: CLR.cyan }}>Vaga {p.vaga}</span></Td>
                      <Td style={{ color: CLR.green, fontWeight: 500 }}>R${p.diaria}/dia</Td>
                      <Td><StatusSelect value={p.status} options={["ativo", "pendente", "inativo"]} onChange={(v) => changeStatus("props", p.id, v)} /></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Btn variant="ghost" small onClick={() => openEditDias(p.id)}>📅 {(p.diasDisponiveis || []).length}d</Btn>
                          <Btn variant="danger" small onClick={() => delItem("props", p.id)}>✕</Btn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty icon="🔑" title="Nenhum proprietário cadastrado" />}
            </Card>
          )}

          {page === "locatarios" && (
            <Card title="Locatários" sub="Solicitações de aluguel" action={<Btn small variant="primary" onClick={() => setShowLocForm((v) => !v)}>+ Novo</Btn>}>
              {showLocForm && (
                <div style={{ marginBottom: 16, padding: 16, background: CLR.surf2, borderRadius: 8, border: `1px solid ${CLR.b2}` }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Novo locatário</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label style={labelStyle}>Nome completo *</label><input style={inputStyle} value={locForm.nome} onChange={(e) => setLocForm({ ...locForm, nome: e.target.value })} placeholder="Maria Souza" /></div>
                    <div><label style={labelStyle}>Telefone *</label><input style={inputStyle} value={locForm.tel} onChange={(e) => setLocForm({ ...locForm, tel: e.target.value })} placeholder="(31) 99999-0000" /></div>
                    <div>
                      <label style={labelStyle}>Condomínio *</label>
                      <select style={inputStyle} value={locForm.condoId} onChange={(e) => setLocForm({ ...locForm, condoId: e.target.value })}>
                        <option value="">Selecione</option>
                        {db.condos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    </div>
                    <div><label style={labelStyle}>Data entrada *</label><input type="date" style={inputStyle} value={locForm.dataIn} onChange={(e) => setLocForm({ ...locForm, dataIn: e.target.value })} /></div>
                    <div><label style={labelStyle}>Data saída *</label><input type="date" style={inputStyle} value={locForm.dataOut} onChange={(e) => setLocForm({ ...locForm, dataOut: e.target.value })} /></div>
                    <div><label style={labelStyle}>Modelo carro *</label><input style={inputStyle} value={locForm.modelo} onChange={(e) => setLocForm({ ...locForm, modelo: e.target.value })} placeholder="Onix 2022" /></div>
                    <div><label style={labelStyle}>Cor *</label><input style={inputStyle} value={locForm.cor} onChange={(e) => setLocForm({ ...locForm, cor: e.target.value })} placeholder="Prata" /></div>
                    <div><label style={labelStyle}>Placa *</label><input style={{ ...inputStyle, textTransform: "uppercase" }} value={locForm.placa} onChange={(e) => setLocForm({ ...locForm, placa: e.target.value })} placeholder="ABC-1234" /></div>
                    <div><label style={labelStyle}>Observações</label><input style={inputStyle} value={locForm.obs} onChange={(e) => setLocForm({ ...locForm, obs: e.target.value })} placeholder="Opcional" /></div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="success" onClick={saveLoc}>Salvar</Btn>
                    <Btn variant="ghost" onClick={() => setShowLocForm(false)}>Cancelar</Btn>
                  </div>
                </div>
              )}
              {db.locs.length ? (
                <Table headers={["Nome", "Telefone", "Condomínio", "Período", "Carro", "Status", ""]}>
                  {db.locs.map((l) => (
                    <tr key={l.id}>
                      <Td first>{l.nome}</Td>
                      <Td><a href={`tel:${l.tel}`} style={{ color: CLR.cyan }}>{l.tel}</a></Td>
                      <Td style={{ fontSize: 12 }}>{condoNome(l.condoId)}</Td>
                      <Td style={{ fontSize: 12 }}>{fmtDate(l.dataIn)} → {fmtDate(l.dataOut)}<br /><span style={{ color: CLR.muted, fontSize: 11 }}>{diasEntre(l.dataIn, l.dataOut)} dias</span></Td>
                      <Td style={{ fontSize: 12 }}>{l.modelo} {l.cor}<br /><span style={{ fontFamily: "monospace", fontSize: 11, color: CLR.amber }}>{l.placa}</span></Td>
                      <Td><StatusSelect value={l.status} options={["aguardando", "confirmado", "cancelado", "concluido"]} onChange={(v) => changeStatus("locs", l.id, v)} /></Td>
                      <Td><Btn variant="danger" small onClick={() => delItem("locs", l.id)}>✕</Btn></Td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty icon="🚗" title="Nenhum locatário cadastrado" />}
            </Card>
          )}

          {page === "reservas" && (
            <Card title="Reservas" sub="Histórico de todas as reservas">
              {db.reservas.length ? (
                <Table headers={["Locatário", "Proprietário", "Vaga", "Período", "Valor", "Pix", "Status", ""]}>
                  {db.reservas.map((r) => (
                    <tr key={r.id}>
                      <Td first>{r.locNome}</Td>
                      <Td style={{ fontSize: 12 }}>{r.propNome}<br /><span style={{ color: CLR.muted, fontSize: 11 }}>Vaga {r.vaga}</span></Td>
                      <Td><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: `${CLR.cyan}20`, color: CLR.cyan }}>Vaga {r.vaga}</span></Td>
                      <Td style={{ fontSize: 12 }}>{fmtDate(r.dataIn)} → {fmtDate(r.dataOut)}<br /><span style={{ color: CLR.muted, fontSize: 11 }}>{r.dias} dias</span></Td>
                      <Td style={{ color: CLR.green, fontWeight: 500 }}>R${r.valor.toLocaleString("pt-BR")}</Td>
                      <Td><Badge status={r.pixEnviado ? "confirmado" : "pendente"}>{r.pixEnviado ? "Enviado" : "Pendente"}</Badge></Td>
                      <Td><StatusSelect value={r.status} options={["aguardando", "confirmado", "cancelado", "concluido"]} onChange={(v) => changeStatus("reservas", r.id, v)} /></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Btn variant="ghost" small onClick={() => setPixReservaId(r.id)}>₿</Btn>
                          <Btn variant="danger" small onClick={() => delItem("reservas", r.id)}>✕</Btn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </Table>
              ) : <Empty icon="📋" title="Nenhuma reserva criada" sub="Crie reservas pelo Matching de vagas" />}
            </Card>
          )}

          {page === "matching" && (() => {
            const locs = db.locs.filter((l) => l.status === "aguardando" && (!matchFilter || l.condoId === matchFilter));
            const props = db.props.filter((p) => p.status === "ativo" && (!matchFilter || p.condoId === matchFilter));
            return (
              <Card title="Matching de vagas" sub="Conecte locatários a proprietários disponíveis">
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Filtrar por condomínio</label>
                  <select style={{ ...inputStyle, maxWidth: 280 }} value={matchFilter} onChange={(e) => setMatchFilter(e.target.value)}>
                    <option value="">Todos</option>
                    {db.condos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                {!locs.length && !props.length ? (
                  <Empty icon="⚡" title="Nenhum matching disponível" sub="Adicione proprietários ativos e locatários aguardando" />
                ) : !locs.length ? (
                  <div style={{ fontSize: 13, color: CLR.muted, padding: "12px 0" }}>Nenhum locatário aguardando vaga{matchFilter ? " neste condomínio" : ""}.</div>
                ) : (
                  locs.map((l) => {
                    const dias = diasEntre(l.dataIn, l.dataOut);
                    const dispProps = props.filter((p) => p.condoId === l.condoId);
                    return (
                      <div key={l.id} style={{ background: CLR.surf2, borderRadius: 8, padding: 14, marginBottom: 12, border: `1px solid ${CLR.b2}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: CLR.text }}>{l.nome}</div>
                            <div style={{ fontSize: 11, color: CLR.muted }}>{condoNome(l.condoId)} · {fmtDate(l.dataIn)} → {fmtDate(l.dataOut)} · {dias} dias</div>
                            <div style={{ fontSize: 11, color: CLR.amber, marginTop: 2 }}>{l.modelo} {l.cor} · {l.placa}</div>
                          </div>
                          <Badge status="aguardando">Aguardando vaga</Badge>
                        </div>
                        {!dispProps.length ? (
                          <div style={{ fontSize: 12, color: CLR.muted, padding: "8px 0" }}>Nenhuma vaga disponível neste condomínio.</div>
                        ) : (
                          <>
                            <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>Vagas disponíveis</div>
                            {dispProps.map((p) => {
                              const valor = p.diaria * dias;
                              return (
                                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: CLR.bg, borderRadius: 6, marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                                  <div>
                                    <span style={{ fontSize: 13, color: CLR.text, fontWeight: 500 }}>Vaga {p.vaga}</span>
                                    <span style={{ fontSize: 12, color: CLR.muted, marginLeft: 8 }}>{p.nome}</span>
                                    {p.obs && <div style={{ fontSize: 11, color: CLR.muted }}>{p.obs}</div>}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontSize: 12, color: CLR.green, fontWeight: 500 }}>R${valor.toLocaleString("pt-BR")}</div>
                                      <div style={{ fontSize: 10, color: CLR.muted }}>R${p.diaria}/dia × {dias}d</div>
                                    </div>
                                    <Btn variant="success" small onClick={() => criarReserva(l.id, p.id, valor)}>Reservar</Btn>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </Card>
            );
          })()}
        </div>
      </div>

      {/* PIX MODAL */}
      {pixReserva && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: CLR.surf, border: `1px solid ${CLR.b2}`, borderRadius: 12, padding: 24, maxWidth: 460, width: "100%" }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Instrução de pagamento Pix</div>
            <div style={{ fontSize: 12, color: CLR.muted, marginBottom: 20 }}>Envie esta instrução para o locatário realizar o pagamento.</div>
            <div style={{ background: CLR.bg, border: `1px solid ${CLR.b2}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: CLR.muted }}>Locatário</span><span style={{ fontSize: 13, fontWeight: 500, color: CLR.text }}>{pixReserva.locNome}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: CLR.muted }}>Vaga</span><span style={{ fontSize: 13, fontWeight: 500, color: CLR.text }}>Vaga {pixReserva.vaga} · {condoNome(pixReserva.condoId)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: CLR.muted }}>Período</span><span style={{ fontSize: 13, fontWeight: 500, color: CLR.text }}>{fmtDate(pixReserva.dataIn)} → {fmtDate(pixReserva.dataOut)} ({pixReserva.dias} dias)</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: CLR.muted }}>Valor total</span><span style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 700, color: CLR.green }}>R${pixReserva.valor.toLocaleString("pt-BR")}</span></div>
            </div>
            <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 6, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Chave Pix</div>
            <div style={{ background: CLR.surf2, border: `1px solid ${CLR.b2}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: CLR.cyan, fontFamily: "monospace", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span>31984267997</span>
              <Btn variant="ghost" small onClick={copyPix}>Copiar</Btn>
            </div>
            <div style={{ fontSize: 12, color: CLR.muted, marginBottom: 16 }}>Chave: Telefone · Destinatário: VagUp Gerenciamento de Vagas</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Btn variant="success" onClick={confirmPix}>✓ Confirmar pagamento recebido</Btn>
              <Btn variant="ghost" onClick={() => setPixReservaId(null)}>Fechar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* EDITAR DIAS MODAL */}
      {editDiasProp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: CLR.surf, border: `1px solid ${CLR.b2}`, borderRadius: 12, padding: 24, maxWidth: 420, width: "100%" }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Editar disponibilidade</div>
            <div style={{ fontSize: 12, color: CLR.cyan, marginBottom: 12 }}>{editDiasProp.nome} · Vaga {editDiasProp.vaga}</div>
            <div style={{ fontSize: 11, color: CLR.muted, marginBottom: 12 }}>Clique nos dias disponíveis. Dias não selecionados ficam bloqueados.</div>
            <Calendario selected={editDias} onChange={setEditDias} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <Btn variant="success" onClick={saveEditDias}>Salvar disponibilidade</Btn>
              <Btn variant="ghost" onClick={() => setEditDiasPropId(null)}>Cancelar</Btn>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform .2s; }
          .admin-main { margin-left: 0 !important; }
          .admin-mob-toggle { display: flex !important; }
          .admin-dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
