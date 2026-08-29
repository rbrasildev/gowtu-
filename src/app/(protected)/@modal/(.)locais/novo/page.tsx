import { salvarLocal } from "@/app/(protected)/locais/actions";
import { RouteModal } from "@/components/route-modal";
import { LocalForm } from "@/components/forms/local-form";

export const dynamic = "force-dynamic";

export default async function NovoLocalModal({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <RouteModal title="Novo local" description="Cadastre uma localidade" icon="pin" tone="info">
      <LocalForm erro={erro} action={salvarLocal.bind(null, null)} />
    </RouteModal>
  );
}
