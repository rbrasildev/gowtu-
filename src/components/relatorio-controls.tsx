"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./ui/icon";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function RelatorioControls({
  ano,
  mes,
  anos,
}: {
  ano: number;
  mes: number;
  anos: number[];
}) {
  const router = useRouter();

  function go(a: number, m: number) {
    let nm = m;
    let na = a;
    if (m < 1) {
      nm = 12;
      na = a - 1;
    } else if (m > 12) {
      nm = 1;
      na = a + 1;
    }
    router.push(`/relatorio?ano=${na}&mes=${nm}`);
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        onClick={() => go(ano, mes - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:bg-surface-2"
        aria-label="Mês anterior"
      >
        <Icon name="chevronLeft" size={18} />
      </button>

      <select
        value={mes}
        onChange={(e) => go(ano, Number(e.target.value))}
        aria-label="Mês"
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {MESES.map((label, i) => (
          <option key={i} value={i + 1}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={ano}
        onChange={(e) => go(Number(e.target.value), mes)}
        aria-label="Ano"
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {anos.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <button
        onClick={() => go(ano, mes + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:bg-surface-2"
        aria-label="Próximo mês"
      >
        <Icon name="chevronRight" size={18} />
      </button>

      <button
        onClick={() => window.print()}
        className="ml-auto flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg hover:opacity-90"
      >
        <Icon name="print" size={18} />
        Imprimir / PDF
      </button>
    </div>
  );
}
