"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashSenha,
  verificarSenha,
  criarSessao,
  encerrarSessao,
  contarUsuarios,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

export async function entrar(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirect(`/login?erro=${encodeURIComponent("Informe e-mail e senha válidos.")}`);
  }
  const { email, senha } = parsed.data;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const ok = usuario && usuario.ativo && (await verificarSenha(senha, usuario.senhaHash));
  if (!usuario || !ok) {
    redirect(`/login?erro=${encodeURIComponent("E-mail ou senha incorretos.")}`);
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcesso: new Date() },
  });
  await criarSessao(usuario.id);
  redirect("/");
}

export async function sair() {
  await encerrarSessao();
  redirect("/login");
}

const setupSchema = z
  .object({
    nome: z.string().trim().min(1, "Informe o nome"),
    email: z.string().trim().toLowerCase().email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmar: z.string(),
  })
  .refine((d) => d.senha === d.confirmar, {
    message: "As senhas não conferem",
    path: ["confirmar"],
  });

export async function criarAdminInicial(formData: FormData) {
  // Só permitido enquanto não houver nenhum usuário.
  if ((await contarUsuarios()) > 0) redirect("/login");

  const parsed = setupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/setup?erro=${encodeURIComponent(msg)}`);
  }
  const { nome, email, senha } = parsed.data;

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash: await hashSenha(senha), papel: "ADMIN", ativo: true },
  });
  await criarSessao(usuario.id);
  redirect("/");
}
