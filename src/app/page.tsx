import Link from "next/link";
import { getDashboard } from "@/lib/dashboard";
import { CATEGORIAS } from "@/lib/domain";
import {
  formatCurrency,
  formatNumber,
  formatQuantidade,
  formatDate,
} from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TONE_SOFT } from "@/lib/tone";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const d = await getDashboard();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Painel"
        description="Visão geral do patrimônio e do estoque"
        icon="dashboard"
        action={
          <ButtonLink href="/relatorio" variant="secondary" icon="report" size="sm">
            Relatório
          </ButtonLink>
        }
      />

      {/* KPIs principais */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Colaboradores"
          value={formatNumber(d.colaboradoresAtivos)}
          sub={`${d.totalColaboradores} no total`}
          icon="users"
          tone="accent"
        />
        <StatCard
          label="Equip. e Veículos"
          value={formatNumber(d.totalEquipamentos)}
          sub={`${d.equipamentosAtivos} ativos · ${d.totalVeiculos} veículos`}
          icon="truck"
          tone="info"
        />
        <StatCard
          label="Valor em estoque"
          value={formatCurrency(d.valorTotalEstoque)}
          sub="combustíveis, peças e consumo"
          icon="wallet"
          tone="success"
        />
        <StatCard
          label="Movim. no mês"
          value={formatNumber(d.movimentosMes.total)}
          sub={`${d.movimentosMes.entradas} entradas · ${d.movimentosMes.saidas} saídas`}
          icon="trend"
          tone="warning"
        />
      </div>

      {/* Alertas de manutenção / estoque baixo */}
      {(d.equipamentosManutencao > 0 || d.alertasEstoque.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {d.equipamentosManutencao > 0 && (
            <Link
              href="/equipamentos?status=MANUTENCAO"
              className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 transition-colors hover:brightness-105"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-warning/20 text-warning">
                <Icon name="wrench" size={18} />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-text-primary">
                  {d.equipamentosManutencao}{" "}
                  {d.equipamentosManutencao === 1 ? "item" : "itens"} em manutenção
                </p>
                <p className="text-text-secondary">Toque para ver a frota</p>
              </div>
            </Link>
          )}
          {d.alertasEstoque.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-danger/20 text-danger">
                <Icon name="alert" size={18} />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-text-primary">
                  {d.alertasEstoque.length}{" "}
                  {d.alertasEstoque.length === 1
                    ? "produto abaixo do mínimo"
                    : "produtos abaixo do mínimo"}
                </p>
                <p className="text-text-secondary">Reposição recomendada</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Estoque por categoria */}
        <Card>
          <CardHeader
            title="Estoque por categoria"
            subtitle="Saldo atual e valor imobilizado"
          />
          <CardBody className="flex flex-col gap-1.5 p-2 sm:p-2">
            {d.categorias.map((c) => {
              const meta = CATEGORIAS[c.categoria];
              return (
                <Link
                  key={c.categoria}
                  href={`/estoque/${meta.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONE_SOFT[meta.tone]}`}
                  >
                    <Icon name={meta.icon as never} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{meta.plural}</p>
                    <p className="text-xs text-text-secondary">
                      {c.totalProdutos}{" "}
                      {c.totalProdutos === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-text-primary">
                      {c.unidade
                        ? formatQuantidade(c.saldoTotal, c.unidade)
                        : formatNumber(c.saldoTotal)}
                    </p>
                    <p className="text-xs text-text-secondary tabular-nums">
                      {formatCurrency(c.valorTotal)}
                    </p>
                  </div>
                  <Icon name="chevronRight" size={16} className="text-text-muted" />
                </Link>
              );
            })}
          </CardBody>
        </Card>

        {/* Últimas movimentações */}
        <Card>
          <CardHeader
            title="Últimas movimentações"
            subtitle="Entradas e saídas mais recentes"
          />
          {d.ultimosMovimentos.length === 0 ? (
            <EmptyState
              icon="trend"
              title="Sem movimentações ainda"
              description="Registre entradas e saídas nos módulos de estoque."
            />
          ) : (
            <ul className="divide-y divide-border">
              {d.ultimosMovimentos.map((m) => {
                const entrada = m.tipo === "ENTRADA";
                return (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        entrada
                          ? "bg-success-soft text-success"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      <Icon name={entrada ? "arrowDown" : "arrowUp"} size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {m.produto.nome}
                      </p>
                      <p className="truncate text-xs text-text-secondary">
                        {formatDate(m.data)}
                        {m.equipamento ? ` · ${m.equipamento.nome}` : ""}
                        {m.colaborador ? ` · ${m.colaborador.nome}` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-semibold tabular-nums ${
                        entrada ? "text-success" : "text-danger"
                      }`}
                    >
                      {entrada ? "+" : "−"}
                      {formatQuantidade(m.quantidade, m.produto.unidade)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Acesso rápido */}
      <div className="mt-4">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Ações rápidas
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickLink href="/colaboradores/novo" icon="users" label="Novo colaborador" />
          <QuickLink href="/equipamentos/novo" icon="truck" label="Novo equipamento" />
          <QuickLink href="/estoque/diesel/movimento/novo?tipo=ENTRADA" icon="fuel" label="Entrada diesel" />
          <QuickLink href="/estoque/diesel/movimento/novo?tipo=SAIDA" icon="arrowUp" label="Abastecer" />
          <QuickLink href="/estoque/pecas/movimento/novo?tipo=ENTRADA" icon="gear" label="Comprar peça" />
          <QuickLink href="/relatorio" icon="report" label="Relatório mensal" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-3 text-center shadow-card transition-colors hover:bg-surface-2"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon name={icon} size={20} />
      </span>
      <span className="text-xs font-medium leading-tight text-text-primary">{label}</span>
    </Link>
  );
}
