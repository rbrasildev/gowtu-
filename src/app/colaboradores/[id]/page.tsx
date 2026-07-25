import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { salvarColaborador } from "../actions";
import { FormShell } from "@/components/ui/form-shell";
import { ColaboradorForm } from "@/components/forms/colaborador-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar colaborador" };

export default async function EditarColaborador({
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
    <FormShell
      title="Editar colaborador"
      description={colaborador.nome}
      icon="users"
      backHref="/colaboradores"
      backLabel="Voltar para Colaboradores"
    >
      <ColaboradorForm
        colaborador={colaborador}
        erro={erro}
        action={salvarColaborador.bind(null, colaborador.id)}
      />
    </FormShell>
  );
}
