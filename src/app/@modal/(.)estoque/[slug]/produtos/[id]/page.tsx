import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { prisma } from "@/lib/prisma";
import { salvarProduto } from "@/app/estoque/[slug]/actions";
import { RouteModal } from "@/components/route-modal";
import { ProdutoForm } from "@/components/forms/produto-form";

export const dynamic = "force-dynamic";

export default async function EditarProdutoModal({
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
    <RouteModal title="Editar produto" description={produto.nome} icon={meta.icon as never} tone={meta.tone}>
      <ProdutoForm
        categoria={categoria}
        produto={produto}
        erro={erro}
        action={salvarProduto.bind(null, slug, produto.id)}
      />
    </RouteModal>
  );
}
