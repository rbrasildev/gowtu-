import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted">
        <Icon name="search" size={30} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-text-primary">Página não encontrada</h1>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">
        O endereço acessado não existe ou o registro foi removido.
      </p>
      <ButtonLink href="/" icon="dashboard" className="mt-6">
        Voltar ao painel
      </ButtonLink>
    </div>
  );
}
