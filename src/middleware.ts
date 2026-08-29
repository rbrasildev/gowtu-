import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas (sem exigir login).
const PUBLICAS = ["/login", "/setup"];

// Nome do cookie de sessão (hardcoded: a lib de auth não roda no edge).
const SESSAO_COOKIE = "sessao";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publica = PUBLICAS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const temSessao = req.cookies.has(SESSAO_COOKIE);

  // Sem sessão em rota protegida -> login.
  if (!publica && !temSessao) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Ignora assets estáticos e internos do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
