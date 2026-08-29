import { salvarColaborador } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { ColaboradorForm } from "@/components/forms/colaborador-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo colaborador" };

export default async function NovoColaborador({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <FormShell
      title="Novo colaborador"
      description="Cadastre um membro da equipe"
      icon="users"
      backHref="/colaboradores"
      backLabel="Voltar para Colaboradores"
    >
      <ColaboradorForm erro={erro} action={salvarColaborador.bind(null, null)} />
    </FormShell>
  );
}
