import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fmtMoney, TAXA_PADRAO } from "@/lib/currency";
import { toNumber, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { salvarTaxa } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  await requireAdmin();
  const { erro, ok } = await searchParams;
  const cfg = await prisma.configuracao.findUnique({ where: { id: "singleton" } });
  const taxa = cfg ? toNumber(cfg.taxaUsdBrl) : TAXA_PADRAO;
  const moedaBRL = { moeda: "BRL" as const, taxa };
  const moedaUSD = { moeda: "USD" as const, taxa };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader
        title="Configurações"
        description="Moeda e câmbio do sistema"
        icon="gear"
      />

      <Card>
        <CardHeader
          title="Moeda e câmbio"
          subtitle="Os valores são armazenados em USD (principal). A taxa converte para BRL."
        />
        <CardBody className="flex flex-col gap-5">
          {ok && !erro && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm text-success"
            >
              <Icon name="check" size={18} className="shrink-0" />
              Taxa atualizada com sucesso.
            </div>
          )}
          <FormError message={erro} />

          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon name="wallet" size={20} />
            </span>
            <div className="text-sm">
              <p className="font-medium text-text-primary">
                Moeda principal: <Badge tone="accent">USD (US$)</Badge>
              </p>
              <p className="text-text-secondary">
                Use o seletor US$ / R$ no topo para alternar a exibição.
              </p>
            </div>
          </div>

          <form action={salvarTaxa} className="flex flex-col gap-5">
            <Field
              label="Taxa de câmbio — 1 US$ em R$"
              htmlFor="taxaUsdBrl"
              required
              hint="Quantos reais vale 1 dólar. Atualize quando quiser."
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary">US$ 1,00 =</span>
                <Input
                  id="taxaUsdBrl"
                  name="taxaUsdBrl"
                  type="number"
                  step="0.0001"
                  min="0"
                  inputMode="decimal"
                  required
                  defaultValue={String(taxa)}
                  className="max-w-[160px]"
                />
                <span className="text-sm font-medium text-text-secondary">R$</span>
              </div>
            </Field>

            <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm">
              <p className="mb-1 font-medium text-text-primary">Exemplo de conversão</p>
              <p className="text-text-secondary">
                {fmtMoney(100, moedaUSD)} equivalem a{" "}
                <span className="font-semibold text-text-primary">
                  {fmtMoney(100, moedaBRL)}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
              <span className="text-xs text-text-muted">
                {cfg
                  ? `Atualizado em ${formatDateTime(cfg.updatedAt)}`
                  : "Usando taxa padrão"}
              </span>
              <SubmitButton icon="check">Salvar taxa</SubmitButton>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
