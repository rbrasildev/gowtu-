"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { getSaldoProduto } from "@/lib/estoque";

function resolveCategoria(slug: string) {
  const categoria = categoriaFromSlug(slug);
  if (!categoria) throw new Error("Categoria inválida");
  return categoria;
}

const decimalOpt = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v.replace(",", "."))))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Valor inválido");

const decimalPos = z
  .string()
  .trim()
  .min(1, "Informe a quantidade")
  .transform((v) => Number(v.replace(",", ".")))
  .refine((v) => Number.isFinite(v) && v > 0, "Quantidade deve ser maior que zero");

// ---------- Produto ----------

const produtoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome"),
  unidade: z.enum(["L", "KG", "UN", "ML", "M", "CX"]),
  codigo: z.string().trim().optional(),
  precoUnitario: decimalOpt,
  estoqueMinimo: decimalOpt,
  observacao: z.string().trim().optional(),
});

export async function salvarProduto(slug: string, id: string | null, formData: FormData) {
  const categoria = resolveCategoria(slug);
  const parsed = produtoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/estoque/${slug}/produtos/${id ?? "novo"}?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;
  const data = {
    nome: d.nome,
    categoria,
    unidade: d.unidade,
    codigo: d.codigo || null,
    precoUnitario: d.precoUnitario,
    estoqueMinimo: d.estoqueMinimo ?? 0,
    observacao: d.observacao || null,
  };

  if (id) {
    await prisma.produto.update({ where: { id }, data });
  } else {
    await prisma.produto.create({ data });
  }
  revalidatePath(`/estoque/${slug}`);
  redirect(`/estoque/${slug}`);
}

export async function excluirProduto(slug: string, id: string) {
  await prisma.produto.delete({ where: { id } });
  revalidatePath(`/estoque/${slug}`);
  redirect(`/estoque/${slug}`);
}

// ---------- Movimento ----------

const movimentoSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  quantidade: decimalPos,
  data: z.string().trim().min(1, "Informe a data"),
  valorUnitario: decimalOpt,
  fornecedor: z.string().trim().optional(),
  notaFiscal: z.string().trim().optional(),
  equipamentoId: z.string().trim().optional(),
  colaboradorId: z.string().trim().optional(),
  medidor: decimalOpt,
  observacao: z.string().trim().optional(),
});

export async function registrarMovimento(slug: string, formData: FormData) {
  resolveCategoria(slug);
  const parsed = movimentoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/estoque/${slug}/movimento/novo?erro=${encodeURIComponent(msg)}`);
  }
  const d = parsed.data;

  // Prevenção de erro: não permitir saída maior que o saldo disponível.
  if (d.tipo === "SAIDA") {
    const saldo = await getSaldoProduto(d.produtoId);
    if (d.quantidade > saldo) {
      const msg = `Saída (${d.quantidade}) maior que o saldo disponível (${saldo}).`;
      redirect(
        `/estoque/${slug}/movimento/novo?tipo=SAIDA&produtoId=${d.produtoId}&erro=${encodeURIComponent(msg)}`,
      );
    }
  }

  await prisma.movimentoEstoque.create({
    data: {
      produtoId: d.produtoId,
      tipo: d.tipo,
      quantidade: d.quantidade,
      data: new Date(d.data),
      valorUnitario: d.valorUnitario,
      fornecedor: d.fornecedor || null,
      notaFiscal: d.notaFiscal || null,
      equipamentoId: d.equipamentoId || null,
      colaboradorId: d.colaboradorId || null,
      medidor: d.medidor,
      observacao: d.observacao || null,
    },
  });

  revalidatePath(`/estoque/${slug}`);
  redirect(`/estoque/${slug}`);
}

export async function excluirMovimento(slug: string, id: string) {
  await prisma.movimentoEstoque.delete({ where: { id } });
  revalidatePath(`/estoque/${slug}`);
}
