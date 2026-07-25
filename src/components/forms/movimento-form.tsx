"use client";

import { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ButtonLink } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface Opcao {
  id: string;
  nome: string;
  extra?: string;
}

export function MovimentoForm({
  slug,
  action,
  produtos,
  equipamentos,
  colaboradores,
  vinculaEquipamento,
  isCombustivel,
  unidadeLabel,
  defaultTipo,
  defaultProdutoId,
  defaultData,
  erro,
}: {
  slug: string;
  action: (formData: FormData) => void | Promise<void>;
  produtos: Opcao[];
  equipamentos: Opcao[];
  colaboradores: Opcao[];
  vinculaEquipamento: boolean;
  isCombustivel: boolean;
  unidadeLabel: string;
  defaultTipo: "ENTRADA" | "SAIDA";
  defaultProdutoId?: string;
  defaultData: string;
  erro?: string;
}) {
  const [tipo, setTipo] = useState<"ENTRADA" | "SAIDA">(defaultTipo);
  const entrada = tipo === "ENTRADA";

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      {/* Seletor de tipo — segmented control */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          Tipo de movimentação
        </span>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => setTipo("ENTRADA")}
            aria-pressed={entrada}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
              entrada
                ? "bg-success text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            <Icon name="arrowDown" size={17} />
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setTipo("SAIDA")}
            aria-pressed={!entrada}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
              !entrada
                ? "bg-danger text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            <Icon name="arrowUp" size={17} />
            {vinculaEquipamento && isCombustivel ? "Saída / Abastecimento" : "Saída"}
          </button>
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Produto" htmlFor="produtoId" required className="sm:col-span-2">
          {produtos.length === 0 ? (
            <div className="rounded-md border border-warning/30 bg-warning-soft px-3 py-2.5 text-sm text-text-secondary">
              Nenhum produto cadastrado.{" "}
              <a
                href={`/estoque/${slug}/produtos/novo`}
                className="font-medium text-accent underline"
              >
                Cadastrar produto
              </a>
            </div>
          ) : (
            <Select id="produtoId" name="produtoId" defaultValue={defaultProdutoId ?? ""} required>
              <option value="" disabled>
                Selecione…
              </option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                  {p.extra ? ` — ${p.extra}` : ""}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label={`Quantidade (${unidadeLabel})`} htmlFor="quantidade" required>
          <Input
            id="quantidade"
            name="quantidade"
            type="number"
            step="0.001"
            min="0"
            inputMode="decimal"
            required
            placeholder="0"
          />
        </Field>

        <Field label="Data" htmlFor="data" required>
          <Input id="data" name="data" type="date" required defaultValue={defaultData} />
        </Field>

        <Field
          label={entrada ? "Preço unitário (R$)" : "Custo unitário (R$)"}
          htmlFor="valorUnitario"
          hint="Opcional"
        >
          <Input
            id="valorUnitario"
            name="valorUnitario"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0,00"
          />
        </Field>

        {/* Campos de ENTRADA */}
        {entrada && (
          <>
            <Field label="Fornecedor" htmlFor="fornecedor" hint="Opcional">
              <Input id="fornecedor" name="fornecedor" placeholder="Nome do fornecedor" />
            </Field>
            <Field label="Nota fiscal" htmlFor="notaFiscal" hint="Opcional">
              <Input id="notaFiscal" name="notaFiscal" placeholder="Nº da NF" />
            </Field>
          </>
        )}

        {/* Campos de SAÍDA */}
        {!entrada && vinculaEquipamento && (
          <Field
            label="Equipamento / Veículo"
            htmlFor="equipamentoId"
            hint="Destino da saída"
            className={isCombustivel ? "" : "sm:col-span-2"}
          >
            <Select id="equipamentoId" name="equipamentoId" defaultValue="">
              <option value="">— Não vincular —</option>
              {equipamentos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                  {e.extra ? ` (${e.extra})` : ""}
                </option>
              ))}
            </Select>
          </Field>
        )}

        {!entrada && isCombustivel && (
          <Field label="Hodômetro / Horímetro" htmlFor="medidor" hint="Opcional (km ou h)">
            <Input
              id="medidor"
              name="medidor"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="Ex.: 12500"
            />
          </Field>
        )}

        <Field
          label={entrada ? "Recebido por" : "Responsável"}
          htmlFor="colaboradorId"
          hint="Opcional"
        >
          <Select id="colaboradorId" name="colaboradorId" defaultValue="">
            <option value="">— Selecionar —</option>
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
                {c.extra ? ` — ${c.extra}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Observações" htmlFor="observacao" className="sm:col-span-2">
          <Textarea id="observacao" name="observacao" placeholder="Detalhes (opcional)" />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <ButtonLink href={`/estoque/${slug}`} variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton
          icon="check"
          variant={entrada ? "success" : "danger"}
          pendingLabel="Registrando…"
        >
          {entrada ? "Registrar entrada" : "Registrar saída"}
        </SubmitButton>
      </div>
    </form>
  );
}
