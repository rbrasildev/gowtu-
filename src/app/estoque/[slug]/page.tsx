import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { getResumoCategoria } from "@/lib/estoque";
import { getMovimentosPorCategoria } from "@/lib/movimentos";
import { formatCurrency, formatQuantidade, formatNumber } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { ProdutoList } from "@/components/produto-list";
import { MovimentoList } from "@/components/movimento-list";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = categoriaFromSlug(slug);
  return { title: categoria ? CATEGORIAS[categoria].plural : "Estoque" };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const categoria = categoriaFromSlug(slug);
  if (!categoria) notFound();

  const meta = CATEGORIAS[categoria];
  const [resumo, movimentos] = await Promise.all([
    getResumoCategoria(categoria),
    getMovimentosPorCategoria(categoria, { q, limit: 60 }),
  ]);

  const unidade = resumo.unidadePadrao ?? meta.unidadePadrao;
  const isCombustivel = ["DIESEL", "GASOLINA", "GRAXA"].includes(categoria);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={meta.plural}
        description={
          isCombustivel
            ? "Controle de entrada e saída"
            : `Controle de ${meta.plural.toLowerCase()}`
        }
        icon={meta.icon as never}
        tone={meta.tone}
        action={
          <>
            <ButtonLink
              href={`/estoque/${slug}/movimento/novo?tipo=ENTRADA`}
              variant="successSoft"
              icon="arrowDown"
              size="sm"
            >
              Entrada
            </ButtonLink>
            <ButtonLink
              href={`/estoque/${slug}/movimento/novo?tipo=SAIDA`}
              variant="dangerSoft"
              icon="arrowUp"
              size="sm"
            >
              Saída
            </ButtonLink>
          </>
        }
      />

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Saldo atual"
          value={formatNumber(resumo.saldoTotal, 3)}
          sub={unidade}
          icon={meta.icon as never}
          tone={meta.tone}
        />
        <StatCard
          label="Produtos"
          value={formatNumber(resumo.totalProdutos)}
          sub="cadastrados"
          icon="box"
          tone="accent"
        />
        <StatCard
          label="Valor em estoque"
          value={formatCurrency(resumo.valorTotal)}
          icon="wallet"
          tone="success"
        />
        <StatCard
          label="Abaixo do mínimo"
          value={formatNumber(resumo.abaixoMinimo)}
          sub={resumo.abaixoMinimo > 0 ? "requer reposição" : "tudo ok"}
          icon="alert"
          tone={resumo.abaixoMinimo > 0 ? "danger" : "neutral"}
        />
      </div>

      {/* Produtos */}
      <Card className="mt-4">
        <CardHeader
          title="Produtos & Saldo"
          subtitle="Saldo calculado por entradas menos saídas"
          action={
            <ButtonLink
              href={`/estoque/${slug}/produtos/novo`}
              variant="secondary"
              icon="plus"
              size="sm"
            >
              Novo produto
            </ButtonLink>
          }
        />
        <ProdutoList produtos={resumo.produtos} categoria={categoria} />
      </Card>

      {/* Movimentações */}
      <Card className="mt-4">
        <CardHeader
          title="Histórico de movimentações"
          subtitle={`${movimentos.length} registro(s)`}
        />
        <MovimentoList movimentos={movimentos} slug={slug} />
      </Card>
    </div>
  );
}
