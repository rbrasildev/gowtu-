import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { CancelButton } from "@/components/ui/cancel-button";
import { FormError } from "@/components/ui/form-error";
import { UNIDADES, CATEGORIAS, type Categoria } from "@/lib/domain";
import { toNumber } from "@/lib/utils";
import type { Produto } from "@prisma/client";

export function ProdutoForm({
  categoria,
  action,
  produto,
  erro,
}: {
  categoria: Categoria;
  action: (formData: FormData) => void | Promise<void>;
  produto?: Produto | null;
  erro?: string;
}) {
  const meta = CATEGORIAS[categoria];

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome do produto" htmlFor="nome" required className="sm:col-span-2">
          <Input
            id="nome"
            name="nome"
            required
            defaultValue={produto?.nome ?? ""}
            placeholder={
              categoria === "PECA"
                ? "Ex.: Filtro de óleo, Correia..."
                : categoria === "CONSUMO"
                  ? "Ex.: Estopa, Detergente..."
                  : `Ex.: ${meta.label}`
            }
            autoFocus
          />
        </Field>

        <Field label="Unidade de medida" htmlFor="unidade" required>
          <Select
            id="unidade"
            name="unidade"
            defaultValue={produto?.unidade ?? meta.unidadePadrao}
          >
            {Object.entries(UNIDADES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Código / SKU" htmlFor="codigo" hint="Opcional">
          <Input
            id="codigo"
            name="codigo"
            defaultValue={produto?.codigo ?? ""}
            placeholder="Código interno"
          />
        </Field>

        <Field label="Preço unitário (US$)" htmlFor="precoUnitario" hint="Em dólar — moeda principal">
          <Input
            id="precoUnitario"
            name="precoUnitario"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={produto ? String(toNumber(produto.precoUnitario)) : ""}
            placeholder="0,00"
          />
        </Field>

        <Field
          label={`Estoque mínimo (${meta.unidadePadrao})`}
          htmlFor="estoqueMinimo"
          hint="Alerta quando o saldo ficar abaixo"
        >
          <Input
            id="estoqueMinimo"
            name="estoqueMinimo"
            type="number"
            step="0.001"
            min="0"
            inputMode="decimal"
            defaultValue={produto ? String(toNumber(produto.estoqueMinimo)) : ""}
            placeholder="0"
          />
        </Field>

        <Field label="Observações" htmlFor="observacao" className="sm:col-span-2">
          <Textarea
            id="observacao"
            name="observacao"
            defaultValue={produto?.observacao ?? ""}
            placeholder="Informações adicionais (opcional)"
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <CancelButton />
        <SubmitButton icon="check">
          {produto ? "Salvar alterações" : "Cadastrar produto"}
        </SubmitButton>
      </div>
    </form>
  );
}
