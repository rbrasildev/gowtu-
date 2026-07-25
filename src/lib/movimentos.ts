import { prisma } from "./prisma";
import type { Categoria } from "./domain";

/** Movimentações de uma categoria, com produto/equipamento/colaborador. */
export async function getMovimentosPorCategoria(
  categoria: Categoria,
  opts?: { limit?: number; q?: string },
) {
  return prisma.movimentoEstoque.findMany({
    where: {
      produto: { categoria },
      ...(opts?.q
        ? {
            OR: [
              { produto: { nome: { contains: opts.q, mode: "insensitive" } } },
              { equipamento: { nome: { contains: opts.q, mode: "insensitive" } } },
              { fornecedor: { contains: opts.q, mode: "insensitive" } },
              { notaFiscal: { contains: opts.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      produto: true,
      equipamento: { select: { id: true, nome: true, tipo: true, patrimonio: true } },
      colaborador: { select: { id: true, nome: true } },
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
    take: opts?.limit ?? 100,
  });
}

export type MovimentoComRelacoes = Awaited<
  ReturnType<typeof getMovimentosPorCategoria>
>[number];
