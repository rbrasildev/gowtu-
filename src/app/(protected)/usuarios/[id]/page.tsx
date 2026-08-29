import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { salvarUsuario } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { UsuarioForm } from "@/components/forms/usuario-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar usuário" };

export default async function EditarUsuario({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) notFound();

  return (
    <FormShell
      title="Editar usuário"
      description={usuario.nome}
      icon="users"
      backHref="/usuarios"
      backLabel="Voltar para Usuários"
    >
      <UsuarioForm
        usuario={usuario}
        erro={erro}
        action={salvarUsuario.bind(null, usuario.id)}
      />
    </FormShell>
  );
}
