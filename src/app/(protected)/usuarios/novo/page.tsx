import { requireAdmin } from "@/lib/auth";
import { salvarUsuario } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { UsuarioForm } from "@/components/forms/usuario-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo usuário" };

export default async function NovoUsuario({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { erro } = await searchParams;
  return (
    <FormShell
      title="Novo usuário"
      description="Crie uma conta de acesso"
      icon="users"
      backHref="/usuarios"
      backLabel="Voltar para Usuários"
    >
      <UsuarioForm erro={erro} action={salvarUsuario.bind(null, null)} />
    </FormShell>
  );
}
