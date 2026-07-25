import { salvarColaborador } from "@/app/colaboradores/actions";
import { RouteModal } from "@/components/route-modal";
import { ColaboradorForm } from "@/components/forms/colaborador-form";

export const dynamic = "force-dynamic";

export default async function NovoColaboradorModal({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <RouteModal
      title="Novo colaborador"
      description="Cadastre um membro da equipe"
      icon="users"
    >
      <ColaboradorForm erro={erro} action={salvarColaborador.bind(null, null)} />
    </RouteModal>
  );
}
