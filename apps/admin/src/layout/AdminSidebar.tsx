import { NavLink } from 'react-router-dom';
import { adminModules, moduleGroups, type ModuleGroup } from '@/lib/modules';

/**
 * Left sidebar — raggruppa i moduli per dominio (Contenuti, Economia,
 * Progressione, Live Ops, Asset). Ogni link punta a /<slug>; per ora
 * tutte le rotte renderizzano lo stesso placeholder.
 */
export function AdminSidebar() {
  const groups = Object.keys(moduleGroups) as ModuleGroup[];

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border-subtle bg-surface-sidebar text-surface-sidebarText lg:block">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <span className="text-lg font-bold text-white">PokeChess</span>
        <span className="rounded-control bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          Admin
        </span>
      </div>

      <nav className="px-3 py-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            [
              'mb-4 flex h-9 items-center rounded-control px-3 text-sm font-medium',
              isActive
                ? 'bg-white/10 text-surface-sidebarTextActive'
                : 'text-surface-sidebarText hover:bg-white/5',
            ].join(' ')
          }
        >
          Dashboard
        </NavLink>

        {groups.map((group) => {
          const items = adminModules.filter((m) => m.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {moduleGroups[group].label}
              </div>
              <ul className="flex flex-col gap-0.5">
                {items.map((m) => (
                  <li key={m.slug}>
                    <NavLink
                      to={`/${m.slug}`}
                      className={({ isActive }) =>
                        [
                          'flex h-8 items-center rounded-control px-3 text-sm transition-colors',
                          isActive
                            ? 'bg-brand text-white'
                            : 'text-surface-sidebarText hover:bg-white/5 hover:text-white',
                        ].join(' ')
                      }
                    >
                      {m.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
