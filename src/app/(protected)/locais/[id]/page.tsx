import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarLocal } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { LocalForm } from "@/components/forms/local-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar local" };

export default async function EditarLocal({
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
    <FormShell
      title="Editar local"
      description={local.nome}
      icon="pin"
      tone="info"
      backHref="/locais"
      backLabel="Voltar para Locais"
    >
      <LocalForm local={local} erro={erro} action={salvarLocal.bind(null, local.id)} />
    </FormShell>
  );
}
