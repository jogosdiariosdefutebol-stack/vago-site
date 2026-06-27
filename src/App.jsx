import React, { useState } from "react";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Building2,
  AlertTriangle,
  UserX,
  Search,
  Calendar,
  Globe,
  CheckCircle2,
  CreditCard,
  ClipboardList,
  Shield,
  ShieldOff,
  Lock,
  Activity,
  FileCheck,
  Home,
  Users,
  Building,
  DollarSign,
  SlidersHorizontal,
  FileX,
  Smartphone,
  Clock,
  UserCheck,
  Briefcase,
  Layers,
  BedDouble,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Twitter,
  Menu,
  X,
  Smile,
  Zap,
  Grid3x3,
  Target,
  Eye,
  Heart,
  Send,
  Star,
} from "lucide-react";

const GOOGLE_FORM_CONFIG = {
  baseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdPam6RtS8n7eiOsLYbVw-wcfU7NC9urfpjsaaXfjmqYoZlBA/viewform",
  fields: {
    nome: "entry.140771754",
    telefone: "entry.1728843061",
    email: "entry.1083440093",
    cidade: "entry.1414637599",
    bairro: "entry.1970679789",
    rua: "entry.1060476676",
    condominio: "entry.898485450",
    perfil: "entry.1503803496",
  },
};

function buildGoogleFormUrl(data) {
  const params = new URLSearchParams();
  if (data.nome) params.append(GOOGLE_FORM_CONFIG.fields.nome, data.nome);
  if (data.telefone) params.append(GOOGLE_FORM_CONFIG.fields.telefone, data.telefone);
  if (data.email) params.append(GOOGLE_FORM_CONFIG.fields.email, data.email);
  if (data.cidade) params.append(GOOGLE_FORM_CONFIG.fields.cidade, data.cidade);
  if (data.bairro) params.append(GOOGLE_FORM_CONFIG.fields.bairro, data.bairro);
  if (data.rua) params.append(GOOGLE_FORM_CONFIG.fields.rua, data.rua);
  if (data.condominio) params.append(GOOGLE_FORM_CONFIG.fields.condominio, data.condominio);
  if (data.perfil && data.perfil.length > 0) {
    data.perfil.forEach((p) => params.append(GOOGLE_FORM_CONFIG.fields.perfil, p));
  }
  return `${GOOGLE_FORM_CONFIG.baseUrl}?${params.toString()}`;
}

const C = {
  navy: "#0F172A",
  navyLight: "#162236",
  navyDeep: "#070B14",
  cyan: "#06B6D4",
  cyanLight: "#0EA5E9",
  green: "#10B981",
  purple: "#8B5CF6",
  amber: "#F59E0B",
  blue: "#2563EB",
  white: "#FFFFFF",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  darkBorder: "rgba(6,182,212,0.2)",
};

const fontH = "'Clash Display', 'Poppins', sans-serif";
const fontB = "'Inter', sans-serif";

/* Mini label — substitui o badge pill */
function Label({ children, color = C.cyanLight, dark = true }) {
  return (
    <p style={{
      fontFamily: fontH,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: dark ? color : C.gray500,
      margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

function Logo({ size = 26 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", fontFamily: fontH, fontWeight: 700, fontSize: size }}>
      <span style={{ color: C.white }}>Vag</span>
      <span style={{ color: C.cyanLight, marginLeft: 1 }}>Up</span>
    </span>
  );
}

function PrimaryButton({ children, style, big = false, href }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} style={{
      background: C.cyanLight, color: C.white, border: "none", borderRadius: 10,
      padding: big ? "16px 28px" : "12px 22px",
      fontFamily: fontH, fontWeight: 600,
      fontSize: big ? 14 : 13,
      letterSpacing: "0.04em", textTransform: "uppercase",
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
      whiteSpace: "nowrap", textDecoration: "none", ...style,
    }}>
      {children}
    </Tag>
  );
}

function SecondaryButton({ children, style, href, onDark = true }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} style={{
      background: "transparent",
      color: onDark ? C.white : C.navy,
      border: `1px solid ${onDark ? "rgba(255,255,255,0.25)" : C.gray200}`,
      borderRadius: 10, padding: "12px 22px",
      fontFamily: fontH, fontWeight: 600, fontSize: 13,
      letterSpacing: "0.04em", textTransform: "uppercase",
      cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none",
      display: "inline-flex", alignItems: "center", justifyContent: "center", ...style,
    }}>
      {children}
    </Tag>
  );
}

