import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ButtonLink } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { STATUS_COLAB } from "@/lib/domain";
import { toDateInput } from "@/lib/utils";
import type { Colaborador } from "@prisma/client";

export function ColaboradorForm({
  action,
  colaborador,
  erro,
}: {
  action: (formData: FormData) => void | Promise<void>;
  colaborador?: Colaborador | null;
  erro?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" htmlFor="nome" required className="sm:col-span-2">
          <Input
            id="nome"
            name="nome"
            required
            autoFocus
            defaultValue={colaborador?.nome ?? ""}
            placeholder="Nome do colaborador"
          />
        </Field>

        <Field label="Matrícula" htmlFor="matricula" hint="Opcional · única">
          <Input
            id="matricula"
            name="matricula"
            defaultValue={colaborador?.matricula ?? ""}
            placeholder="Ex.: 00123"
          />
        </Field>

        <Field label="Situação" htmlFor="status" required>
          <Select id="status" name="status" defaultValue={colaborador?.status ?? "ATIVO"}>
            {Object.entries(STATUS_COLAB).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Cargo / Função" htmlFor="cargo">
          <Input
            id="cargo"
            name="cargo"
            defaultValue={colaborador?.cargo ?? ""}
            placeholder="Ex.: Operador de máquinas"
          />
        </Field>

        <Field label="Setor" htmlFor="setor">
          <Input
            id="setor"
            name="setor"
            defaultValue={colaborador?.setor ?? ""}
            placeholder="Ex.: Frota / Oficina"
          />
        </Field>

        <Field label="Telefone" htmlFor="telefone">
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            defaultValue={colaborador?.telefone ?? ""}
            placeholder="(00) 00000-0000"
          />
        </Field>

        <Field label="E-mail" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={colaborador?.email ?? ""}
            placeholder="nome@empresa.com"
          />
        </Field>

        <Field label="Data de admissão" htmlFor="admissao">
          <Input
            id="admissao"
            name="admissao"
            type="date"
            defaultValue={toDateInput(colaborador?.admissao)}
          />
        </Field>

        <Field label="Observações" htmlFor="observacao" className="sm:col-span-2">
          <Textarea
            id="observacao"
            name="observacao"
            defaultValue={colaborador?.observacao ?? ""}
            placeholder="Informações adicionais (opcional)"
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <ButtonLink href="/colaboradores" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton icon="check">
          {colaborador ? "Salvar alterações" : "Cadastrar colaborador"}
        </SubmitButton>
      </div>
    </form>
  );
}
