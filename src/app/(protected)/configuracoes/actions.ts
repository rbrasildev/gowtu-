"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  taxaUsdBrl: z
    .string()
    .trim()
    .min(1, "Informe a taxa")
    .transform((v) => Number(v.replace(",", ".")))
    .refine((v) => Number.isFinite(v) && v > 0, "Taxa deve ser maior que zero"),
});

export async function salvarTaxa(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos";
    redirect(`/configuracoes?erro=${encodeURIComponent(msg)}`);
  }

  await prisma.configuracao.upsert({
    where: { id: "singleton" },
    update: { taxaUsdBrl: parsed.data.taxaUsdBrl },
    create: { id: "singleton", taxaUsdBrl: parsed.data.taxaUsdBrl },
  });

  revalidatePath("/", "layout");
  redirect("/configuracoes?ok=1");
}
