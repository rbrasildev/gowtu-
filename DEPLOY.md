# Deploy — VPS (Node + PM2)

Aplicação em produção: **http://170.245.175.4:3005**

## Como funciona o deploy automático

A cada `git push` na branch **main**, o GitHub Actions conecta na VPS via SSH e executa:
`git reset --hard origin/main` → `npm ci` → `prisma db push` → `npm run build` → `pm2 reload gowtu`.

Workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

## Secrets necessários no GitHub (uma vez)

Em **GitHub → repositório → Settings → Secrets and variables → Actions → New repository secret**, crie:

| Secret | Valor |
|---|---|
| `VPS_HOST` | `170.245.175.4` |
| `VPS_PORT` | `1822` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | conteúdo da chave privada de deploy (bloco `-----BEGIN OPENSSH PRIVATE KEY----- ... END`) |

> A chave pública de deploy já está instalada em `~/.ssh/authorized_keys` na VPS.

Depois de cadastrar, teste em **Actions → "Deploy para a VPS" → Run workflow** (ou faça um push).

## Infra na VPS

- App em `/opt/gowtu`, rodando com PM2 (`gowtu`), porta **3005**, inicia no boot.
- PostgreSQL 18 local: banco `patrimonio`, usuário `patrimonio` (credenciais em `/opt/gowtu/.env`).

## Comandos úteis (na VPS)

```bash
pm2 status                 # estado do app
pm2 logs gowtu             # logs em tempo real
pm2 reload gowtu           # reinício sem downtime
cd /opt/gowtu && git pull && npm ci && npm run build && pm2 reload gowtu   # deploy manual

# Popular com dados de exemplo (ATENÇÃO: apaga os dados atuais)
cd /opt/gowtu && npx tsx prisma/seed.ts
```
