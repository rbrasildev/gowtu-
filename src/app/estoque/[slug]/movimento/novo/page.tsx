import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS, UNIDADE_ABREV, type Unidade } from "@/lib/domain";
import { prisma } from "@/lib/prisma";
import { registrarMovimento } from "../../actions";
import { FormShell } from "@/components/ui/form-shell";
import { MovimentoForm } from "@/components/forms/movimento-form";
import { toDateInput } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NovoMovimento({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tipo?: string; produtoId?: string; erro?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const categoria = categoriaFromSlug(slug);
  if (!categoria) notFound();

  const meta = CATEGORIAS[categoria];
  const isCombustivel = ["DIESEL", "GASOLINA", "GRAXA"].includes(categoria);

  const [produtos, equipamentos, colaboradores] = await Promise.all([
    prisma.produto.findMany({
      where: { categoria, ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, codigo: true, unidade: true },
    }),
    meta.saidaVinculaEquipamento
      ? prisma.equipamento.findMany({
          where: { status: { not: "INATIVO" } },
          orderBy: { nome: "asc" },
          select: { id: true, nome: true, patrimonio: true, placa: true },
        })
      : Promise.resolve([]),
    prisma.colaborador.findMany({
      where: { status: "ATIVO" },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, cargo: true },
    }),
  ]);

  const tipo = sp.tipo === "SAIDA" ? "SAIDA" : "ENTRADA";
  const unidadeProduto =
    produtos.find((p) => p.id === sp.produtoId)?.unidade ?? meta.unidadePadrao;

  return (
    <FormShell
      title={`Movimentar — ${meta.plural}`}
      description="Registre uma entrada (compra/recebimento) ou saída (uso/abastecimento)"
      icon={meta.icon as never}
      tone={meta.tone}
      backHref={`/estoque/${slug}`}
      backLabel={`Voltar para ${meta.plural}`}
    >
      <MovimentoForm
        slug={slug}
        action={registrarMovimento.bind(null, slug)}
        vinculaEquipamento={meta.saidaVinculaEquipamento}
        isCombustivel={isCombustivel}
        unidadeLabel={UNIDADE_ABREV[unidadeProduto as Unidade]}
        defaultTipo={tipo}
        defaultProdutoId={sp.produtoId}
        defaultData={toDateInput(new Date())}
        erro={sp.erro}
        produtos={produtos.map((p) => ({
          id: p.id,
          nome: p.nome,
          extra: p.codigo ?? undefined,
        }))}
        equipamentos={equipamentos.map((e) => ({
          id: e.id,
          nome: e.nome,
          extra: e.placa ?? e.patrimonio ?? undefined,
        }))}
        colaboradores={colaboradores.map((c) => ({
          id: c.id,
          nome: c.nome,
          extra: c.cargo ?? undefined,
        }))}
      />
    </FormShell>
  );
}
