import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { prisma } from "@/lib/prisma";
import { salvarProduto } from "../../actions";
import { FormShell } from "@/components/ui/form-shell";
import { ProdutoForm } from "@/components/forms/produto-form";

export const dynamic = "force-dynamic";

export default async function EditarProduto({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { slug, id } = await params;
  const { erro } = await searchParams;
  const categoria = categoriaFromSlug(slug);
  if (!categoria) notFound();

  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto || produto.categoria !== categoria) notFound();

  const meta = CATEGORIAS[categoria];

  return (
    <FormShell
      title="Editar produto"
      description={produto.nome}
      icon={meta.icon as never}
      tone={meta.tone}
      backHref={`/estoque/${slug}`}
      backLabel={`Voltar para ${meta.plural}`}
    >
      <ProdutoForm
        categoria={categoria}
        produto={produto}
        erro={erro}
        action={salvarProduto.bind(null, slug, produto.id)}
      />
    </FormShell>
  );
}
