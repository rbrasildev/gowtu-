import { prisma } from "./prisma";
import { toNumber } from "./utils";
import { CATEGORIA_LIST, type Categoria } from "./domain";
import { getProdutosComEstoque } from "./estoque";

export async function getDashboard() {
  const [
    totalColaboradores,
    colaboradoresAtivos,
    totalEquipamentos,
    equipamentosAtivos,
    equipamentosManutencao,
    totalVeiculos,
    valorPatrimonioAgg,
    movimentosMes,
  ] = await Promise.all([
    prisma.colaborador.count(),
    prisma.colaborador.count({ where: { status: "ATIVO" } }),
    prisma.equipamento.count(),
    prisma.equipamento.count({ where: { status: "ATIVO" } }),
    prisma.equipamento.count({ where: { status: "MANUTENCAO" } }),
    prisma.equipamento.count({ where: { tipo: "VEICULO" } }),
    prisma.equipamento.aggregate({ _sum: { valor: true } }),
    contarMovimentosDoMes(),
  ]);
  const valorPatrimonioAtivos = toNumber(valorPatrimonioAgg._sum.valor);

  // Estoque por categoria + alertas de mínimo
  const categorias = await Promise.all(
    CATEGORIA_LIST.map(async (cat) => {
      const produtos = await getProdutosComEstoque(cat);
      return {
        categoria: cat as Categoria,
        totalProdutos: produtos.length,
        saldoTotal: produtos.reduce((s, p) => s + p.saldo, 0),
        valorTotal: produtos.reduce((s, p) => s + p.valorEstoque, 0),
        unidade: produtos[0]?.unidade,
        alertas: produtos.filter((p) => p.abaixoMinimo),
      };
    }),
  );

  const alertasEstoque = categorias
    .flatMap((c) => c.alertas.map((p) => ({ ...p })))
    .sort((a, b) => a.saldo - b.saldo);

  const valorTotalEstoque = categorias.reduce((s, c) => s + c.valorTotal, 0);

  const ultimosMovimentos = await prisma.movimentoEstoque.findMany({
    include: {
      produto: { select: { nome: true, unidade: true, categoria: true } },
      equipamento: { select: { nome: true } },
      colaborador: { select: { nome: true } },
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
    take: 8,
  });

  return {
    totalColaboradores,
    colaboradoresAtivos,
    totalEquipamentos,
    equipamentosAtivos,
    equipamentosManutencao,
    totalVeiculos,
    valorPatrimonioAtivos,
    movimentosMes,
    categorias,
    alertasEstoque,
    valorTotalEstoque,
    valorTotalGeral: valorPatrimonioAtivos + valorTotalEstoque,
    ultimosMovimentos,
  };
}

async function contarMovimentosDoMes() {
  const agora = new Date();
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const grupos = await prisma.movimentoEstoque.groupBy({
    by: ["tipo"],
    where: { data: { gte: inicio } },
    _count: { _all: true },
    _sum: { quantidade: true },
  });
  let entradas = 0;
  let saidas = 0;
  for (const g of grupos) {
    if (g.tipo === "ENTRADA") entradas = g._count._all;
    else saidas = g._count._all;
  }
  return { entradas, saidas, total: entradas + saidas };
}

export function saldoTone(valor: number) {
  if (valor <= 0) return "danger" as const;
  return "success" as const;
}

// pequeno helper reutilizável
export { toNumber };
