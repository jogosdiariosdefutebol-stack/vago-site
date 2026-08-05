import { supabase } from "./supabase";

export function fmtDate(d) {
  if (!d) return "—";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}

export function diasEntre(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)));
}

/* ── row <-> model mapping (Postgres snake_case <-> app camelCase) ── */

function condoFromRow(r) {
  return { id: r.id, nome: r.nome, endereco: r.endereco, apts: r.apts, vagas: r.vagas, sindico: r.sindico, obs: r.obs, ativo: r.ativo, criadoEm: r.criado_em };
}
function propFromRow(r) {
  return { id: r.id, nome: r.nome, tel: r.tel, vaga: r.vaga, diaria: Number(r.diaria), condoId: r.condo_id, obs: r.obs, diasDisponiveis: r.dias_disponiveis || [], status: r.status, origem: r.origem, criadoEm: r.criado_em };
}
function locFromRow(r) {
  return { id: r.id, nome: r.nome, tel: r.tel, condoId: r.condo_id, dataIn: r.data_in, dataOut: r.data_out, modelo: r.modelo, cor: r.cor, placa: r.placa, obs: r.obs, status: r.status, origem: r.origem, criadoEm: r.criado_em };
}
function reservaFromRow(r) {
  return { id: r.id, locId: r.loc_id, propId: r.prop_id, locNome: r.loc_nome, propNome: r.prop_nome, vaga: r.vaga, condoId: r.condo_id, dataIn: r.data_in, dataOut: r.data_out, dias: r.dias, valor: Number(r.valor), pixEnviado: r.pix_enviado, status: r.status, criadoEm: r.criado_em };
}

/* ── condos ── */

export async function fetchCondos() {
  const { data, error } = await supabase.from("condos").select("*").order("nome");
  if (error) throw error;
  return data.map(condoFromRow);
}

export async function createCondo({ nome, endereco, apts, vagas, sindico, obs }) {
  const { data, error } = await supabase.from("condos").insert({ nome, endereco, apts, vagas, sindico, obs }).select().single();
  if (error) throw error;
  return condoFromRow(data);
}

export async function deleteCondo(id) {
  const { error } = await supabase.from("condos").delete().eq("id", id);
  if (error) throw error;
}

/* ── props (proprietários) ── */

export async function fetchProps() {
  const { data, error } = await supabase.from("props").select("*").order("criado_em");
  if (error) throw error;
  return data.map(propFromRow);
}

export async function createProp({ nome, tel, vaga, diaria, condoId, obs, diasDisponiveis, status, origem }) {
  const { data, error } = await supabase.from("props").insert({
    nome, tel, vaga, diaria, condo_id: condoId, obs,
    dias_disponiveis: diasDisponiveis, status, origem,
  }).select().single();
  if (error) throw error;
  return propFromRow(data);
}

export async function updateProp(id, patch) {
  const row = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.diasDisponiveis !== undefined) row.dias_disponiveis = patch.diasDisponiveis;
  const { error } = await supabase.from("props").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteProp(id) {
  const { error } = await supabase.from("props").delete().eq("id", id);
  if (error) throw error;
}

/* ── locs (locatários) ── */

export async function fetchLocs() {
  const { data, error } = await supabase.from("locs").select("*").order("criado_em");
  if (error) throw error;
  return data.map(locFromRow);
}

export async function createLoc({ nome, tel, condoId, dataIn, dataOut, modelo, cor, placa, obs, status, origem }) {
  const { data, error } = await supabase.from("locs").insert({
    nome, tel, condo_id: condoId, data_in: dataIn, data_out: dataOut,
    modelo, cor, placa, obs, status, origem,
  }).select().single();
  if (error) throw error;
  return locFromRow(data);
}

export async function updateLoc(id, patch) {
  const row = {};
  if (patch.status !== undefined) row.status = patch.status;
  const { error } = await supabase.from("locs").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteLoc(id) {
  const { error } = await supabase.from("locs").delete().eq("id", id);
  if (error) throw error;
}

/* ── reservas ── */

export async function fetchReservas() {
  const { data, error } = await supabase.from("reservas").select("*").order("criado_em");
  if (error) throw error;
  return data.map(reservaFromRow);
}

export async function createReserva({ locId, propId, locNome, propNome, vaga, condoId, dataIn, dataOut, dias, valor, pixEnviado, status }) {
  const { data, error } = await supabase.from("reservas").insert({
    loc_id: locId, prop_id: propId, loc_nome: locNome, prop_nome: propNome, vaga,
    condo_id: condoId, data_in: dataIn, data_out: dataOut, dias, valor,
    pix_enviado: pixEnviado, status,
  }).select().single();
  if (error) throw error;
  return reservaFromRow(data);
}

export async function updateReserva(id, patch) {
  const row = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.pixEnviado !== undefined) row.pix_enviado = patch.pixEnviado;
  const { error } = await supabase.from("reservas").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteReserva(id) {
  const { error } = await supabase.from("reservas").delete().eq("id", id);
  if (error) throw error;
}

/* ── auth ── */

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
