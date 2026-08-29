import { requireAdmin } from "@/lib/auth";
import { salvarUsuario } from "@/app/(protected)/usuarios/actions";
import { RouteModal } from "@/components/route-modal";
import { UsuarioForm } from "@/components/forms/usuario-form";

export const dynamic = "force-dynamic";

export default async function NovoUsuarioModal({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { erro } = await searchParams;
  return (
    <RouteModal title="Novo usuário" description="Crie uma conta de acesso" icon="users">
      <UsuarioForm erro={erro} action={salvarUsuario.bind(null, null)} />
    </RouteModal>
  );
}
