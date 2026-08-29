import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { salvarUsuario } from "@/app/(protected)/usuarios/actions";
import { RouteModal } from "@/components/route-modal";
import { UsuarioForm } from "@/components/forms/usuario-form";

export const dynamic = "force-dynamic";

export default async function EditarUsuarioModal({
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
    <RouteModal title="Editar usuário" description={usuario.nome} icon="users">
      <UsuarioForm
        usuario={usuario}
        erro={erro}
        action={salvarUsuario.bind(null, usuario.id)}
      />
    </RouteModal>
  );
}
