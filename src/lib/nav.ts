import type { IconName } from "@/components/ui/icon";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  /** casa como prefixo (para submenus) */
  match?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Navegação completa (sidebar desktop)
export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Geral",
    items: [{ href: "/", label: "Painel", icon: "dashboard" }],
  },
  {
    title: "Cadastros",
    items: [
      { href: "/colaboradores", label: "Colaboradores", icon: "users" },
      { href: "/equipamentos", label: "Equip. e Veículos", icon: "truck" },
    ],
  },
  {
    title: "Estoque & Movimentações",
    items: [
      { href: "/estoque/diesel", label: "Óleo Diesel", icon: "fuel" },
      { href: "/estoque/gasolina", label: "Gasolina", icon: "fuel" },
      { href: "/estoque/graxa", label: "Graxa", icon: "drop" },
      { href: "/estoque/pecas", label: "Peças", icon: "gear" },
      { href: "/estoque/consumo", label: "Consumíveis", icon: "box" },
    ],
  },
  {
    title: "Relatórios",
    items: [{ href: "/relatorio", label: "Relatório Mensal", icon: "report" }],
  },
];

// Navegação inferior (mobile) — 5 destinos principais
export const MOBILE_NAV: NavItem[] = [
  { href: "/", label: "Painel", icon: "dashboard" },
  { href: "/estoque", label: "Estoque", icon: "fuel", match: "/estoque" },
  { href: "/equipamentos", label: "Frota", icon: "truck", match: "/equipamentos" },
  { href: "/colaboradores", label: "Equipe", icon: "users", match: "/colaboradores" },
  { href: "/relatorio", label: "Relatório", icon: "report", match: "/relatorio" },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  const target = item.match ?? item.href;
  return pathname === target || pathname.startsWith(target + "/");
}
