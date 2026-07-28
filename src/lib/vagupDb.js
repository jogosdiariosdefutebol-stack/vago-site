export const DB_KEY = "vagup_data";
export const ADMIN_SENHA = "vagup2024";

export function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return { condos: [], props: [], locs: [], reservas: [] };
  const parsed = JSON.parse(raw);
  return {
    condos: parsed.condos || [],
    props: parsed.props || [],
    locs: parsed.locs || [],
    reservas: parsed.reservas || [],
  };
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function fmtDate(d) {
  if (!d) return "—";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}

export function diasEntre(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)));
}
