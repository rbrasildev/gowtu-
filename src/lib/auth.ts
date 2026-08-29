import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const SESSAO_COOKIE = "sessao";
const DIAS_VALIDADE = 30;

export type Papel = "ADMIN" | "OPERADOR";

export interface UsuarioSessao {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
}

// ---------- Senha ----------

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 12);
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

// ---------- Sessão ----------

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Cria sessão no banco e grava o cookie httpOnly. */
export async function criarSessao(usuarioId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + DIAS_VALIDADE * 24 * 60 * 60 * 1000);

  await prisma.sessao.create({
    data: { tokenHash: hashToken(token), usuarioId, expiraEm },
  });

  const store = await cookies();
  store.set(SESSAO_COOKIE, token, {
    httpOnly: true,
    // A VPS é acessada por HTTP (sem HTTPS). Com HTTPS, defina COOKIE_SECURE=true.
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    expires: expiraEm,
  });
}

/** Encerra a sessão atual (remove do banco e limpa o cookie). */
export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSAO_COOKIE)?.value;
  if (token) {
    await prisma.sessao.deleteMany({ where: { tokenHash: hashToken(token) } });
    store.delete(SESSAO_COOKIE);
  }
}

/** Usuário autenticado atual (ou null). Cacheado por requisição. */
export const getUsuarioAtual = cache(async (): Promise<UsuarioSessao | null> => {
  const store = await cookies();
  const token = store.get(SESSAO_COOKIE)?.value;
  if (!token) return null;

  const sessao = await prisma.sessao.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { usuario: true },
  });

  if (!sessao || sessao.expiraEm < new Date() || !sessao.usuario.ativo) {
    return null;
  }

  return {
    id: sessao.usuario.id,
    nome: sessao.usuario.nome,
    email: sessao.usuario.email,
    papel: sessao.usuario.papel as Papel,
  };
});

/** Exige usuário logado; redireciona para /login caso contrário. */
export async function requireUsuario(): Promise<UsuarioSessao> {
  const u = await getUsuarioAtual();
  if (!u) redirect("/login");
  return u;
}

/** Exige papel de administrador. */
export async function requireAdmin(): Promise<UsuarioSessao> {
  const u = await requireUsuario();
  if (u.papel !== "ADMIN") redirect("/");
  return u;
}

export async function contarUsuarios(): Promise<number> {
  return prisma.usuario.count();
}
