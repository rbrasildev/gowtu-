import { prisma } from "./prisma";
import { toNumber } from "./utils";
import type { Categoria } from "./domain";

export interface ProdutoComEstoque {
  id: string;
  nome: string;
  categoria: Categoria;
  unidade: string;
  codigo: string | null;
  precoUnitario: number;
  estoqueMinimo: number;
  ativo: boolean;
  observacao: string | null;
  entradas: number;
  saidas: number;
  saldo: number;
  valorEstoque: number;
  abaixoMinimo: boolean;
}

/**
 * Lista produtos de uma categoria com saldo calculado a partir do razão de
 * movimentações (entradas − saídas). Fonte única do estoque atual.
 */
export async function getProdutosComEstoque(
  categoria: Categoria,
  q?: string,
): Promise<ProdutoComEstoque[]> {
  const produtos = await prisma.produto.findMany({
    where: {
      categoria,
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" } },
              { codigo: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { nome: "asc" },
  });

  if (produtos.length === 0) return [];

  const grupos = await prisma.movimentoEstoque.groupBy({
    by: ["produtoId", "tipo"],
    where: { produtoId: { in: produtos.map((p) => p.id) } },
    _sum: { quantidade: true },
  });

  const mapa = new Map<string, { ENTRADA: number; SAIDA: number }>();
  for (const g of grupos) {
    const atual = mapa.get(g.produtoId) ?? { ENTRADA: 0, SAIDA: 0 };
    atual[g.tipo] = toNumber(g._sum.quantidade);
    mapa.set(g.produtoId, atual);
  }

  return produtos.map((p) => {
    const mov = mapa.get(p.id) ?? { ENTRADA: 0, SAIDA: 0 };
    const saldo = mov.ENTRADA - mov.SAIDA;
    const preco = toNumber(p.precoUnitario);
    const min = toNumber(p.estoqueMinimo);
    return {
      id: p.id,
      nome: p.nome,
      categoria: p.categoria as Categoria,
      unidade: p.unidade,
      codigo: p.codigo,
      precoUnitario: preco,
      estoqueMinimo: min,
      ativo: p.ativo,
      observacao: p.observacao,
      entradas: mov.ENTRADA,
      saidas: mov.SAIDA,
      saldo,
      valorEstoque: saldo * preco,
      abaixoMinimo: min > 0 && saldo <= min,
    };
  });
}

export async function getSaldoProduto(produtoId: string): Promise<number> {
  const grupos = await prisma.movimentoEstoque.groupBy({
    by: ["tipo"],
    where: { produtoId },
    _sum: { quantidade: true },
  });
  let entrada = 0;
  let saida = 0;
  for (const g of grupos) {
    if (g.tipo === "ENTRADA") entrada = toNumber(g._sum.quantidade);
    else saida = toNumber(g._sum.quantidade);
  }
  return entrada - saida;
}

/** Resumo agregado de uma categoria (para cabeçalho dos módulos). */
export async function getResumoCategoria(categoria: Categoria) {
  const produtos = await getProdutosComEstoque(categoria);
  return {
    totalProdutos: produtos.length,
    saldoTotal: produtos.reduce((s, p) => s + p.saldo, 0),
    valorTotal: produtos.reduce((s, p) => s + p.valorEstoque, 0),
    abaixoMinimo: produtos.filter((p) => p.abaixoMinimo).length,
    unidadePadrao: produtos[0]?.unidade,
    produtos,
  };
}
