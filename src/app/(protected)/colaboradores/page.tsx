import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_COLAB } from "@/lib/domain";
import { formatDate, formatNumber } from "@/lib/utils";
import { getMoedaConfig, fmtMoney, type MoedaConfig } from "@/lib/currency";
import type { Colaborador } from "@prisma/client";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { ConfirmDelete } from "@/components/confirm-delete";
import { excluirColaborador } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Colaboradores" };

export default async function ColaboradoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [colaboradores, ativos, afastados] = await Promise.all([
    prisma.colaborador.findMany({
      where: q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" } },
              { matricula: { contains: q, mode: "insensitive" } },
              { cargo: { contains: q, mode: "insensitive" } },
              { setor: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { nome: "asc" },
    }),
    prisma.colaborador.count({ where: { status: "ATIVO" } }),
    prisma.colaborador.count({ where: { status: "AFASTADO" } }),
  ]);
  const moeda = await getMoedaConfig();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Colaboradores"
        description="Cadastro e situação da equipe"
        icon="users"
        action={
          <ButtonLink href="/colaboradores/novo" icon="plus" size="sm">
            Novo
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={colaboradores.length} icon="users" tone="accent" />
        <StatCard label="Ativos" value={ativos} icon="check" tone="success" />
        <StatCard label="Afastados" value={afastados} icon="alert" tone="warning" />
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Equipe"
          subtitle={`${colaboradores.length} colaborador(es)`}
          action={<SearchInput placeholder="Buscar por nome, cargo…" />}
        />

        {colaboradores.length === 0 ? (
          <EmptyState
            icon="users"
            title={q ? "Nenhum resultado" : "Nenhum colaborador cadastrado"}
            description={
              q
                ? "Tente ajustar a busca."
                : "Cadastre os colaboradores para vinculá-los às movimentações."
            }
            actionLabel={q ? undefined : "Cadastrar colaborador"}
            actionHref={q ? undefined : "/colaboradores/novo"}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Nome</th>
                    <th className="px-3 py-2.5 font-medium">Cargo / Setor</th>
                    <th className="px-3 py-2.5 font-medium">Contato</th>
                    <th className="px-3 py-2.5 font-medium">Remuneração</th>
                    <th className="px-3 py-2.5 font-medium">Admissão</th>
                    <th className="px-3 py-2.5 font-medium">Situação</th>
                    <th className="px-5 py-2.5 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {colaboradores.map((c) => {
                    const st = STATUS_COLAB[c.status];
                    return (
                      <tr key={c.id} className="hover:bg-surface-2">
                        <td className="px-5 py-3">
                          <div className="font-medium text-text-primary">{c.nome}</div>
                          {c.matricula && (
                            <div className="text-xs text-text-secondary">
                              Mat. {c.matricula}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {c.cargo ?? "—"}
                          {c.setor ? <div className="text-xs">{c.setor}</div> : null}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {c.telefone ?? c.email ?? "—"}
                        </td>
                        <td className="px-3 py-3 tabular-nums text-text-primary">
                          {remuneracaoTexto(c, moeda)}
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          {formatDate(c.admissao)}
                        </td>
                        <td className="px-3 py-3">
                          <Badge tone={st.tone} dot>
                            {st.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <RowActions id={c.id} nome={c.nome} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border md:hidden">
              {colaboradores.map((c) => {
                const st = STATUS_COLAB[c.status];
                return (
                  <li key={c.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                      {c.nome.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary">{c.nome}</p>
                      <p className="truncate text-xs text-text-secondary">
                        {c.cargo ?? "Sem cargo"}
                        {c.setor ? ` · ${c.setor}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-text-primary tabular-nums">
                        {remuneracaoTexto(c, moeda)}
                      </p>
                      <div className="mt-1.5">
                        <Badge tone={st.tone} dot>
                          {st.label}
                        </Badge>
                      </div>
                    </div>
                    <RowActions id={c.id} nome={c.nome} />
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

function remuneracaoTexto(
  c: Pick<Colaborador, "tipoRemuneracao" | "salario" | "comissaoPercentual">,
  moeda: MoedaConfig,
): string {
  if (c.tipoRemuneracao === "COMISSAO") {
    return c.comissaoPercentual != null
      ? `${formatNumber(c.comissaoPercentual, 3)}% · ouro`
      : "Comissão";
  }
  return c.salario != null ? fmtMoney(c.salario, moeda) : "—";
}

function RowActions({ id, nome }: { id: string; nome: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/colaboradores/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
        aria-label={`Editar ${nome}`}
        title="Editar"
      >
        <Icon name="edit" size={16} />
      </Link>
      <ConfirmDelete
        action={excluirColaborador.bind(null, id)}
        compact
        title="Excluir colaborador"
        message={`Remover "${nome}"? As movimentações vinculadas ficarão sem responsável.`}
      />
    </div>
  );
}
