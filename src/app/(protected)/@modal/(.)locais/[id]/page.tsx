import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarLocal } from "@/app/(protected)/locais/actions";
import { RouteModal } from "@/components/route-modal";
import { LocalForm } from "@/components/forms/local-form";

export const dynamic = "force-dynamic";

export default async function EditarLocalModal({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const local = await prisma.local.findUnique({ where: { id } });
  if (!local) notFound();

  return (
    <RouteModal title="Editar local" description={local.nome} icon="pin" tone="info">
      <LocalForm local={local} erro={erro} action={salvarLocal.bind(null, local.id)} />
    </RouteModal>
  );
}
