import { notFound } from "next/navigation";
import { categoriaFromSlug, CATEGORIAS } from "@/lib/domain";
import { salvarProduto } from "../../actions";
import { FormShell } from "@/components/ui/form-shell";
import { ProdutoForm } from "@/components/forms/produto-form";

export const dynamic = "force-dynamic";

export default async function NovoProduto({
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
    <FormShell
      title={`Novo produto — ${meta.plural}`}
      description="Cadastre o item para controlar seu estoque"
      icon={meta.icon as never}
      tone={meta.tone}
      backHref={`/estoque/${slug}`}
      backLabel={`Voltar para ${meta.plural}`}
    >
      <ProdutoForm
        categoria={categoria}
        erro={erro}
        action={salvarProduto.bind(null, slug, null)}
      />
    </FormShell>
  );
}
