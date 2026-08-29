import { salvarLocal } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { LocalForm } from "@/components/forms/local-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo local" };

export default async function NovoLocal({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <FormShell
      title="Novo local"
      description="Cadastre uma localidade"
      icon="pin"
      tone="info"
      backHref="/locais"
      backLabel="Voltar para Locais"
    >
      <LocalForm erro={erro} action={salvarLocal.bind(null, null)} />
    </FormShell>
  );
}
