import { requireUsuario } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // Guarda: exige usuário logado (redireciona para /login).
  const usuario = await requireUsuario();

  return (
    <AppShell usuario={usuario}>
      {children}
      {modal}
    </AppShell>
  );
}
