import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { ConfirmDelete } from "@/components/confirm-delete";
import { excluirLocal } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Locais" };

export default async function LocaisPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [locais, ativos] = await Promise.all([
    prisma.local.findMany({
      where: q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" } },
              { cidade: { contains: q, mode: "insensitive" } },
              { endereco: { contains: q, mode: "insensitive" } },
              { responsavel: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: [{ ativo: "desc" }, { nome: "asc" }],
      include: { _count: { select: { equipamentos: true } } },
    }),
    prisma.local.count({ where: { ativo: true } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Locais"
        description="Localidades do patrimônio"
        icon="pin"
        tone="info"
        action={
          <ButtonLink href="/locais/novo" icon="plus" size="sm">
            Novo
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total de locais" value={locais.length} icon="pin" tone="accent" />
        <StatCard label="Ativos" value={ativos} icon="check" tone="success" />
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Localidades"
          subtitle={`${locais.length} local(is)`}
          action={<SearchInput placeholder="Buscar por nome, cidade…" />}
        />

        {locais.length === 0 ? (
          <EmptyState
            icon="pin"
            title={q ? "Nenhum resultado" : "Nenhum local cadastrado"}
            description={
              q
                ? "Tente ajustar a busca."
                : "Cadastre locais para vincular equipamentos e veículos a uma localidade."
            }
            actionLabel={q ? undefined : "Cadastrar local"}
            actionHref={q ? undefined : "/locais/novo"}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Nome</th>
                    <th className="px-3 py-2.5 font-medium">Cidade / UF</th>
                    <th className="px-3 py-2.5 font-medium">Responsável</th>
                    <th className="px-3 py-2.5 text-right font-medium">Ativos</th>
                    <th className="px-3 py-2.5 font-medium">Situação</th>
                    <th className="px-5 py-2.5 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {locais.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-2">
                      <td className="px-5 py-3">
                        <div className="font-medium text-text-primary">{l.nome}</div>
                        {l.endereco && (
                          <div className="text-xs text-text-secondary">{l.endereco}</div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {l.cidade ?? "—"}
                        {l.estado ? ` / ${l.estado}` : ""}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {l.responsavel ?? "—"}
                        {l.telefone ? (
                          <div className="text-xs">{l.telefone}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-text-secondary">
                        {l._count.equipamentos}
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={l.ativo ? "success" : "neutral"} dot>
                          {l.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <RowActions id={l.id} nome={l.nome} vinculados={l._count.equipamentos} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border md:hidden">
              {locais.map((l) => (
                <li key={l.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info">
                    <Icon name="pin" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">{l.nome}</p>
                    <p className="truncate text-xs text-text-secondary">
                      {[l.cidade, l.estado].filter(Boolean).join(" / ") || "Sem cidade"}
                      {l._count.equipamentos > 0 ? ` · ${l._count.equipamentos} ativo(s)` : ""}
                    </p>
                    <div className="mt-1.5">
                      <Badge tone={l.ativo ? "success" : "neutral"} dot>
                        {l.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <RowActions id={l.id} nome={l.nome} vinculados={l._count.equipamentos} />
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}

function RowActions({
  id,
  nome,
  vinculados,
}: {
  id: string;
  nome: string;
  vinculados: number;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/locais/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
        aria-label={`Editar ${nome}`}
        title="Editar"
      >
        <Icon name="edit" size={16} />
      </Link>
      <ConfirmDelete
        action={excluirLocal.bind(null, id)}
        compact
        title="Excluir local"
        message={
          vinculados > 0
            ? `"${nome}" tem ${vinculados} ativo(s) vinculado(s). Eles ficarão sem local. Continuar?`
            : `Remover o local "${nome}"? Esta ação não pode ser desfeita.`
        }
      />
    </div>
  );
}