/* Heading para seções — light = texto branco (dark bg), !light = texto navy (white bg) */
function SectionHeading({ label, labelColor, title, titleAccent, light = true, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 44 }}>
      <Label color={labelColor || (light ? C.cyanLight : C.gray500)} dark={light}>{label}</Label>
      <h2 style={{
        fontFamily: fontH, fontWeight: 700,
        fontSize: "clamp(28px, 4vw, 42px)",
        lineHeight: 1.15,
        color: light ? C.white : C.navy,
        margin: 0, letterSpacing: "-0.025em",
      }}>
        {title}
        {titleAccent && (
          <><br /><span style={{ color: light ? C.cyanLight : C.cyanLight }}>{titleAccent}</span></>
        )}
      </h2>
    </div>
  );
}

/* ============== NAVBAR ============== */
function NavBar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Início", href: "#inicio" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Segurança", href: "#seguranca" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Para Quem", href: "#para-quem" },
    { label: "Nossa Missão", href: "#missao" },
    { label: "Contato", href: "#contato" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: C.navy, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#inicio" style={{ textDecoration: "none" }}><Logo size={24} /></a>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="nav-links-desktop">
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: fontH, fontWeight: 500, fontSize: 13 }}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <PrimaryButton href="#cadastro" style={{ display: window.innerWidth < 900 ? "none" : "inline-flex" }}>Me Cadastrar</PrimaryButton>
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "none" }} className="nav-burger">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ============== HERO ============== */
function Hero() {
  return (
    <section id="inicio" style={{
      position: "relative",
      overflow: "hidden",
      padding: "120px 24px 100px",
      // imagem de fundo com overlay escuro
      background: C.navy,
    }}>
      {/* Garagem background com opacidade */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/garagem.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.18,
      }} />
      {/* Gradiente sobre a imagem */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to bottom, ${C.navy}cc 0%, ${C.navy}88 50%, ${C.navy}ee 100%)`,
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Frase simples sem pill */}
        <p style={{ fontFamily: fontH, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.cyanLight, margin: "0 0 24px" }}>
          Gerenciamento inteligente de vagas
        </p>

        <h1 style={{
          fontFamily: fontH, fontWeight: 700,
          fontSize: "clamp(48px, 7vw, 88px)",
          lineHeight: 1.04,
          color: C.white,
          maxWidth: "80%",
          margin: "0 auto",
          letterSpacing: "-0.03em",
        }}>
          Sua vaga vazia
          <br />
          <span style={{ color: C.cyanLight }}>pode gerar valor.</span>
        </h1>

        <p style={{
          fontFamily: fontB, fontSize: 17, lineHeight: 1.65,
          color: "rgba(255,255,255,0.55)",
          marginTop: 24, maxWidth: 480,
          marginLeft: "auto", marginRight: "auto",
        }}>
          A VagUp conecta vagas ociosas a moradores e hóspedes autorizados dentro do próprio condomínio — seguro, simples e no seu controle.
        </p>

        <div style={{ display: "flex", gap: 14, marginTop: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryButton big href="#cadastro">Me Cadastrar <ArrowRight size={16} /></PrimaryButton>
          <SecondaryButton href="#como-funciona" style={{ padding: "16px 28px", fontSize: 14 }}>Quero Saber Mais</SecondaryButton>
        </div>
      </div>
    </section>
  );
}

/* ============== PROBLEMA ============== */
function ParkingGrid() {
  const slots = [
    { occupied: true }, { occupied: false }, { occupied: false }, { occupied: true }, { occupied: false },
    { occupied: false }, { occupied: true }, { occupied: false }, { occupied: false }, { occupied: true },
  ];
  return (
    <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 18, padding: 28 }}>
      <p style={{ textAlign: "center", fontFamily: fontH, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", color: C.gray500, textTransform: "uppercase", margin: "0 0 6px" }}>
        Mapa de vagas — Bloco A
      </p>
      <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 11, color: C.gray400, margin: "0 0 16px" }}>Fila 1</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {slots.slice(0, 5).map((s, i) => <Slot key={i} occupied={s.occupied} />)}
      </div>
      <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 11, color: C.gray400, margin: "16px 0" }}>Fila 2</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {slots.slice(5).map((s, i) => <Slot key={i} occupied={s.occupied} />)}
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20 }}>
        <LegendItem color="#CFFAFE" border="#7DD3FC" label="Vaga disponível" />
        <LegendItem color={C.navy} border={C.navy} label="Vaga ocupada" />
      </div>
      <div style={{ marginTop: 20, background: C.navy, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: fontH, fontWeight: 700, fontSize: 32, color: C.cyanLight }}>60%</span>
        <span style={{ fontFamily: fontB, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
          das vagas em condomínios ficam ociosas em horários de pico
        </span>
      </div>
    </div>
  );
}

function Slot({ occupied }) {
  return (
    <div style={{
      aspectRatio: "1", borderRadius: 10,
      background: occupied ? C.navy : "#CFFAFE",
      border: `1.5px dashed ${occupied ? C.navy : "#7DD3FC"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontFamily: fontH, fontWeight: 700, color: occupied ? C.white : C.cyanLight, fontSize: 13 }}>P</span>
    </div>
  );
}

