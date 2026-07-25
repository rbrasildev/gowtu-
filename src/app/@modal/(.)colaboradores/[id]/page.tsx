import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarColaborador } from "@/app/colaboradores/actions";
import { RouteModal } from "@/components/route-modal";
import { ColaboradorForm } from "@/components/forms/colaborador-form";

export const dynamic = "force-dynamic";

export default async function EditarColaboradorModal({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const colaborador = await prisma.colaborador.findUnique({ where: { id } });
  if (!colaborador) notFound();

  return (
    <RouteModal title="Editar colaborador" description={colaborador.nome} icon="users">
      <ColaboradorForm
        colaborador={colaborador}
        erro={erro}
        action={salvarColaborador.bind(null, colaborador.id)}
      />
    </RouteModal>
  );
}
