import { Icon } from "./ui/icon";
import { Badge } from "./ui/badge";
import { EmptyState } from "./ui/empty-state";
import { ConfirmDelete } from "./confirm-delete";
import { formatDate, formatQuantidade, formatCurrency, toNumber } from "@/lib/utils";
import { CATEGORIAS } from "@/lib/domain";
import type { MovimentoComRelacoes } from "@/lib/movimentos";
import { excluirMovimento } from "@/app/estoque/[slug]/actions";

export function MovimentoList({
  movimentos,
  slug,
}: {
  movimentos: MovimentoComRelacoes[];
  slug: string;
}) {
  if (movimentos.length === 0) {
    return (
      <EmptyState
        icon="trend"
        title="Nenhuma movimentação registrada"
        description="As entradas e saídas aparecerão aqui em ordem cronológica."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {movimentos.map((m) => {
        const entrada = m.tipo === "ENTRADA";
        const vinc = CATEGORIAS[m.produto.categoria].saidaVinculaEquipamento;
        const total = toNumber(m.valorUnitario) * toNumber(m.quantidade);
        return (
          <li
            key={m.id}
            className="flex items-start gap-3 px-4 py-3 sm:px-5 print-avoid-break"
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                entrada ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
              }`}
            >
              <Icon name={entrada ? "arrowDown" : "arrowUp"} size={17} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-medium text-text-primary">
                  {m.produto.nome}
                </span>
                <Badge tone={entrada ? "success" : "danger"}>
                  {entrada ? "Entrada" : "Saída"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                {formatDate(m.data)}
                {entrada && m.fornecedor ? ` · Forn.: ${m.fornecedor}` : ""}
                {vinc && m.equipamento ? ` · ${m.equipamento.nome}` : ""}
                {m.colaborador ? ` · ${m.colaborador.nome}` : ""}
                {m.notaFiscal ? ` · NF ${m.notaFiscal}` : ""}
              </p>
              {m.observacao && (
                <p className="mt-0.5 truncate text-xs text-text-muted">{m.observacao}</p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span
                className={`text-sm font-semibold tabular-nums ${
                  entrada ? "text-success" : "text-danger"
                }`}
              >
                {entrada ? "+" : "−"}
                {formatQuantidade(m.quantidade, m.produto.unidade)}
              </span>
              {total > 0 && (
                <span className="text-xs text-text-secondary tabular-nums">
                  {formatCurrency(total)}
                </span>
              )}
              <div className="no-print">
                <ConfirmDelete
                  action={excluirMovimento.bind(null, slug, m.id)}
                  compact
                  title="Excluir movimentação"
                  message="O saldo do produto será recalculado. Esta ação não pode ser desfeita."
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
