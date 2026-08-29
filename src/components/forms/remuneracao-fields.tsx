"use client";

import { useState } from "react";
import { Field, Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Tipo = "SALARIO" | "COMISSAO";

export function RemuneracaoFields({
  defaultTipo = "SALARIO",
  defaultSalario = "",
  defaultComissao = "",
}: {
  defaultTipo?: Tipo;
  defaultSalario?: string;
  defaultComissao?: string;
}) {
  const [tipo, setTipo] = useState<Tipo>(defaultTipo);
  const salario = tipo === "SALARIO";

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-sm font-medium text-text-primary">
        Remuneração
      </span>
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setTipo("SALARIO")}
          aria-pressed={salario}
          className={cn(
            "flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
            salario
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <Icon name="wallet" size={17} />
          Salário
        </button>
        <button
          type="button"
          onClick={() => setTipo("COMISSAO")}
          aria-pressed={!salario}
          className={cn(
            "flex h-10 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
            !salario
              ? "bg-surface text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <Icon name="trend" size={17} />
          Comissão
        </button>
      </div>
      <input type="hidden" name="tipoRemuneracao" value={tipo} />

      <div className="mt-4">
        {salario ? (
          <Field
            label="Valor do salário (US$)"
            htmlFor="salario"
            hint="Em dólar — moeda principal"
          >
            <Input
              id="salario"
              name="salario"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              defaultValue={defaultSalario}
              placeholder="0,00"
            />
          </Field>
        ) : (
          <Field
            label="Comissão (%)"
            htmlFor="comissaoPercentual"
            hint="Porcentagem sobre o ouro"
          >
            <div className="relative">
              <Input
                id="comissaoPercentual"
                name="comissaoPercentual"
                type="number"
                step="0.001"
                min="0"
                inputMode="decimal"
                defaultValue={defaultComissao}
                placeholder="0"
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                %
              </span>
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}
