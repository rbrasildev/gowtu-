import Link from "next/link";
import { getDashboard } from "@/lib/dashboard";
import { CATEGORIAS, CATEGORIA_LIST } from "@/lib/domain";
import { formatQuantidade } from "@/lib/utils";
import { getMoedaConfig, fmtMoney } from "@/lib/currency";
import { PageHeader } from "@/components/ui/page-header";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { TONE_SOFT } from "@/lib/tone";

export const dynamic = "force-dynamic";

export const metadata = { title: "Estoque" };

export default async function EstoqueHub() {
  const [d, moeda] = await Promise.all([getDashboard(), getMoedaConfig()]);
  const byCat = new Map(d.categorias.map((c) => [c.categoria, c]));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Estoque & Movimentações"
        description="Combustíveis, graxa, peças e produtos de consumo"
        icon="fuel"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIA_LIST.map((cat) => {
          const meta = CATEGORIAS[cat];
          const info = byCat.get(cat);
          const alertas = info?.alertas.length ?? 0;
          return (
            <Link
              key={cat}
              href={`/estoque/${meta.slug}`}
              className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${TONE_SOFT[meta.tone]}`}
                >
                  <Icon name={meta.icon as never} size={22} />
                </span>
                {alertas > 0 && (
                  <Badge tone="danger" dot>
                    {alertas} em falta
                  </Badge>
                )}
              </div>
              <h2 className="mt-3 text-base font-semibold text-text-primary">
                {meta.plural}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {info?.totalProdutos ?? 0}{" "}
                {(info?.totalProdutos ?? 0) === 1 ? "produto" : "produtos"} ·{" "}
                {info?.unidade
                  ? formatQuantidade(info?.saldoTotal ?? 0, info.unidade)
                  : "sem saldo"}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold tabular-nums text-text-primary">
                  {fmtMoney(info?.valorTotal ?? 0, moeda)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-accent">
                  Abrir
                  <Icon name="chevronRight" size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
