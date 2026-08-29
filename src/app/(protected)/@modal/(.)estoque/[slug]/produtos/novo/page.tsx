import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { salvarProduto } from "@/app/(protected)/estoque/[slug]/actions";
import { RouteModal } from "@/components/route-modal";
import { ProdutoForm } from "@/components/forms/produto-form";

export const dynamic = "force-dynamic";

export default async function NovoProdutoModal({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { slug } = await params;
  const { erro } = await searchParams;
  const categoria = categoriaFromSlug(slug);
  if (!categoria) notFound();
  const meta = CATEGORIAS[categoria];

  return (
    <RouteModal
      title={`Novo produto — ${meta.plural}`}
      description="Cadastre o item para controlar seu estoque"
      icon={meta.icon as never}
      tone={meta.tone}
    >
      <ProdutoForm
        categoria={categoria}
        erro={erro}
        action={salvarProduto.bind(null, slug, null)}
      />
    </RouteModal>
  );
}
