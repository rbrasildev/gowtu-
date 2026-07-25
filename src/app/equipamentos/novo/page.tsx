import { salvarEquipamento } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { EquipamentoForm } from "@/components/forms/equipamento-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo equipamento" };

export default async function NovoEquipamento({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <FormShell
      title="Novo equipamento / veículo"
      description="Cadastre um ativo da frota"
      icon="truck"
      tone="info"
      backHref="/equipamentos"
      backLabel="Voltar para Equipamentos"
    >
      <EquipamentoForm erro={erro} action={salvarEquipamento.bind(null, null)} />
    </FormShell>
  );
}
