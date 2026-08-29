import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormError } from "@/components/ui/form-error";
import { ConfirmDelete } from "@/components/confirm-delete";
import { excluirUsuario } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuários" };

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const atual = await requireAdmin();
  const { erro } = await searchParams;

  const [usuarios, admins, ativos] = await Promise.all([
    prisma.usuario.findMany({ orderBy: [{ ativo: "desc" }, { nome: "asc" }] }),
    prisma.usuario.count({ where: { papel: "ADMIN" } }),
    prisma.usuario.count({ where: { ativo: true } }),
  ]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Usuários"
        description="Contas de acesso ao sistema"
        icon="users"
        action={
          <ButtonLink href="/usuarios/novo" icon="plus" size="sm">
            Novo
          </ButtonLink>
        }
      />

      {erro && (
        <div className="mb-4">
          <FormError message={erro} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={usuarios.length} icon="users" tone="accent" />
        <StatCard label="Ativos" value={ativos} icon="check" tone="success" />
        <StatCard label="Administradores" value={admins} icon="shield" tone="info" />
      </div>

      <Card className="mt-4">
        <CardHeader title="Contas" subtitle={`${usuarios.length} usuário(s)`} />

        {usuarios.length === 0 ? (
          <EmptyState
            icon="users"
            title="Nenhum usuário"
            description="Cadastre usuários para dar acesso ao sistema."
            actionLabel="Cadastrar usuário"
            actionHref="/usuarios/novo"
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-2.5 font-medium">Nome</th>
                    <th className="px-3 py-2.5 font-medium">E-mail</th>
                    <th className="px-3 py-2.5 font-medium">Papel</th>
                    <th className="px-3 py-2.5 font-medium">Situação</th>
                    <th className="px-3 py-2.5 font-medium">Último acesso</th>
                    <th className="px-5 py-2.5 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-2">
                      <td className="px-5 py-3">
                        <span className="font-medium text-text-primary">{u.nome}</span>
                        {u.id === atual.id && (
                          <Badge tone="accent" className="ml-2">
                            você
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{u.email}</td>
                      <td className="px-3 py-3">
                        <Badge tone={u.papel === "ADMIN" ? "info" : "neutral"}>
                          {u.papel === "ADMIN" ? "Administrador" : "Operador"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={u.ativo ? "success" : "neutral"} dot>
                          {u.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {formatDateTime(u.ultimoAcesso)}
                      </td>
                      <td className="px-5 py-3">
                        <RowActions id={u.id} nome={u.nome} isSelf={u.id === atual.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border md:hidden">
              {usuarios.map((u) => (
                <li key={u.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                    {u.nome.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">
                      {u.nome}
                      {u.id === atual.id && (
                        <Badge tone="accent" className="ml-2">
                          você
                        </Badge>
                      )}
                    </p>
                    <p className="truncate text-xs text-text-secondary">{u.email}</p>
                    <div className="mt-1.5 flex gap-1.5">
                      <Badge tone={u.papel === "ADMIN" ? "info" : "neutral"}>
                        {u.papel === "ADMIN" ? "Administrador" : "Operador"}
                      </Badge>
                      <Badge tone={u.ativo ? "success" : "neutral"} dot>
                        {u.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <RowActions id={u.id} nome={u.nome} isSelf={u.id === atual.id} />
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}

function RowActions({ id, nome, isSelf }: { id: string; nome: string; isSelf: boolean }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/usuarios/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
        aria-label={`Editar ${nome}`}
        title="Editar"
      >
        <Icon name="edit" size={16} />
      </Link>
      {!isSelf && (
        <ConfirmDelete
          action={excluirUsuario.bind(null, id)}
          compact
          title="Excluir usuário"
          message={`Remover a conta de "${nome}"? Esta ação não pode ser desfeita.`}
        />
      )}
    </div>
  );
}
