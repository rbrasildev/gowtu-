import { salvarEquipamento } from "@/app/(protected)/equipamentos/actions";
import { getLocaisAtivos } from "@/lib/locais";
import { RouteModal } from "@/components/route-modal";
import { EquipamentoForm } from "@/components/forms/equipamento-form";

export const dynamic = "force-dynamic";

export default async function NovoEquipamentoModal({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const locais = await getLocaisAtivos();
  return (
    <RouteModal
      title="Novo equipamento / veículo"
      description="Cadastre um ativo da frota"
      icon="truck"
      tone="info"
    >
      <EquipamentoForm
        erro={erro}
        locais={locais}
        action={salvarEquipamento.bind(null, null)}
      />
    </RouteModal>
  );
}
