import { Field, Input, Select } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { ButtonLink } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import type { Usuario } from "@prisma/client";

export function UsuarioForm({
  action,
  usuario,
  erro,
}: {
  action: (formData: FormData) => void | Promise<void>;
  usuario?: Pick<Usuario, "id" | "nome" | "email" | "papel" | "ativo"> | null;
  erro?: string;
}) {
  const editando = !!usuario;

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" htmlFor="nome" required className="sm:col-span-2">
          <Input
            id="nome"
            name="nome"
            required
            autoFocus
            defaultValue={usuario?.nome ?? ""}
            placeholder="Nome do usuário"
          />
        </Field>

        <Field label="E-mail" htmlFor="email" required hint="Usado para entrar no sistema">
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={usuario?.email ?? ""}
            placeholder="usuario@empresa.com"
          />
        </Field>

        <Field label="Papel" htmlFor="papel" required>
          <Select id="papel" name="papel" defaultValue={usuario?.papel ?? "OPERADOR"}>
            <option value="OPERADOR">Operador — usa o sistema</option>
            <option value="ADMIN">Administrador — acesso total</option>
          </Select>
        </Field>

        <Field
          label={editando ? "Nova senha" : "Senha"}
          htmlFor="senha"
          required={!editando}
          hint={editando ? "Deixe em branco para manter a atual" : "Mínimo de 6 caracteres"}
          className="sm:col-span-2"
        >
          <PasswordInput
            id="senha"
            name="senha"
            autoComplete="new-password"
            required={!editando}
            placeholder={editando ? "••••••••" : "Defina uma senha"}
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-surface-2 px-4 py-3 sm:col-span-2">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={usuario ? usuario.ativo : true}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          <span className="text-sm">
            <span className="font-medium text-text-primary">Conta ativa</span>
            <span className="block text-xs text-text-secondary">
              Usuários inativos não conseguem entrar no sistema
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <ButtonLink href="/usuarios" variant="secondary">
          Cancelar
        </ButtonLink>
        <SubmitButton icon="check">
          {editando ? "Salvar alterações" : "Cadastrar usuário"}
        </SubmitButton>
      </div>
    </form>
  );
}
