// Metadados de domínio: rótulos, unidades e estilos por categoria/status.
// Fonte única de verdade para labels e cores em toda a UI.

export type Categoria = "DIESEL" | "GASOLINA" | "GRAXA" | "PECA" | "CONSUMO";
export type Unidade = "L" | "KG" | "UN" | "ML" | "M" | "CX";
export type TipoMovimento = "ENTRADA" | "SAIDA";
export type StatusEquip = "ATIVO" | "MANUTENCAO" | "INATIVO";
export type StatusColab = "ATIVO" | "AFASTADO" | "DESLIGADO";
export type TipoEquip = "EQUIPAMENTO" | "VEICULO";

export type Tone = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

export const CATEGORIAS: Record<
  Categoria,
  {
    label: string;
    plural: string;
    slug: string;
    unidadePadrao: Unidade;
    tone: Tone;
    icon: string;
    /** saída vincula a um equipamento (abastecimento / uso em máquina) */
    saidaVinculaEquipamento: boolean;
  }
> = {
  DIESEL: {
    label: "Óleo Diesel",
    plural: "Diesel",
    slug: "diesel",
    unidadePadrao: "L",
    tone: "warning",
    icon: "fuel",
    saidaVinculaEquipamento: true,
  },
  GASOLINA: {
    label: "Gasolina",
    plural: "Gasolina",
    slug: "gasolina",
    unidadePadrao: "L",
    tone: "danger",
    icon: "fuel",
    saidaVinculaEquipamento: true,
  },
  GRAXA: {
    label: "Graxa",
    plural: "Graxa",
    slug: "graxa",
    unidadePadrao: "KG",
    tone: "info",
    icon: "drop",
    saidaVinculaEquipamento: true,
  },
  PECA: {
    label: "Peça",
    plural: "Peças",
    slug: "pecas",
    unidadePadrao: "UN",
    tone: "accent",
    icon: "gear",
    saidaVinculaEquipamento: true,
  },
  CONSUMO: {
    label: "Produto de Consumo",
    plural: "Consumíveis",
    slug: "consumo",
    unidadePadrao: "UN",
    tone: "success",
    icon: "box",
    saidaVinculaEquipamento: false,
  },
};

export const UNIDADES: Record<Unidade, string> = {
  L: "Litros (L)",
  KG: "Quilos (kg)",
  UN: "Unidade (un)",
  ML: "Mililitros (ml)",
  M: "Metros (m)",
  CX: "Caixa (cx)",
};

export const UNIDADE_ABREV: Record<Unidade, string> = {
  L: "L",
  KG: "kg",
  UN: "un",
  ML: "ml",
  M: "m",
  CX: "cx",
};

export const TIPO_MOVIMENTO: Record<
  TipoMovimento,
  { label: string; tone: Tone; sign: string }
> = {
  ENTRADA: { label: "Entrada", tone: "success", sign: "+" },
  SAIDA: { label: "Saída", tone: "danger", sign: "−" },
};

export const STATUS_EQUIP: Record<StatusEquip, { label: string; tone: Tone }> = {
  ATIVO: { label: "Ativo", tone: "success" },
  MANUTENCAO: { label: "Manutenção", tone: "warning" },
  INATIVO: { label: "Inativo", tone: "neutral" },
};

export const STATUS_COLAB: Record<StatusColab, { label: string; tone: Tone }> = {
  ATIVO: { label: "Ativo", tone: "success" },
  AFASTADO: { label: "Afastado", tone: "warning" },
  DESLIGADO: { label: "Desligado", tone: "neutral" },
};

export const TIPO_EQUIP: Record<TipoEquip, { label: string; tone: Tone; icon: string }> = {
  EQUIPAMENTO: { label: "Equipamento", tone: "accent", icon: "gear" },
  VEICULO: { label: "Veículo", tone: "info", icon: "truck" },
};

export function categoriaFromSlug(slug: string): Categoria | null {
  const entry = (Object.entries(CATEGORIAS) as [Categoria, (typeof CATEGORIAS)[Categoria]][]).find(
    ([, v]) => v.slug === slug,
  );
  return entry ? entry[0] : null;
}

export const CATEGORIA_LIST = Object.keys(CATEGORIAS) as Categoria[];
