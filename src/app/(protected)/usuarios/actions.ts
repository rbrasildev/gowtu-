"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashSenha } from "@/lib/auth";

const baseSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  papel: z.enum(["ADMIN", "OPERADOR"]),
  ativo: z.union([z.literal("on"), z.undefined()]).transform((v) => v === "on"),
  senha: z.string().optional(),
});

export async function salvarUsuario(id: string | null, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/usuarios/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;

  // Senha: obrigatória ao criar; opcional (troca) ao editar.
  const senha = d.senha?.trim() || "";
  if (!id && senha.length < 6) {
    redirect(`/usuarios/novo?erro=${encodeURIComponent("A senha deve ter ao menos 6 caracteres.")}`);
  }
  if (id && senha && senha.length < 6) {
    redirect(`/usuarios/${id}?erro=${encodeURIComponent("A nova senha deve ter ao menos 6 caracteres.")}`);
  }

  // Proteção contra auto-bloqueio: o admin não pode rebaixar/desativar a si mesmo.
  if (id && id === admin.id && (d.papel !== "ADMIN" || !d.ativo)) {
    redirect(`/usuarios/${id}?erro=${encodeURIComponent("Você não pode remover seu próprio acesso de administrador.")}`);
  }

  try {
    if (id) {
      await prisma.usuario.update({
        where: { id },
        data: {
          nome: d.nome,
          email: d.email,
          papel: d.papel,
          ativo: d.ativo,
          ...(senha ? { senhaHash: await hashSenha(senha) } : {}),
        },
      });
    } else {
      await prisma.usuario.create({
        data: {
          nome: d.nome,
          email: d.email,
          papel: d.papel,
          ativo: d.ativo,
          senhaHash: await hashSenha(senha),
        },
      });
    }
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "code" in e && e.code === "P2002"
        ? "Já existe um usuário com esse e-mail."
        : "Erro ao salvar. Tente novamente.";
    redirect(`/usuarios/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function excluirUsuario(id: string) {
  const admin = await requireAdmin();
  if (id === admin.id) {
    redirect(`/usuarios?erro=${encodeURIComponent("Você não pode excluir a sua própria conta.")}`);
  }
  await prisma.usuario.delete({ where: { id } });
  revalidatePath("/usuarios");
  redirect("/usuarios");
}
