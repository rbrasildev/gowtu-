import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarEquipamento } from "@/app/equipamentos/actions";
import { RouteModal } from "@/components/route-modal";
import { EquipamentoForm } from "@/components/forms/equipamento-form";

export const dynamic = "force-dynamic";

export default async function EditarEquipamentoModal({
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

  return (
    <RouteModal title="Editar ativo" description={equipamento.nome} icon="truck" tone="info">
      <EquipamentoForm
        equipamento={equipamento}
        erro={erro}
        action={salvarEquipamento.bind(null, equipamento.id)}
      />
    </RouteModal>
  );
}
