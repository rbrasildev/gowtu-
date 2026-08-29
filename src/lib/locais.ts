import { prisma } from "./prisma";

/** Locais ativos para seleção em formulários. */
export function getLocaisAtivos() {
  return prisma.local.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, cidade: true },
  });
}
