import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarEquipamento } from "../actions";
import { getLocaisAtivos } from "@/lib/locais";
import { FormShell } from "@/components/ui/form-shell";
import { EquipamentoForm } from "@/components/forms/equipamento-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar equipamento" };

export default async function EditarEquipamento({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const equipamento = await prisma.equipamento.findUnique({ where: { id } });
  if (!equipamento) notFound();
  const locais = await getLocaisAtivos();

  return (
    <FormShell
      title="Editar ativo"
      description={equipamento.nome}
      icon="truck"
      tone="info"
      backHref="/equipamentos"
      backLabel="Voltar para Equipamentos"
    >
      <EquipamentoForm
        equipamento={equipamento}
        locais={locais}
        erro={erro}
        action={salvarEquipamento.bind(null, equipamento.id)}
      />
    </FormShell>
  );
}
