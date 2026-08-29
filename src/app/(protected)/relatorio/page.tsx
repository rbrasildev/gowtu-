import { gerarRelatorio } from "@/lib/relatorio";
import { CATEGORIAS } from "@/lib/domain";
import {
  formatDate,
  formatNumber,
  formatQuantidade,
  monthLabel,
  toNumber,
} from "@/lib/utils";
import { getMoedaConfig, fmtMoney, moedaSimbolo } from "@/lib/currency";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { RelatorioControls } from "@/components/relatorio-controls";
import { TONE_TEXT } from "@/lib/tone";

export const dynamic = "force-dynamic";
export const metadata = { title: "Relatório Mensal" };

export default async function RelatorioPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string; mes?: string }>;
}) {
  const sp = await searchParams;
  const hoje = new Date();
  const ano = sp.ano ? parseInt(sp.ano, 10) : hoje.getFullYear();
  const mes = sp.mes ? parseInt(sp.mes, 10) : hoje.getMonth() + 1;
  const anos = Array.from({ length: 6 }, (_, i) => hoje.getFullYear() - i);

  const [r, moeda] = await Promise.all([gerarRelatorio(ano, mes), getMoedaConfig()]);
  const periodo = monthLabel(ano, mes);
  const saldoLiquido = r.totais.entradaValor - r.totais.saidaValor;

  return (
    <div className="animate-fade-in">
      <div className="no-print">
        <PageHeader
          title="Relatório Mensal"
          description="Resumo de movimentações e custos do período"
          icon="report"
        />
        <div className="mb-5">
          <RelatorioControls ano={ano} mes={mes} anos={anos} />
        </div>
      </div>

      {/* Cabeçalho de impressão */}
      <div className="mb-5 hidden items-center justify-between border-b border-border pb-4 print-block">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Relatório Mensal de Patrimônio
          </h1>
          <p className="text-sm text-text-secondary">Período: {periodo}</p>
        </div>
        <p className="text-xs text-text-secondary">
          Emitido em {formatDate(hoje)}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2 print-avoid-break">
        <Icon name="calendar" size={18} className="text-accent" />
        <h2 className="text-lg font-semibold text-text-primary">{periodo}</h2>
      </div>

      {r.totais.movimentos === 0 ? (
        <Card>
          <EmptyState
            icon="report"
            title="Sem movimentações neste mês"
            description="Selecione outro período ou registre entradas e saídas no estoque."
          />
        </Card>
      ) : (
        <>
          {/* Totais */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 print-avoid-break">
            <StatCard
              label="Compras (entradas)"
              value={fmtMoney(r.totais.entradaValor, moeda)}
              sub={`${r.totais.entradas} lançamento(s)`}
              icon="arrowDown"
              tone="success"
            />
            <StatCard
              label="Consumo (saídas)"
              value={fmtMoney(r.totais.saidaValor, moeda)}
              sub={`${r.totais.saidas} lançamento(s)`}
              icon="arrowUp"
              tone="danger"
            />
            <StatCard
              label="Saldo do período"
              value={fmtMoney(saldoLiquido, moeda)}
              sub="entradas − saídas"
              icon="wallet"
              tone={saldoLiquido >= 0 ? "info" : "warning"}
            />
            <StatCard
              label="Movimentações"
              value={formatNumber(r.totais.movimentos)}
              sub="no total"
              icon="trend"
              tone="accent"
            />
          </div>

          {/* Resumo por categoria */}
          <Card className="mt-4 print-avoid-break">
            <CardHeader title="Resumo por categoria" subtitle="Entradas e saídas do mês" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Categoria</th>
                    <th className="px-3 py-2.5 text-right font-medium">Entrada</th>
                    <th className="px-3 py-2.5 text-right font-medium">
                      {moedaSimbolo(moeda.moeda)} Entrada
                    </th>
                    <th className="px-3 py-2.5 text-right font-medium">Saída</th>
                    <th className="px-5 py-2.5 text-right font-medium">
                      {moedaSimbolo(moeda.moeda)} Saída
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {r.linhas.map((l) => {
                    const meta = CATEGORIAS[l.categoria];
                    const vazio = l.movimentos === 0;
                    return (
                      <tr key={l.categoria} className={vazio ? "text-text-muted" : ""}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={TONE_TEXT[meta.tone]}>
                              <Icon name={meta.icon as never} size={16} />
                            </span>
                            <span className="font-medium text-text-primary">
                              {meta.plural}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {l.entradaQtd > 0
                            ? formatQuantidade(l.entradaQtd, l.unidade)
                            : "—"}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {l.entradaValor > 0 ? fmtMoney(l.entradaValor, moeda) : "—"}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {l.saidaQtd > 0 ? formatQuantidade(l.saidaQtd, l.unidade) : "—"}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          {l.saidaValor > 0 ? fmtMoney(l.saidaValor, moeda) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border font-semibold">
                    <td className="px-5 py-3 text-text-primary">Total</td>
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3 text-right tabular-nums text-success">
                      {fmtMoney(r.totais.entradaValor, moeda)}
                    </td>
                    <td className="px-3 py-3" />
                    <td className="px-5 py-3 text-right tabular-nums text-danger">
                      {fmtMoney(r.totais.saidaValor, moeda)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Consumo por equipamento */}
          {r.consumoEquip.length > 0 && (
            <Card className="mt-4 print-avoid-break">
              <CardHeader
                title="Consumo por equipamento / veículo"
                subtitle="Saídas vinculadas a ativos no período"
              />
              <ul className="divide-y divide-border">
                {r.consumoEquip.map((e) => (
                  <li key={e.equipamentoId} className="px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          name={e.tipo === "VEICULO" ? "truck" : "gear"}
                          size={18}
                          className="text-info"
                        />
                        <span className="font-medium text-text-primary">{e.nome}</span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-text-primary">
                        {fmtMoney(e.valorTotal, moeda)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {e.itens.map((it) => (
                        <Badge key={it.categoria} tone={CATEGORIAS[it.categoria].tone}>
                          {CATEGORIAS[it.categoria].plural}:{" "}
                          {formatQuantidade(it.qtd, it.unidade)}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Detalhamento */}
          <Card className="mt-4">
            <CardHeader
              title="Detalhamento das movimentações"
              subtitle={`${r.movimentos.length} lançamento(s)`}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Data</th>
                    <th className="px-3 py-2.5 font-medium">Produto</th>
                    <th className="px-3 py-2.5 font-medium">Tipo</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qtd</th>
                    <th className="px-3 py-2.5 font-medium">Equip. / Forn.</th>
                    <th className="px-5 py-2.5 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {r.movimentos.map((m) => {
                    const entrada = m.tipo === "ENTRADA";
                    const valor = toNumber(m.valorUnitario) * toNumber(m.quantidade);
                    return (
                      <tr key={m.id}>
                        <td className="whitespace-nowrap px-5 py-2.5 text-text-secondary tabular-nums">
                          {formatDate(m.data)}
                        </td>
                        <td className="px-3 py-2.5 text-text-primary">{m.produto.nome}</td>
                        <td className="px-3 py-2.5">
                          <Badge tone={entrada ? "success" : "danger"}>
                            {entrada ? "Entrada" : "Saída"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatQuantidade(m.quantidade, m.produto.unidade)}
                        </td>
                        <td className="px-3 py-2.5 text-text-secondary">
                          {m.equipamento?.nome ?? m.fornecedor ?? "—"}
                        </td>
                        <td className="px-5 py-2.5 text-right tabular-nums">
                          {valor > 0 ? fmtMoney(valor, moeda) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <p className="mt-4 text-center text-xs text-text-muted print-avoid-break">
            Sistema de Patrimônio · Relatório gerado automaticamente
          </p>
        </>
      )}
    </div>
  );
}
