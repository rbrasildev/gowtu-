import Link from "next/link";
import { Icon } from "./ui/icon";
import { Badge } from "./ui/badge";
import { EmptyState } from "./ui/empty-state";
import { ConfirmDelete } from "./confirm-delete";
import { formatQuantidade, formatNumber } from "@/lib/utils";
import { fmtMoney, type MoedaConfig } from "@/lib/currency";
import { CATEGORIAS, type Categoria } from "@/lib/domain";
import type { ProdutoComEstoque } from "@/lib/estoque";
import { excluirProduto } from "@/app/estoque/[slug]/actions";

export function ProdutoList({
  produtos,
  categoria,
  moeda,
}: {
  produtos: ProdutoComEstoque[];
  categoria: Categoria;
  moeda: MoedaConfig;
}) {
  const meta = CATEGORIAS[categoria];

  if (produtos.length === 0) {
    return (
      <EmptyState
        icon={meta.icon as never}
        title="Nenhum produto cadastrado"
        description={`Cadastre ${meta.plural.toLowerCase()} para controlar entradas, saídas e saldo.`}
        actionLabel="Cadastrar produto"
        actionHref={`/estoque/${meta.slug}/produtos/novo`}
      />
    );
  }

  return (
    <>
      {/* Desktop: tabela */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-2.5 font-medium">Produto</th>
              <th className="px-3 py-2.5 text-right font-medium">Saldo</th>
              <th className="px-3 py-2.5 text-right font-medium">Mínimo</th>
              <th className="px-3 py-2.5 text-right font-medium">Valor estoque</th>
              <th className="px-5 py-2.5 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {produtos.map((p) => (
              <tr key={p.id} className="hover:bg-surface-2">
                <td className="px-5 py-3">
                  <div className="font-medium text-text-primary">{p.nome}</div>
                  <div className="text-xs text-text-secondary">
                    {p.codigo ? `Cód. ${p.codigo} · ` : ""}
                    {fmtMoney(p.precoUnitario, moeda)}/{p.unidade}
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <span
                    className={`font-semibold tabular-nums ${
                      p.abaixoMinimo ? "text-danger" : "text-text-primary"
                    }`}
                  >
                    {formatQuantidade(p.saldo, p.unidade)}
                  </span>
                  {p.abaixoMinimo && (
                    <div className="mt-0.5">
                      <Badge tone="danger">Abaixo do mínimo</Badge>
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-text-secondary">
                  {p.estoqueMinimo > 0 ? formatNumber(p.estoqueMinimo) : "—"}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-text-primary">
                  {fmtMoney(p.valorEstoque, moeda)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ActionButtons produto={p} slug={meta.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="divide-y divide-border md:hidden">
        {produtos.map((p) => (
          <li key={p.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-text-primary">{p.nome}</p>
                <p className="text-xs text-text-secondary">
                  {p.codigo ? `Cód. ${p.codigo} · ` : ""}
                  {fmtMoney(p.precoUnitario, moeda)}/{p.unidade}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold tabular-nums ${
                    p.abaixoMinimo ? "text-danger" : "text-text-primary"
                  }`}
                >
                  {formatQuantidade(p.saldo, p.unidade)}
                </p>
                <p className="text-xs text-text-secondary tabular-nums">
                  {fmtMoney(p.valorEstoque, moeda)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              {p.abaixoMinimo ? (
                <Badge tone="danger" dot>
                  Abaixo do mínimo
                </Badge>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-1">
                <ActionButtons produto={p} slug={meta.slug} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function ActionButtons({
  produto,
  slug,
}: {
  produto: ProdutoComEstoque;
  slug: string;
}) {
  return (
    <>
      <Link
        href={`/estoque/${slug}/movimento/novo?tipo=ENTRADA&produtoId=${produto.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-success hover:bg-success-soft"
        aria-label={`Entrada de ${produto.nome}`}
        title="Registrar entrada"
      >
        <Icon name="arrowDown" size={17} />
      </Link>
      <Link
        href={`/estoque/${slug}/movimento/novo?tipo=SAIDA&produtoId=${produto.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-danger hover:bg-danger-soft"
        aria-label={`Saída de ${produto.nome}`}
        title="Registrar saída"
      >
        <Icon name="arrowUp" size={17} />
      </Link>
      <Link
        href={`/estoque/${slug}/produtos/${produto.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
        aria-label={`Editar ${produto.nome}`}
        title="Editar"
      >
        <Icon name="edit" size={16} />
      </Link>
      <ConfirmDelete
        action={excluirProduto.bind(null, slug, produto.id)}
        compact
        title="Excluir produto"
        message="Todas as movimentações deste produto também serão removidas. Esta ação não pode ser desfeita."
      />
    </>
  );
}
