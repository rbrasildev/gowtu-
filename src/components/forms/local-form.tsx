import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { CancelButton } from "@/components/ui/cancel-button";
import { FormError } from "@/components/ui/form-error";
import type { Local } from "@prisma/client";

export function LocalForm({
  action,
  local,
  erro,
}: {
  action: (formData: FormData) => void | Promise<void>;
  local?: Local | null;
  erro?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome do local" htmlFor="nome" required className="sm:col-span-2">
          <Input
            id="nome"
            name="nome"
            required
            autoFocus
            defaultValue={local?.nome ?? ""}
            placeholder="Ex.: Pátio Central, Obra São João, Almoxarifado"
          />
        </Field>

        <Field label="Endereço" htmlFor="endereco" className="sm:col-span-2">
          <Input
            id="endereco"
            name="endereco"
            defaultValue={local?.endereco ?? ""}
            placeholder="Rua, número, bairro"
          />
        </Field>

        <Field label="Cidade" htmlFor="cidade">
          <Input
            id="cidade"
            name="cidade"
            defaultValue={local?.cidade ?? ""}
            placeholder="Ex.: São Paulo"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado (UF)" htmlFor="estado">
            <Input
              id="estado"
              name="estado"
              maxLength={2}
              defaultValue={local?.estado ?? ""}
              placeholder="SP"
              className="uppercase"
            />
          </Field>
          <Field label="CEP" htmlFor="cep">
            <Input
              id="cep"
              name="cep"
              defaultValue={local?.cep ?? ""}
              placeholder="00000-000"
            />
          </Field>
        </div>

        <Field label="Responsável" htmlFor="responsavel">
          <Input
            id="responsavel"
            name="responsavel"
            defaultValue={local?.responsavel ?? ""}
            placeholder="Nome do responsável"
          />
        </Field>

        <Field label="Telefone" htmlFor="telefone">
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={local?.telefone ?? ""}
            placeholder="(00) 00000-0000"
          />
        </Field>

        <Field label="Observações" htmlFor="observacao" className="sm:col-span-2">
          <Textarea
            id="observacao"
            name="observacao"
            defaultValue={local?.observacao ?? ""}
            placeholder="Informações adicionais (opcional)"
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-surface-2 px-4 py-3 sm:col-span-2">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={local ? local.ativo : true}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          <span className="text-sm">
            <span className="font-medium text-text-primary">Local ativo</span>
            <span className="block text-xs text-text-secondary">
              Locais inativos não aparecem para seleção em novos cadastros
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <CancelButton />
        <SubmitButton icon="check">
          {local ? "Salvar alterações" : "Cadastrar local"}
        </SubmitButton>
      </div>
    </form>
  );
}
