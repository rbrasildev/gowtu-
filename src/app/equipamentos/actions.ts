"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const decimalOpt = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v.replace(",", "."))))
  .refine((v) => v === null || Number.isFinite(v), "Valor inválido");

const anoOpt = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : parseInt(v, 10)))
  .refine((v) => v === null || (v >= 1950 && v <= 2100), "Ano inválido");

const schema = z.object({
  nome: z.string().trim().min(1, "Informe o nome/identificação"),
  tipo: z.enum(["EQUIPAMENTO", "VEICULO"]),
  patrimonio: z.string().trim().optional(),
  placa: z.string().trim().optional(),
  modelo: z.string().trim().optional(),
  fabricante: z.string().trim().optional(),
  ano: anoOpt,
  status: z.enum(["ATIVO", "MANUTENCAO", "INATIVO"]),
  medidor: decimalOpt,
  observacao: z.string().trim().optional(),
});

export async function salvarEquipamento(id: string | null, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/equipamentos/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;
  const data = {
    nome: d.nome,
    tipo: d.tipo,
    patrimonio: d.patrimonio || null,
    placa: d.placa ? d.placa.toUpperCase() : null,
    modelo: d.modelo || null,
    fabricante: d.fabricante || null,
    ano: d.ano,
    status: d.status,
    medidor: d.medidor,
    observacao: d.observacao || null,
  };

  try {
    if (id) await prisma.equipamento.update({ where: { id }, data });
    else await prisma.equipamento.create({ data });
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "code" in e && e.code === "P2002"
        ? "Já existe um item com esse número de patrimônio."
        : "Erro ao salvar. Tente novamente.";
    redirect(`/equipamentos/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/equipamentos");
  redirect("/equipamentos");
}

export async function excluirEquipamento(id: string) {
  await prisma.equipamento.delete({ where: { id } });
  revalidatePath("/equipamentos");
  redirect("/equipamentos");
}
