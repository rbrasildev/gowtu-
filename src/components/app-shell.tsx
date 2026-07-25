"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, MOBILE_NAV, isActive } from "@/lib/nav";
import { Icon } from "./ui/icon";
import { ThemeToggle } from "./theme-toggle";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Sistema de Patrimônio — início">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-sm">
        <Icon name="logo" size={20} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-bold text-text-primary">Patrimônio</span>
          <span className="text-[11px] text-text-secondary">Gestão de Ativos</span>
        </span>
      )}
    </Link>
  );
}

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-5 px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {group.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                    )}
                  >
                    <Icon name={item.icon} size={19} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarLinks pathname={pathname} />
        </div>
        <div className="border-t border-border px-4 py-3 text-[11px] text-text-muted">
          v1.0 · {new Date().getFullYear()}
        </div>
      </aside>

      {/* Coluna de conteúdo */}
      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 lg:hidden"
              aria-label="Abrir menu"
            >
              <Icon name="menu" size={22} />
            </button>
            <div className="lg:hidden">
              <Brand compact />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>

        <main className="w-full flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Drawer — mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-surface shadow-pop animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Brand />
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2"
                aria-label="Fechar menu"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav — mobile */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 backdrop-blur lg:hidden">
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-accent" : "text-text-secondary",
              )}
            >
              <Icon name={item.icon} size={22} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
