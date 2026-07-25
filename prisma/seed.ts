import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function diasAtras(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function main() {
  console.log("🌱 Limpando dados...");
  await prisma.movimentoEstoque.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.equipamento.deleteMany();
  await prisma.colaborador.deleteMany();

  console.log("👷 Colaboradores...");
  const [joao, maria, carlos, ana] = await Promise.all([
    prisma.colaborador.create({
      data: {
        nome: "João Pereira",
        matricula: "0001",
        cargo: "Operador de máquinas",
        setor: "Frota",
        telefone: "(11) 98888-0001",
        status: "ATIVO",
        admissao: new Date("2021-03-15"),
      },
    }),
    prisma.colaborador.create({
      data: {
        nome: "Maria Souza",
        matricula: "0002",
        cargo: "Almoxarife",
        setor: "Almoxarifado",
        telefone: "(11) 98888-0002",
        email: "maria.souza@empresa.com",
        status: "ATIVO",
        admissao: new Date("2020-07-01"),
      },
    }),
    prisma.colaborador.create({
      data: {
        nome: "Carlos Lima",
        matricula: "0003",
        cargo: "Mecânico",
        setor: "Oficina",
        status: "ATIVO",
        admissao: new Date("2022-01-10"),
      },
    }),
    prisma.colaborador.create({
      data: {
        nome: "Ana Ribeiro",
        matricula: "0004",
        cargo: "Motorista",
        setor: "Frota",
        status: "AFASTADO",
        admissao: new Date("2019-11-20"),
      },
    }),
  ]);

  console.log("🚜 Equipamentos e veículos...");
  const [retro, caminhao, trator, gerador] = await Promise.all([
    prisma.equipamento.create({
      data: {
        nome: "Retroescavadeira 01",
        tipo: "EQUIPAMENTO",
        patrimonio: "PAT-0001",
        modelo: "416F2",
        fabricante: "Caterpillar",
        ano: 2020,
        status: "ATIVO",
        medidor: 3200,
      },
    }),
    prisma.equipamento.create({
      data: {
        nome: "Caminhão Basculante",
        tipo: "VEICULO",
        patrimonio: "PAT-0002",
        placa: "ABC-1D23",
        modelo: "Atego 2426",
        fabricante: "Mercedes-Benz",
        ano: 2019,
        status: "ATIVO",
        medidor: 128500,
      },
    }),
    prisma.equipamento.create({
      data: {
        nome: "Trator Agrícola",
        tipo: "EQUIPAMENTO",
        patrimonio: "PAT-0003",
        modelo: "5075E",
        fabricante: "John Deere",
        ano: 2021,
        status: "MANUTENCAO",
        medidor: 1450,
      },
    }),
    prisma.equipamento.create({
      data: {
        nome: "Gerador Diesel",
        tipo: "EQUIPAMENTO",
        patrimonio: "PAT-0004",
        modelo: "C90",
        fabricante: "Stemac",
        ano: 2018,
        status: "ATIVO",
        medidor: 890,
      },
    }),
  ]);

  console.log("🛢️ Produtos...");
  const diesel = await prisma.produto.create({
    data: {
      nome: "Óleo Diesel S10",
      categoria: "DIESEL",
      unidade: "L",
      precoUnitario: 6.29,
      estoqueMinimo: 200,
    },
  });
  const gasolina = await prisma.produto.create({
    data: {
      nome: "Gasolina Comum",
      categoria: "GASOLINA",
      unidade: "L",
      precoUnitario: 5.89,
      estoqueMinimo: 100,
    },
  });
  const graxa = await prisma.produto.create({
    data: {
      nome: "Graxa Azul (rolamentos)",
      categoria: "GRAXA",
      unidade: "KG",
      precoUnitario: 24.5,
      estoqueMinimo: 5,
    },
  });
  const filtroOleo = await prisma.produto.create({
    data: {
      nome: "Filtro de óleo",
      categoria: "PECA",
      unidade: "UN",
      codigo: "FLT-1001",
      precoUnitario: 48.9,
      estoqueMinimo: 2,
    },
  });
  const correia = await prisma.produto.create({
    data: {
      nome: "Correia do alternador",
      categoria: "PECA",
      unidade: "UN",
      codigo: "COR-2002",
      precoUnitario: 89.9,
      estoqueMinimo: 1,
    },
  });
  const estopa = await prisma.produto.create({
    data: {
      nome: "Estopa branca (kg)",
      categoria: "CONSUMO",
      unidade: "KG",
      precoUnitario: 12.0,
      estoqueMinimo: 3,
    },
  });
  const detergente = await prisma.produto.create({
    data: {
      nome: "Detergente desengraxante",
      categoria: "CONSUMO",
      unidade: "L",
      precoUnitario: 18.5,
      estoqueMinimo: 4,
    },
  });

  console.log("🔁 Movimentações...");
  await prisma.movimentoEstoque.createMany({
    data: [
      // Entradas (compras)
      { produtoId: diesel.id, tipo: "ENTRADA", quantidade: 1000, valorUnitario: 6.1, fornecedor: "Posto Central", notaFiscal: "12345", colaboradorId: maria.id, data: diasAtras(25) },
      { produtoId: gasolina.id, tipo: "ENTRADA", quantidade: 300, valorUnitario: 5.7, fornecedor: "Posto Central", notaFiscal: "12346", colaboradorId: maria.id, data: diasAtras(25) },
      { produtoId: graxa.id, tipo: "ENTRADA", quantidade: 20, valorUnitario: 23.0, fornecedor: "Lubrificantes SA", notaFiscal: "7788", colaboradorId: maria.id, data: diasAtras(20) },
      { produtoId: filtroOleo.id, tipo: "ENTRADA", quantidade: 6, valorUnitario: 45.0, fornecedor: "Auto Peças União", notaFiscal: "5501", colaboradorId: carlos.id, data: diasAtras(18) },
      { produtoId: correia.id, tipo: "ENTRADA", quantidade: 3, valorUnitario: 85.0, fornecedor: "Auto Peças União", notaFiscal: "5502", colaboradorId: carlos.id, data: diasAtras(18) },
      { produtoId: estopa.id, tipo: "ENTRADA", quantidade: 10, valorUnitario: 11.5, fornecedor: "Distribuidora Norte", colaboradorId: maria.id, data: diasAtras(15) },
      { produtoId: detergente.id, tipo: "ENTRADA", quantidade: 12, valorUnitario: 17.9, fornecedor: "Distribuidora Norte", colaboradorId: maria.id, data: diasAtras(15) },

      // Saídas (abastecimento / uso)
      { produtoId: diesel.id, tipo: "SAIDA", quantidade: 180, valorUnitario: 6.1, equipamentoId: caminhao.id, colaboradorId: joao.id, medidor: 128500, data: diasAtras(12) },
      { produtoId: diesel.id, tipo: "SAIDA", quantidade: 120, valorUnitario: 6.1, equipamentoId: retro.id, colaboradorId: joao.id, medidor: 3200, data: diasAtras(10) },
      { produtoId: diesel.id, tipo: "SAIDA", quantidade: 90, valorUnitario: 6.1, equipamentoId: gerador.id, colaboradorId: carlos.id, data: diasAtras(6) },
      { produtoId: gasolina.id, tipo: "SAIDA", quantidade: 45, valorUnitario: 5.7, equipamentoId: caminhao.id, colaboradorId: joao.id, data: diasAtras(8) },
      { produtoId: graxa.id, tipo: "SAIDA", quantidade: 2.5, valorUnitario: 23.0, equipamentoId: retro.id, colaboradorId: carlos.id, data: diasAtras(7) },
      { produtoId: filtroOleo.id, tipo: "SAIDA", quantidade: 1, valorUnitario: 45.0, equipamentoId: trator.id, colaboradorId: carlos.id, observacao: "Troca preventiva", data: diasAtras(5) },
      { produtoId: correia.id, tipo: "SAIDA", quantidade: 1, valorUnitario: 85.0, equipamentoId: caminhao.id, colaboradorId: carlos.id, observacao: "Correia rompida", data: diasAtras(3) },
      { produtoId: estopa.id, tipo: "SAIDA", quantidade: 8, valorUnitario: 11.5, colaboradorId: carlos.id, data: diasAtras(4) },
      { produtoId: detergente.id, tipo: "SAIDA", quantidade: 9, valorUnitario: 17.9, colaboradorId: carlos.id, observacao: "Limpeza da oficina", data: diasAtras(2) },
    ],
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
