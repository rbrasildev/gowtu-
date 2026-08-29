"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do local"),
  endereco: z.string().trim().optional(),
  cidade: z.string().trim().optional(),
  estado: z.string().trim().max(2, "Use a sigla (ex.: SP)").optional(),
  cep: z.string().trim().optional(),
  responsavel: z.string().trim().optional(),
  telefone: z.string().trim().optional(),
  observacao: z.string().trim().optional(),
  ativo: z.union([z.literal("on"), z.undefined()]).transform((v) => v === "on"),
});

export async function salvarLocal(id: string | null, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/locais/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;
  const data = {
    nome: d.nome,
    endereco: d.endereco || null,
    cidade: d.cidade || null,
    estado: d.estado ? d.estado.toUpperCase() : null,
    cep: d.cep || null,
    responsavel: d.responsavel || null,
    telefone: d.telefone || null,
    observacao: d.observacao || null,
    ativo: d.ativo,
  };

  if (id) await prisma.local.update({ where: { id }, data });
  else await prisma.local.create({ data });

  revalidatePath("/locais");
  redirect("/locais");
}

export async function excluirLocal(id: string) {
  // Os equipamentos vinculados ficam sem local (onDelete: SetNull).
  await prisma.local.delete({ where: { id } });
  revalidatePath("/locais");
  redirect("/locais");
}
