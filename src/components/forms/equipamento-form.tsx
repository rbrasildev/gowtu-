import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ButtonLink } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { STATUS_EQUIP, TIPO_EQUIP } from "@/lib/domain";
import { toNumber } from "@/lib/utils";
import type { Equipamento } from "@prisma/client";

export function EquipamentoForm({
  action,
  equipamento,
  erro,
}: {
  action: (formData: FormData) => void | Promise<void>;
  equipamento?: Equipamento | null;
  erro?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome / Identificação" htmlFor="nome" required className="sm:col-span-2">
          <Input
            id="nome"
            name="nome"
            required
            autoFocus
            defaultValue={equipamento?.nome ?? ""}
            placeholder="Ex.: Retroescavadeira 01, Caminhão Mercedes..."
          />
        </Field>

        <Field label="Tipo" htmlFor="tipo" required>
          <Select id="tipo" name="tipo" defaultValue={equipamento?.tipo ?? "EQUIPAMENTO"}>
            {Object.entries(TIPO_EQUIP).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Situação" htmlFor="status" required>
          <Select id="status" name="status" defaultValue={equipamento?.status ?? "ATIVO"}>
            {Object.entries(STATUS_EQUIP).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Nº de patrimônio" htmlFor="patrimonio" hint="Opcional · único">
          <Input
            id="patrimonio"
            name="patrimonio"
            defaultValue={equipamento?.patrimonio ?? ""}
            placeholder="Ex.: PAT-0001"
          />
        </Field>

        <Field label="Placa" htmlFor="placa" hint="Para veículos">
          <Input
            id="placa"
            name="placa"
            defaultValue={equipamento?.placa ?? ""}
            placeholder="ABC-1D23"
            className="uppercase"
          />
        </Field>

        <Field label="Nº de série" htmlFor="numeroSerie">
          <Input
            id="numeroSerie"
            name="numeroSerie"
            defaultValue={equipamento?.numeroSerie ?? ""}
            placeholder="Ex.: SN-000123"
          />
        </Field>

        <Field label="Local" htmlFor="local" hint="Onde está alocado">
          <Input
            id="local"
            name="local"
            defaultValue={equipamento?.local ?? ""}
            placeholder="Ex.: Pátio / Obra São João"
          />
        </Field>

        <Field label="Modelo" htmlFor="modelo">
          <Input
            id="modelo"
            name="modelo"
            defaultValue={equipamento?.modelo ?? ""}
            placeholder="Ex.: 416F2"
          />
        </Field>

        <Field label="Fabricante" htmlFor="fabricante">
          <Input
            id="fabricante"
            name="fabricante"
            defaultValue={equipamento?.fabricante ?? ""}
            placeholder="Ex.: Caterpillar"
          />
        </Field>

        <Field label="Ano" htmlFor="ano">
          <Input
            id="ano"
            name="ano"
            type="number"
            min="1950"
            max="2100"
            inputMode="numeric"
            defaultValue={equipamento?.ano ? String(equipamento.ano) : ""}
            placeholder="Ex.: 2020"
          />
        </Field>

        <Field label="Hodômetro / Horímetro" htmlFor="medidor" hint="km ou horas atuais">
          <Input
            id="medidor"
            name="medidor"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={equipamento ? String(toNumber(equipamento.medidor)) : ""}
            placeholder="0"
          />
        </Field>

        <Field
          label="Valor estipulado (US$)"
          htmlFor="valor"
          hint="Em dólar — usado no total do patrimônio"
        >
          <Input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={equipamento?.valor != null ? String(toNumber(equipamento.valor)) : ""}
            placeholder="0,00"
          />
        </Field>

        <Field label="Observações" htmlFor="observacao" className="sm:col-span-2">
          <Textarea
            id="observacao"
            name="observacao"
            defaultValue={equipamento?.observacao ?? ""}
            placeholder="Informações adicionais (opcional)"
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <ButtonLink href="/equipamentos" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton icon="check">
          {equipamento ? "Salvar alterações" : "Cadastrar ativo"}
        </SubmitButton>
      </div>
    </form>
  );
}
