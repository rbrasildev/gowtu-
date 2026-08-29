import { redirect } from "next/navigation";
import { contarUsuarios, getUsuarioAtual } from "@/lib/auth";
import { entrar } from "../actions";
import { Field, Input } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  // Primeiro acesso: sem usuários -> vai para o setup do admin.
  if ((await contarUsuarios()) === 0) redirect("/setup");
  // Já logado -> painel.
  if (await getUsuarioAtual()) redirect("/");

  const { erro } = await searchParams;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-sm">
          <Icon name="logo" size={30} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-text-primary">Sistema de Patrimônio</h1>
        <p className="mt-1 text-sm text-text-secondary">Entre com sua conta para continuar</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6">
        <form action={entrar} className="flex flex-col gap-4">
          <FormError message={erro} />

          <Field label="E-mail" htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              autoFocus
              placeholder="voce@empresa.com"
            />
          </Field>

          <Field label="Senha" htmlFor="senha" required>
            <PasswordInput
              id="senha"
              name="senha"
              autoComplete="current-password"
              required
              placeholder="Sua senha"
            />
          </Field>

          <SubmitButton icon="logout" className="mt-1 w-full" pendingLabel="Entrando…">
            Entrar
          </SubmitButton>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        Acesso restrito · Fale com o administrador para obter uma conta
      </p>
    </div>
  );
}
