import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_EQUIP, TIPO_EQUIP } from "@/lib/domain";
import { formatNumber } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { ConfirmDelete } from "@/components/confirm-delete";
import { cn } from "@/lib/utils";
import { excluirEquipamento } from "./actions";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Equipamentos e Veículos" };

const FILTROS = [
  { key: "", label: "Todos" },
  { key: "EQUIPAMENTO", label: "Equipamentos" },
  { key: "VEICULO", label: "Veículos" },
  { key: "MANUTENCAO", label: "Em manutenção" },
];

export default async function EquipamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tipo?: string; f?: string }>;
}) {
  const sp = await searchParams;
  const filtro = sp.f ?? sp.status ?? sp.tipo ?? "";

  const where: Prisma.EquipamentoWhereInput = {};
  if (filtro === "EQUIPAMENTO" || filtro === "VEICULO") where.tipo = filtro;
  if (filtro === "MANUTENCAO") where.status = "MANUTENCAO";
  if (sp.status === "MANUTENCAO") where.status = "MANUTENCAO";
  if (sp.q) {
    where.OR = [
      { nome: { contains: sp.q, mode: "insensitive" } },
      { patrimonio: { contains: sp.q, mode: "insensitive" } },
      { placa: { contains: sp.q, mode: "insensitive" } },
      { modelo: { contains: sp.q, mode: "insensitive" } },
      { fabricante: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const [lista, total, ativos, manutencao, veiculos] = await Promise.all([
    prisma.equipamento.findMany({ where, orderBy: { nome: "asc" } }),
    prisma.equipamento.count(),
    prisma.equipamento.count({ where: { status: "ATIVO" } }),
    prisma.equipamento.count({ where: { status: "MANUTENCAO" } }),
    prisma.equipamento.count({ where: { tipo: "VEICULO" } }),
  ]);

  const activeFilter = sp.status === "MANUTENCAO" ? "MANUTENCAO" : filtro;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Equipamentos e Veículos"
        description="Frota, máquinas e ativos"
        icon="truck"
        tone="info"
        action={
          <ButtonLink href="/equipamentos/novo" icon="plus" size="sm">
            Novo
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={total} icon="truck" tone="accent" />
        <StatCard label="Ativos" value={ativos} icon="check" tone="success" />
        <StatCard label="Manutenção" value={manutencao} icon="wrench" tone="warning" />
        <StatCard label="Veículos" value={veiculos} icon="truck" tone="info" />
      </div>

      {/* Filtros */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => {
          const active = activeFilter === f.key;
          const href = f.key ? `/equipamentos?f=${f.key}` : "/equipamentos";
          return (
            <Link
              key={f.key || "todos"}
              href={href}
              className={cn(
                "flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-2",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <Card className="mt-3">
        <CardHeader
          title="Ativos cadastrados"
          subtitle={`${lista.length} item(ns)`}
          action={<SearchInput placeholder="Buscar por nome, placa…" />}
        />

        {lista.length === 0 ? (
          <EmptyState
            icon="truck"
            title={sp.q || filtro ? "Nenhum resultado" : "Nenhum ativo cadastrado"}
            description={
              sp.q || filtro
                ? "Ajuste a busca ou os filtros."
                : "Cadastre equipamentos e veículos para vinculá-los a abastecimentos e peças."
            }
            actionLabel={sp.q || filtro ? undefined : "Cadastrar ativo"}
            actionHref={sp.q || filtro ? undefined : "/equipamentos/novo"}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Identificação</th>
                    <th className="px-3 py-2.5 font-medium">Tipo</th>
                    <th className="px-3 py-2.5 font-medium">Modelo / Fab.</th>
                    <th className="px-3 py-2.5 text-right font-medium">Medidor</th>
                    <th className="px-3 py-2.5 font-medium">Situação</th>
                    <th className="px-5 py-2.5 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lista.map((e) => {
                    const st = STATUS_EQUIP[e.status];
                    const tp = TIPO_EQUIP[e.tipo];
                    return (
                      <tr key={e.id} className="hover:bg-surface-2">
                        <td className="px-5 py-3">
                          <div className="font-medium text-text-primary">{e.nome}</div>
                          <div className="text-xs text-text-secondary">
                            {e.placa ? `Placa ${e.placa}` : ""}
                            {e.placa && e.patrimonio ? " · " : ""}
                            {e.patrimonio ? `Pat. ${e.patrimonio}` : ""}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={tp.tone}>{tp.label}</Badge>
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {e.modelo ?? "—"}
                          {e.fabricante ? (
                            <div className="text-xs">{e.fabricante}{e.ano ? ` · ${e.ano}` : ""}</div>
                          ) : e.ano ? (
                            <div className="text-xs">{e.ano}</div>
                          ) : null}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-text-secondary">
                          {e.medidor ? formatNumber(e.medidor) : "—"}
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={st.tone} dot>
                            {st.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <RowActions id={e.id} nome={e.nome} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border md:hidden">
              {lista.map((e) => {
                const st = STATUS_EQUIP[e.status];
                const tp = TIPO_EQUIP[e.tipo];
                return (
                  <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info">
                      <Icon name={tp.icon as never} size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary">{e.nome}</p>
                      <p className="truncate text-xs text-text-secondary">
                        {e.modelo ?? tp.label}
                        {e.placa ? ` · ${e.placa}` : ""}
                        {e.medidor ? ` · ${formatNumber(e.medidor)}` : ""}
                      </p>
                      <div className="mt-1.5 flex gap-1.5">
                        <Badge tone={tp.tone}>{tp.label}</Badge>
                        <Badge tone={st.tone} dot>
                          {st.label}
                        </Badge>
                      </div>
                    </div>
                    <RowActions id={e.id} nome={e.nome} />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}

function RowActions({ id, nome }: { id: string; nome: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/equipamentos/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
        aria-label={`Editar ${nome}`}
        title="Editar"
      >
        <Icon name="edit" size={16} />
      </Link>
      <ConfirmDelete
        action={excluirEquipamento.bind(null, id)}
        compact
        title="Excluir ativo"
        message={`Remover "${nome}"? As movimentações vinculadas ficarão sem equipamento.`}
      />
    </div>
  );
}