function LegendItem({ color, border, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: color, border: `1.5px dashed ${border}` }} />
      <span style={{ fontFamily: fontB, fontSize: 12, color: C.gray500 }}>{label}</span>
    </div>
  );
}

function Problema() {
  const items = [
    { icon: TrendingUp, title: "Infraestrutura subutilizada", text: "Vagas permanecem vazias enquanto poderiam gerar valor para o condomínio." },
    { icon: AlertTriangle, title: "Perda de oportunidade", text: "Proprietários perdem renda potencial com vagas paradas sem nenhum controle." },
    { icon: UserX, title: "Desorganização informal", text: "Acordos informais e sem controle geram conflitos e insegurança jurídica." },
    { icon: Search, title: "Falta de visibilidade", text: "Ninguém sabe quais vagas estão disponíveis em cada momento do dia." },
  ];
  return (
    <section style={{ background: C.white, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="O Problema" light={false} title="Milhares de vagas ficam" titleAccent="vazias todos os dias." />
        <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 16, color: C.gray500, maxWidth: 560, margin: "-24px auto 48px", lineHeight: 1.65 }}>
          Enquanto algumas pessoas enfrentam dificuldades para estacionar, diversas vagas permanecem sem utilização dentro do mesmo condomínio.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }} className="problema-grid">
          <ParkingGrid />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <div key={i} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: 20, display: "flex", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#CFFAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={19} color={C.cyanLight} />
                  </div>
                  <div>
                    <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 15, color: C.navy, margin: 0 }}>{it.title}</p>
                    <p style={{ fontFamily: fontB, fontSize: 13.5, color: C.gray500, margin: "4px 0 0", lineHeight: 1.5 }}>{it.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== SOLUÇÃO ============== */
function Solucao() {
  return (
    <section style={{ background: C.navy, padding: "56px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Label color={C.green}>A Solução</Label>
        <h2 style={{ fontFamily: fontH, fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: C.white, margin: 0, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
          Uma nova forma de aproveitar<br />
          <span style={{ color: C.green }}>o que já existe.</span>
        </h2>
        <p style={{ fontFamily: fontB, fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 20, lineHeight: 1.65 }}>
          A VagUp cria uma rede privada dentro do condomínio que permite disponibilizar vagas temporariamente para usuários autorizados — sempre por decisão do proprietário.
        </p>
      </div>
    </section>
  );
}

/* ============== BENEFÍCIOS — 3 colunas iguais ============== */
function Beneficios() {
  const cols = [
    {
      icon: Home, title: "Proprietários", subtitle: "Transforme vagas em renda",
      items: [
        { icon: DollarSign, text: "Ganham renda com vagas ociosas" },
        { icon: SlidersHorizontal, text: "Controle total da disponibilidade" },
        { icon: FileX, text: "Sem burocracia" },
      ],
      accent: C.cyanLight, btn: C.cyanLight,
    },
    {
      icon: Users, title: "Moradores e Hóspedes", subtitle: "Praticidade no dia a dia",
      items: [
        { icon: Smartphone, text: "Reserva digital simples" },
        { icon: Clock, text: "Mais praticidade no cotidiano" },
        { icon: UserCheck, text: "Facilidade para visitantes" },
      ],
      accent: C.green, btn: C.green,
    },
    {
      icon: Building, title: "Condomínios", subtitle: "Gestão inteligente de ativos",
      items: [
        { icon: TrendingUp, text: "Melhor aproveitamento dos ativos" },
        { icon: CheckCircle2, text: "Mais organização e controle" },
        { icon: Heart, text: "Maior satisfação dos moradores" },
      ],
      accent: C.purple, btn: C.purple,
    },
  ];

  return (
    <section id="beneficios" style={{ background: C.white, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="Benefícios" light={false} title="Para cada perfil," titleAccent="uma vantagem real." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="beneficios-grid">
          {cols.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 18, padding: 28, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.accent}14`, border: `1px solid ${c.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} color={c.accent} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: fontH, fontWeight: 700, fontSize: 17, color: C.navy, margin: 0 }}>{c.title}</h3>
                    <p style={{ fontFamily: fontB, fontSize: 12, color: C.gray500, margin: 0 }}>{c.subtitle}</p>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${C.gray200}`, marginBottom: 18 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  {c.items.map((it, j) => {
                    const ItIcon = it.icon;
                    return (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.white, border: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ItIcon size={14} color={c.accent} />
                        </div>
                        <span style={{ fontFamily: fontB, fontSize: 13.5, color: C.gray600 }}>{it.text}</span>
                      </div>
                    );
                  })}
                </div>
                <PrimaryButton href="#cadastro" style={{ background: c.btn, marginTop: 24, justifyContent: "center" }}>Quero Fazer Parte</PrimaryButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============== SEGURANÇA ============== */
function StarRating({ rating = 5, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= rating ? "#FBBF24" : "rgba(255,255,255,0.1)"}>
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ name, role, rating, text, tag, tagColor }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  return (
    <div style={{ background: C.navyLight, border: `1px solid ${C.darkBorder}`, borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(6,182,212,0.15)", border: `1px solid rgba(6,182,212,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontH, fontWeight: 700, fontSize: 13, color: C.cyanLight, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 13.5, color: C.white, margin: 0 }}>
            {name}<sup style={{ fontSize: 10, marginLeft: 1, color: "rgba(255,255,255,0.35)" }}>*</sup>
          </p>
          <p style={{ fontFamily: fontB, fontSize: 11.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>{role}</p>
        </div>
        <span style={{ fontFamily: fontH, fontSize: 10, fontWeight: 600, color: tagColor, background: `${tagColor}18`, border: `1px solid ${tagColor}40`, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
          {tag}
        </span>
      </div>
      <StarRating rating={rating} />
      <p style={{ fontFamily: fontB, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: "10px 0 0" }}>{text}</p>
    </div>
  );
}

function Seguranca() {
  const items = [
    { icon: Building2, title: "Uso restrito ao condomínio", text: "A plataforma opera exclusivamente dentro do ambiente condominial, sem abertura ao público externo." },
    { icon: Star, title: "Avaliação bilateral", text: "Avalie os usuários após cada reserva para garantir mais segurança e confiança em toda a comunidade." },
    { icon: ShieldOff, title: "Sem acesso ao público externo", text: "Apenas moradores, visitantes e hóspedes previamente autorizados têm acesso ao sistema." },
    { icon: Lock, title: "Controle digital das reservas", text: "Cada reserva é registrada digitalmente, com identificação do usuário e horário de uso." },
    { icon: Activity, title: "Rastreamento das utilizações", text: "Histórico completo de quem usou qual vaga, quando e por quanto tempo." },
    { icon: FileCheck, title: "Respeito às normas internas", text: "A plataforma é configurada de acordo com o regulamento interno de cada condomínio." },
  ];

  return (
    <section id="seguranca" style={{ background: C.navy, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Título com ícone ao lado */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Label color={C.green}>Segurança</Label>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
            <Shield size={36} color={C.cyanLight} strokeWidth={1.5} />
            <h2 style={{ fontFamily: fontH, fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: C.white, margin: 0, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              Segurança em <span style={{ color: C.cyanLight }}>primeiro lugar.</span>
            </h2>
          </div>
          <p style={{ fontFamily: fontB, fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "16px auto 0", lineHeight: 1.65 }}>
            Desenvolvemos a VagUp com foco obsessivo em segurança — para o condomínio, para os moradores e para os síndicos.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }} className="seguranca-grid">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} style={{ background: C.navyLight, border: `1px solid ${C.darkBorder}`, borderRadius: 16, padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(6,182,212,0.1)", border: `1px solid rgba(6,182,212,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={19} color={C.cyanLight} />
                </div>
                <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 15, color: C.white, margin: 0 }}>{it.title}</p>
                <p style={{ fontFamily: fontB, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "6px 0 0", lineHeight: 1.5 }}>{it.text}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", margin: "48px 0 28px" }}>
          <p style={{ fontFamily: fontH, fontWeight: 700, fontSize: 19, color: C.white, margin: "0 0 8px", letterSpacing: "-0.01em" }}>Confiança construída por quem usa.</p>
          <p style={{ fontFamily: fontB, fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Cada reserva gera uma avaliação bilateral — anfitrião avalia locatário, locatário avalia anfitrião.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 36 }} className="reviews-grid">
          <ReviewCard name="Marina Costa" role="Anfitriã · Bloco A" rating={5} tag="Anfitriã" tagColor={C.cyanLight} text="Aluguei minha vaga várias vezes para visitantes do meu vizinho. Sempre devolveram tudo certinho e o pagamento cai automático." />
          <ReviewCard name="Rafael Lima" role="Locatário · Visitante autorizado" rating={5} tag="Locatário" tagColor={C.green} text="Precisava de vaga pra visita da família e resolvi em 2 minutos pelo app. Processo super transparente e seguro." />
          <ReviewCard name="Patrícia Souza" role="Anfitriã · Bloco C" rating={5} tag="Anfitriã" tagColor={C.cyanLight} text="Trabalho em Belo Horizonte e moro no interior. Nos fins de semana minha vaga ficava vazia — agora alugo e rentabilizo nesses dias." />
          <ReviewCard name="Eduardo Martins" role="Locatário · Hóspede Airbnb" rating={5} tag="Locatário" tagColor={C.green} text="Estava hospedado no condomínio e consegui uma vaga avaliada e segura sem precisar negociar com ninguém pessoalmente." />
        </div>
        <p style={{ fontFamily: fontB, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 36 }}>
          * Depoimentos ilustrativos para fins de demonstração. A VagUp ainda não possui usuários reais.
        </p>

        <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
          <Shield size={20} color={C.green} style={{ flexShrink: 0 }} />
          <p style={{ fontFamily: fontB, fontSize: 14.5, color: "rgba(255,255,255,0.8)", margin: 0 }}>
            A VagUp <span style={{ color: C.green, fontWeight: 700 }}>NÃO é um estacionamento público.</span> É uma plataforma privada e condominial.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============== COMO FUNCIONA ============== */
function ComoFunciona() {
  const steps = [
    { num: 1, icon: ClipboardList, title: "Cadastro da vaga", text: "O proprietário cadastra sua vaga informando localização, dimensões e condições de uso.", color: C.cyanLight },
    { num: 2, icon: Calendar, title: "Definição de disponibilidade", text: "Define os períodos em que a vaga estará disponível — diária, mensal ou recorrente.", color: C.purple },
    { num: 3, icon: Globe, title: "Publicação automática", text: "A vaga é publicada automaticamente para os usuários autorizados do condomínio.", color: C.blue },
    { num: 4, icon: CheckCircle2, title: "Reserva por usuário", text: "Morador, visitante ou hóspede visualiza e reserva a vaga em segundos pelo app.", color: C.green },
    { num: 5, icon: CreditCard, title: "Gestão de pagamentos", text: "Pagamentos processados digitalmente com repasse automático ao proprietário.", color: C.amber },
  ];

  return (
    <section id="como-funciona" style={{ background: C.white, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="Como Funciona" light={false} title="Em 5 passos simples," titleAccent="sua vaga começa a trabalhar." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, position: "relative" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${s.color}12`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={26} color={s.color} />
                  </div>
                  <div style={{ position: "absolute", top: -4, right: "calc(50% - 38px)", width: 22, height: 22, borderRadius: "50%", background: s.color, color: C.white, fontFamily: fontH, fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.num}
                  </div>
                </div>
                <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 14.5, color: C.navy, margin: "0 0 6px" }}>{s.title}</p>
                <p style={{ fontFamily: fontB, fontSize: 12.5, color: C.gray500, lineHeight: 1.5, margin: 0 }}>{s.text}</p>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
          <PrimaryButton big href="#cadastro">Me Cadastrar na VagUp</PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ============== PARA QUEM ============== */
function ParaQuem() {
  const items = [
    { icon: Home, title: "Condomínios Residenciais", text: "Otimize as vagas disponíveis e aumente a satisfação dos moradores com uma gestão moderna.", accent: C.cyanLight },
    { icon: Briefcase, title: "Condomínios Comerciais", text: "Gerencie vagas para funcionários, clientes e visitantes com total controle e rastreabilidade.", accent: C.purple },
    { icon: Layers, title: "Empreendimentos Mistos", text: "Integre a gestão de vagas de múltiplos blocos e usos em uma única plataforma inteligente.", accent: C.green },
    { icon: BedDouble, title: "Locações por Temporada", text: "Facilite o acesso de hóspedes Airbnb e plataformas similares às vagas do condomínio.", accent: C.amber },
    { icon: ClipboardList, title: "Administradoras", text: "Ofereça um diferencial competitivo real com tecnologia de gestão de vagas para seus clientes.", accent: "#EF4444" },
    { icon: UserCheck, title: "Síndicos", text: "Assuma o controle total da utilização das vagas e melhore a gestão do seu condomínio.", accent: C.blue },
  ];

  return (
    <section id="para-quem" style={{ background: C.navy, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="Para Quem é a VagUp" light={true} title="Feita para quem gerencia" titleAccent="e vive em condomínios." />
        <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "-24px auto 48px", lineHeight: 1.65 }}>
          A VagUp foi pensada para atender as necessidades de todos os perfis do ambiente condominial.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="para-quem-grid">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} style={{ background: C.navyLight, border: `1px solid ${C.darkBorder}`, borderRadius: 16, padding: 26 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `${it.accent}14`, border: `1px solid ${it.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={21} color={it.accent} />
                </div>
                <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 16, color: C.white, margin: 0 }}>{it.title}</p>
                <p style={{ fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.5)", margin: "8px 0 16px", lineHeight: 1.5 }}>{it.text}</p>
                <a href="#cadastro" style={{ fontFamily: fontH, fontWeight: 600, fontSize: 13, color: it.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Saber mais <ArrowRight size={13} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============== IMPACTO ============== */
function Impacto() {
  const items = [
    { icon: Smile, value: "92", suffix: "%", title: "Mais conveniência", text: "dos moradores relatam maior satisfação", color: C.cyanLight },
    { icon: Zap, value: "3", suffix: "x", title: "Mais eficiência", text: "mais aproveitamento das vagas", color: C.green },
    { icon: Grid3x3, value: "85", suffix: "%", title: "Mais organização", text: "redução de conflitos por vagas", color: C.purple },
    { icon: TrendingUp, value: "60", suffix: "%", title: "Geração de renda", text: "a mais em média por proprietário", color: C.amber },
  ];

  return (
    <section style={{ background: C.gray50, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="Impacto" light={false} title="Transformando espaços ociosos" titleAccent="em oportunidades." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="impacto-grid">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: 26 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${it.color}12`, border: `1px solid ${it.color}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={19} color={it.color} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontFamily: fontH, fontWeight: 700, fontSize: 38, color: it.color }}>{it.value}</span>
                  <span style={{ fontFamily: fontH, fontWeight: 700, fontSize: 18, color: it.color }}>{it.suffix}<sup style={{ fontSize: 10 }}>*</sup></span>
                </div>
                <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 15, color: C.navy, margin: "6px 0 2px" }}>{it.title}</p>
                <p style={{ fontFamily: fontB, fontSize: 12.5, color: C.gray500, margin: "0 0 14px" }}>{it.text}</p>
                <div style={{ height: 3, background: C.gray200, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: it.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily: fontB, fontSize: 11, color: C.gray400, marginTop: 14 }}>
          * Números ilustrativos para fins de demonstração. A VagUp ainda não possui operação em escala.
        </p>
      </div>
    </section>
  );
}

/* ============== MISSÃO ============== */
function Missao() {
  const valores = [
    { title: "Confiança e Transparência", text: "Criamos conexões seguras entre pessoas que compartilham o mesmo ambiente condominial." },
    { title: "Simplicidade", text: "A experiência deve ser intuitiva para moradores, síndicos, administradoras e hóspedes." },
    { title: "Aproveitamento Inteligente", text: "Acreditamos que ativos já existentes podem gerar mais valor quando utilizados de forma eficiente." },
    { title: "Respeito às Regras Condominiais", text: "Nosso modelo foi desenvolvido para funcionar dentro da realidade dos condomínios." },
    { title: "Benefício Compartilhado", text: "A VagUp cresce quando gera conveniência para quem precisa estacionar e renda para quem tem vaga." },
    { title: "Cidades Mais Organizadas", text: "Cada vaga ociosa reaproveitada é um carro fora da rua — infraestrutura a serviço de cidades melhores." },
  ];

  return (
    <section id="missao" style={{ background: C.white, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading light={false} label="Nossa Missão" title="Por que criamos a" titleAccent="VagUp?" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 36 }} className="missao-grid">
          <div style={{ background: C.navy, borderRadius: 18, padding: 28 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(6,182,212,0.12)", border: `1px solid rgba(6,182,212,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Target size={20} color={C.cyanLight} />
            </div>
            <p style={{ fontFamily: fontH, fontWeight: 700, fontSize: 18, color: C.white, margin: "0 0 10px" }}>Missão</p>
            <p style={{ fontFamily: fontB, fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
              Transformar vagas de garagem subutilizadas em oportunidades de conveniência e geração de renda por meio de tecnologia simples e eficiente.
            </p>
          </div>
          <div style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 18, padding: 28 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(16,185,129,0.1)", border: `1px solid rgba(16,185,129,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Eye size={20} color={C.green} />
            </div>
            <p style={{ fontFamily: fontH, fontWeight: 700, fontSize: 18, color: C.navy, margin: "0 0 10px" }}>Visão</p>
            <p style={{ fontFamily: fontB, fontSize: 14, color: C.gray500, lineHeight: 1.65, margin: 0 }}>
              Ser a principal plataforma de compartilhamento e gestão de vagas condominiais do Brasil, referência em inovação urbana e inteligência de espaços.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Heart size={17} color={C.purple} />
          <p style={{ fontFamily: fontH, fontWeight: 700, fontSize: 17, color: C.navy, margin: 0 }}>Valores</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="valores-grid">
          {valores.map((v, i) => (
            <div key={i} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircle2 size={16} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 14, color: C.navy, margin: "0 0 5px" }}>{v.title}</p>
                  <p style={{ fontFamily: fontB, fontSize: 13, color: C.gray500, lineHeight: 1.5, margin: 0 }}>{v.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== CADASTRO ============== */
function Cadastro() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cidade: "", bairro: "", rua: "", condominio: "", perfil: [] });
  const [sent, setSent] = useState(false);
  const perfilOptions = ["Locatário", "Proprietário", "Síndico/Administrador", "Investidor"];

  const togglePerfil = (p) => setForm((f) => ({ ...f, perfil: f.perfil.includes(p) ? f.perfil.filter((x) => x !== p) : [...f.perfil, p] }));
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.email) return;
    window.open(buildGoogleFormUrl(form), "_blank");
    setSent(true);
  };

  const inputStyle = { width: "100%", padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.gray200}`, fontFamily: fontB, fontSize: 14, color: C.navy, background: C.white, outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontFamily: fontH, fontWeight: 600, fontSize: 13, color: C.navy, marginBottom: 7, display: "block" };

  return (
    <section id="cadastro" style={{ background: C.navy, padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHeading label="Cadastro" light={true} title="Faça parte da revolução" titleAccent="condominial." />
        <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "-24px auto 44px", lineHeight: 1.65 }}>
          Preencha o formulário abaixo e seja um dos primeiros a ter acesso à plataforma VagUp.
        </p>
        <div style={{ maxWidth: 720, margin: "0 auto", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: 40 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: `1px solid rgba(16,185,129,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <CheckCircle2 size={28} color={C.green} />
              </div>
              <p style={{ fontFamily: fontH, fontWeight: 700, fontSize: 18, color: C.navy, margin: "0 0 8px" }}>Quase lá!</p>
              <p style={{ fontFamily: fontB, fontSize: 14, color: C.gray500, lineHeight: 1.6 }}>
                Abrimos o formulário de confirmação em uma nova aba. Finalize o envio por lá para garantir seu cadastro.
              </p>
              <button onClick={() => setSent(false)} style={{ marginTop: 18, background: "none", border: "none", color: C.cyanLight, fontFamily: fontH, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Preencher novamente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }} className="form-grid-2">
                <div><label style={labelStyle}>Nome *</label><input style={inputStyle} placeholder="Seu nome completo" value={form.nome} onChange={handleChange("nome")} required /></div>
                <div><label style={labelStyle}>Telefone</label><input style={inputStyle} placeholder="(11) 99999-9999" value={form.telefone} onChange={handleChange("telefone")} /></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>E-mail *</label>
                <input type="email" style={inputStyle} placeholder="seu@email.com" value={form.email} onChange={handleChange("email")} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }} className="form-grid-2">
                <div><label style={labelStyle}>Cidade</label><input style={inputStyle} placeholder="Belo Horizonte" value={form.cidade} onChange={handleChange("cidade")} /></div>
                <div><label style={labelStyle}>Bairro</label><input style={inputStyle} placeholder="Seu bairro" value={form.bairro} onChange={handleChange("bairro")} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }} className="form-grid-2">
                <div><label style={labelStyle}>Rua</label><input style={inputStyle} placeholder="Nome da rua" value={form.rua} onChange={handleChange("rua")} /></div>
                <div><label style={labelStyle}>Condomínio</label><input style={inputStyle} placeholder="Nome do condomínio" value={form.condominio} onChange={handleChange("condominio")} /></div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Qual é o seu perfil? (pode selecionar mais de um)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                  {perfilOptions.map((p) => {
                    const active = form.perfil.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => togglePerfil(p)} style={{ padding: "10px 18px", borderRadius: 999, border: `1.5px solid ${active ? C.navy : C.gray200}`, background: active ? C.navy : C.white, color: active ? C.white : C.navy, fontFamily: fontH, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="submit" style={{ width: "100%", background: C.navy, color: C.white, border: "none", borderRadius: 12, padding: "16px 24px", fontFamily: fontH, fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                Quero Fazer Parte da VagUp <Send size={16} />
              </button>
              <p style={{ textAlign: "center", fontFamily: fontB, fontSize: 12, color: C.gray400, marginTop: 14 }}>
                Seus dados estão protegidos. Nunca compartilharemos suas informações.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============== CTA FINAL ============== */
function CtaFinal() {
  return (
    <section id="lancamento" style={{ background: C.navyLight, padding: "72px 24px", textAlign: "center", borderTop: `1px solid ${C.darkBorder}` }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.cyanLight}>Para condomínios e administradoras</Label>
        <h2 style={{ fontFamily: fontH, fontWeight: 700, fontSize: "clamp(28px, 4.5vw, 44px)", color: C.white, marginTop: 8, lineHeight: 1.2, letterSpacing: "-0.025em" }}>
          Leve a VagUp para o seu <span style={{ color: C.cyanLight }}>condomínio.</span>
        </h2>
        <p style={{ fontFamily: fontB, fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 18, lineHeight: 1.65 }}>
          Entre em contato e descubra como implementar a VagUp no seu condomínio, sem custo de adesão para os moradores.
        </p>
        <div style={{ marginTop: 32 }}>
          <PrimaryButton big href="#cadastro">Me Cadastrar <ArrowRight size={16} /></PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ============== FOOTER ============== */
function Footer() {
  const navLinks = ["Início", "Como Funciona", "Benefícios", "Segurança", "Para Quem", "Nossa Missão"];
  const legalLinks = ["Política de Privacidade", "Termos de Uso", "Cookies"];
  return (
    <footer id="contato" style={{ background: C.navyDeep, padding: "56px 24px 28px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40 }} className="footer-grid">
          <div>
            <Logo size={22} />
            <p style={{ fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginTop: 16, maxWidth: 280 }}>
              Transformando vagas de garagem ociosas em conveniência e geração de renda dentro dos condomínios.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="rgba(255,255,255,0.5)" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 16px" }}>Navegação</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {navLinks.map((l, i) => <a key={i} href="#inicio" style={{ fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: fontH, fontWeight: 600, fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 16px" }}>Contato</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <a href="mailto:gerenciamento.vago@gmail.com" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                <Mail size={14} /> gerenciamento.vago@gmail.com
              </a>
              <a href="tel:+5531984267997" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                <Phone size={14} /> +55 (31) 98426-7997
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fontB, fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>
                <MapPin size={14} /> Belo Horizonte, MG — Brasil
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 40, paddingTop: 22 }}>
          <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
            {legalLinks.map((l, i) => <a key={i} href="#" style={{ fontFamily: fontB, fontSize: 12.5, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{l}</a>)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontFamily: fontB, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 VagUp. Todos os direitos reservados.</p>
            <p style={{ fontFamily: fontB, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Soluções inteligentes para uma cidade em movimento.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============== ROOT ============== */
export default function VagupLanding() {
  return (
    <div style={{ background: C.navy, fontFamily: fontB }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; overflow-x: hidden; background: #0F172A; }
        a:hover { opacity: 0.75; }
        button:hover { opacity: 0.88; }
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .problema-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .seguranca-grid { grid-template-columns: 1fr !important; }
          .para-quem-grid { grid-template-columns: 1fr !important; }
          .impacto-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .missao-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .valores-grid { grid-template-columns: 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .beneficios-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .seguranca-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .para-quem-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .impacto-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .valores-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .beneficios-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <NavBar />
      <Hero />
      <Problema />
      <Solucao />
      <Beneficios />
      <Seguranca />
      <ComoFunciona />
      <ParaQuem />
      <Impacto />
      <Missao />
      <Cadastro />
      <CtaFinal />
      <Footer />
    </div>
  );
}
