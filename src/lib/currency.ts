import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "./prisma";
import { toNumber } from "./utils";

export type Moeda = "USD" | "BRL";

export const MOEDA_COOKIE = "moeda";
export const TAXA_PADRAO = 5.0;

export interface MoedaConfig {
  /** moeda de exibição atual */
  moeda: Moeda;
  /** taxa USD -> BRL (quantos reais vale 1 dólar) */
  taxa: number;
}

/** Lê a taxa configurada (linha singleton), com cache por requisição. */
export const getTaxa = cache(async (): Promise<number> => {
  try {
    const cfg = await prisma.configuracao.findUnique({ where: { id: "singleton" } });
    const t = toNumber(cfg?.taxaUsdBrl);
    return t > 0 ? t : TAXA_PADRAO;
  } catch {
    return TAXA_PADRAO;
  }
});

/** Resolve a moeda de exibição (cookie) + taxa atual. Uso em Server Components. */
export async function getMoedaConfig(): Promise<MoedaConfig> {
  const store = await cookies();
  const moeda: Moeda = store.get(MOEDA_COOKIE)?.value === "BRL" ? "BRL" : "USD";
  const taxa = await getTaxa();
  return { moeda, taxa };
}

/**
 * Formata um valor (armazenado em USD) na moeda de exibição.
 * Em BRL, converte multiplicando pela taxa.
 */
export function fmtMoney(valorUsd: unknown, cfg: MoedaConfig): string {
  const usd = toNumber(valorUsd);
  const valor = cfg.moeda === "BRL" ? usd * cfg.taxa : usd;
  return new Intl.NumberFormat(cfg.moeda === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: cfg.moeda,
  }).format(valor);
}

/** Símbolo/rótulo curto da moeda. */
export function moedaSimbolo(moeda: Moeda): string {
  return moeda === "BRL" ? "R$" : "US$";
}
