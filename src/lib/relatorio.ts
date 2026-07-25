import { prisma } from "./prisma";
import { toNumber } from "./utils";
import { CATEGORIA_LIST, CATEGORIAS, type Categoria } from "./domain";

export interface LinhaCategoria {
  categoria: Categoria;
  label: string;
  unidade: string;
  entradaQtd: number;
  entradaValor: number;
  saidaQtd: number;
  saidaValor: number;
  movimentos: number;
}

export interface ConsumoEquip {
  equipamentoId: string;
  nome: string;
  tipo: string;
  itens: { categoria: Categoria; qtd: number; unidade: string; valor: number }[];
  valorTotal: number;
}

/**
 * Agrega todas as movimentações do mês (ano/mês 1-12) para o relatório.
 * O volume mensal é pequeno; agregamos em memória para calcular valores
 * (quantidade × valorUnitário), que o groupBy do Prisma não computa.
 */
export async function gerarRelatorio(ano: number, mes: number) {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 1);

  const movimentos = await prisma.movimentoEstoque.findMany({
    where: { data: { gte: inicio, lt: fim } },
    include: {
      produto: { select: { nome: true, categoria: true, unidade: true } },
      equipamento: { select: { id: true, nome: true, tipo: true } },
      colaborador: { select: { nome: true } },
    },
    orderBy: [{ data: "asc" }, { createdAt: "asc" }],
  });

  // Por categoria
  const porCategoria = new Map<Categoria, LinhaCategoria>();
  for (const cat of CATEGORIA_LIST) {
    porCategoria.set(cat, {
      categoria: cat,
      label: CATEGORIAS[cat].plural,
      unidade: CATEGORIAS[cat].unidadePadrao,
      entradaQtd: 0,
      entradaValor: 0,
      saidaQtd: 0,
      saidaValor: 0,
      movimentos: 0,
    });
  }

  // Consumo (saídas) por equipamento
  const porEquip = new Map<string, ConsumoEquip>();

  for (const m of movimentos) {
    const cat = m.produto.categoria as Categoria;
    const qtd = toNumber(m.quantidade);
    const valor = toNumber(m.valorUnitario) * qtd;
    const linha = porCategoria.get(cat)!;
    linha.movimentos += 1;
    linha.unidade = m.produto.unidade;

    if (m.tipo === "ENTRADA") {
      linha.entradaQtd += qtd;
      linha.entradaValor += valor;
    } else {
      linha.saidaQtd += qtd;
      linha.saidaValor += valor;

      if (m.equipamento) {
        const eq =
          porEquip.get(m.equipamento.id) ??
          ({
            equipamentoId: m.equipamento.id,
            nome: m.equipamento.nome,
            tipo: m.equipamento.tipo,
            itens: [],
            valorTotal: 0,
          } satisfies ConsumoEquip);
        const item = eq.itens.find((i) => i.categoria === cat);
        if (item) {
          item.qtd += qtd;
          item.valor += valor;
        } else {
          eq.itens.push({ categoria: cat, qtd, unidade: m.produto.unidade, valor });
        }
        eq.valorTotal += valor;
        porEquip.set(m.equipamento.id, eq);
      }
    }
  }

  const linhas = CATEGORIA_LIST.map((c) => porCategoria.get(c)!);
  const consumoEquip = [...porEquip.values()].sort((a, b) => b.valorTotal - a.valorTotal);

  const totais = {
    entradaValor: linhas.reduce((s, l) => s + l.entradaValor, 0),
    saidaValor: linhas.reduce((s, l) => s + l.saidaValor, 0),
    movimentos: movimentos.length,
    entradas: movimentos.filter((m) => m.tipo === "ENTRADA").length,
    saidas: movimentos.filter((m) => m.tipo === "SAIDA").length,
  };

  return { inicio, fim, movimentos, linhas, consumoEquip, totais };
}

export type RelatorioData = Awaited<ReturnType<typeof gerarRelatorio>>;
