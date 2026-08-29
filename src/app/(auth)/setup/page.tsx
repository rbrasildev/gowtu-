import { redirect } from "next/navigation";
import { contarUsuarios } from "@/lib/auth";
import { criarAdminInicial } from "../actions";
import { Field, Input } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configuração inicial" };

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  // Só disponível enquanto não houver usuários.
  if ((await contarUsuarios()) > 0) redirect("/login");

  const { erro } = await searchParams;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon name="shield" size={28} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-text-primary">Configuração inicial</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Crie a conta do administrador para começar a usar o sistema
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6">
        <form action={criarAdminInicial} className="flex flex-col gap-4">
          <FormError message={erro} />

          <Field label="Nome completo" htmlFor="nome" required>
            <Input id="nome" name="nome" required autoFocus placeholder="Seu nome" />
          </Field>

          <Field label="E-mail" htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="voce@empresa.com"
            />
          </Field>

          <Field label="Senha" htmlFor="senha" required hint="Mínimo de 6 caracteres">
            <PasswordInput
              id="senha"
              name="senha"
              autoComplete="new-password"
              required
              placeholder="Crie uma senha"
            />
          </Field>

          <Field label="Confirmar senha" htmlFor="confirmar" required>
            <PasswordInput
              id="confirmar"
              name="confirmar"
              autoComplete="new-password"
              required
              placeholder="Repita a senha"
            />
          </Field>

          <SubmitButton icon="check" className="mt-1 w-full" pendingLabel="Criando…">
            Criar administrador
          </SubmitButton>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        Esta é a conta principal · você poderá cadastrar outros usuários depois
      </p>
    </div>
  );
}
