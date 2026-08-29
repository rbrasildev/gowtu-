"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const decimalOpt = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v.replace(",", "."))))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Valor inválido");

const schema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  matricula: z.string().trim().optional(),
  cargo: z.string().trim().optional(),
  setor: z.string().trim().optional(),
  telefone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /.+@.+\..+/.test(v), "E-mail inválido"),
  status: z.enum(["ATIVO", "AFASTADO", "DESLIGADO"]),
  admissao: z.string().trim().optional(),
  observacao: z.string().trim().optional(),
  tipoRemuneracao: z.enum(["SALARIO", "COMISSAO"]),
  salario: decimalOpt,
  comissaoPercentual: decimalOpt,
});

export async function salvarColaborador(id: string | null, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/colaboradores/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;
  const data = {
    nome: d.nome,
    matricula: d.matricula || null,
    cargo: d.cargo || null,
    setor: d.setor || null,
    telefone: d.telefone || null,
    email: d.email || null,
    status: d.status,
    admissao: d.admissao ? new Date(d.admissao) : null,
    observacao: d.observacao || null,
    tipoRemuneracao: d.tipoRemuneracao,
    // guarda só o campo do tipo escolhido
    salario: d.tipoRemuneracao === "SALARIO" ? d.salario : null,
    comissaoPercentual: d.tipoRemuneracao === "COMISSAO" ? d.comissaoPercentual : null,
  };

  try {
    if (id) await prisma.colaborador.update({ where: { id }, data });
    else await prisma.colaborador.create({ data });
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "code" in e && e.code === "P2002"
        ? "Já existe um colaborador com essa matrícula."
        : "Erro ao salvar. Tente novamente.";
    redirect(`/colaboradores/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/colaboradores");
  redirect("/colaboradores");
}

export async function excluirColaborador(id: string) {
  await prisma.colaborador.delete({ where: { id } });
  revalidatePath("/colaboradores");
  redirect("/colaboradores");
}
