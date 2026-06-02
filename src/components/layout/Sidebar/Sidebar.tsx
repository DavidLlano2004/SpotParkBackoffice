"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Grid3X3,
  Tag,
  Users,
  Calendar,
  UserCircle,
  AlertTriangle,
  Building,
  Receipt,
  Settings,
  LogOut,
  Lock,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@stores/useAuthStore";
import { useRoleGuard } from "@hooks/useRoleGuard";
import { cn } from "@utils/cn";
import type { AdminRole } from "@types-sp/api.types";

interface NavItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  superAdminOnly?: boolean;
}

const NAV_GROUPS: { label: string; sup?: boolean; items: NavItem[] }[] = [
  {
    label: "General",
    items: [
      {
        key: "dashboard",
        href: "/",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
      {
        key: "reportes",
        href: "/reportes",
        icon: <BarChart3 size={18} />,
        label: "Reportes",
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        key: "parqueaderos",
        href: "/parqueaderos",
        icon: <Building2 size={18} />,
        label: "Parqueaderos",
      },
      {
        key: "espacios",
        href: "/espacios",
        icon: <Grid3X3 size={18} />,
        label: "Espacios",
      },
      {
        key: "tarifas",
        href: "/tarifas",
        icon: <Tag size={18} />,
        label: "Tarifas",
      },
    ],
  },
  {
    label: "Equipo",
    items: [
      {
        key: "trabajadores",
        href: "/trabajadores",
        icon: <Users size={18} />,
        label: "Trabajadores",
      },
      {
        key: "turnos",
        href: "/turnos",
        icon: <Calendar size={18} />,
        label: "Turnos",
      },
      {
        key: "usuarios",
        href: "/usuarios",
        icon: <UserCircle size={18} />,
        label: "Usuarios app",
      },
      {
        key: "incidentes",
        href: "/incidentes",
        icon: <AlertTriangle size={18} />,
        label: "Incidentes",
        badge: 3,
      },
    ],
  },
  {
    label: "Empresa",
    sup: true,
    items: [
      {
        key: "empresas",
        href: "/empresas",
        icon: <Building size={18} />,
        label: "Empresas",
        superAdminOnly: true,
      },
      {
        key: "facturacion",
        href: "/facturacion",
        icon: <Receipt size={18} />,
        label: "Facturación",
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Config",
    items: [
      {
        key: "ajustes",
        href: "/ajustes",
        icon: <Settings size={18} />,
        label: "Ajustes",
      },
    ],
  },
];

interface NavItemButtonProps {
  item: NavItem;
  active: boolean;
  role: AdminRole;
  isSup: boolean;
}

function NavItemButton({ item, active, role, isSup }: NavItemButtonProps) {
  const locked = item.superAdminOnly && !isSup;
  return (
    <Link
      href={locked ? "#" : item.href}
      className={cn(
        "relative flex items-center gap-3 w-full h-[42px] px-3 rounded-xl text-[13.5px] font-medium transition-colors duration-150",
        active
          ? "text-white"
          : "text-white/60 hover:text-white/80 hover:bg-white/5",
        locked && "cursor-not-allowed opacity-50",
      )}
      style={active ? { background: "rgba(198,242,78,0.12)" } : undefined}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ background: "var(--sp-lime)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span style={{ color: active ? "var(--sp-lime)" : undefined }}>
        {item.icon}
      </span>
      <span className={active ? "text-white font-semibold" : ""}>
        {item.label}
      </span>
      {(item.badge ?? 0) > 0 && (
        <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-sp-red text-white text-[10px] font-bold flex items-center justify-center px-1">
          {item.badge}
        </span>
      )}
      {locked && <Lock size={12} className="ml-auto text-white/30" />}
    </Link>
  );
}

type ViewMode = "super" | "parking" | "vigilante";

const VIEW_OPTIONS: { value: ViewMode; label: string; sub: string }[] = [
  { value: "super", label: "Super Admin", sub: "Acceso total" },
  { value: "parking", label: "Admin Parqueadero", sub: "Gestión de sede" },
  { value: "vigilante", label: "Vigilante", sub: "Panel de turno" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isSuperAdmin } = useRoleGuard();
  const { user, setRole, logout } = useAuthStore();
  const [dropOpen, setDropOpen] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  const currentView: ViewMode = role === "super" ? "super" : "parking";

  const handleViewChange = (v: ViewMode) => {
    setDropOpen(false);
    if (v === "vigilante") {
      router.push("/vigilante/dashboard");
      return;
    }
    setRole(v === "super" ? "super" : "parking");
  };

  return (
    <aside
      className="w-[236px] shrink-0 flex flex-col h-screen"
      style={{
        background: "var(--sp-ink)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 p-[18px] shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
          style={{
            background: "var(--sp-lime)",
            boxShadow: "var(--sp-sh-lime)",
          }}
        >
          <span
            className="text-[20px] font-bold leading-none"
            style={{ color: "var(--sp-ink)", fontFamily: "var(--sp-display)" }}
          >
            P
          </span>
        </div>
        <div>
          <div
            className="text-white text-[15px] font-semibold"
            style={{ fontFamily: "var(--sp-display)" }}
          >
            SpotPark
          </div>
          <div className="text-white/40 text-[10.5px] mt-0.5">
            Panel Administrativo
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 no-sb">
        {NAV_GROUPS.map((group) => {
          if (group.sup && !isSuperAdmin) return null;
          return (
            <div key={group.label} className="mb-3.5">
              <div
                className="text-[10px] font-medium uppercase tracking-widest px-3 mb-1.5"
                style={{
                  color: group.sup
                    ? "rgba(198,242,78,0.55)"
                    : "rgba(255,255,255,0.28)",
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => (
                <NavItemButton
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  role={role}
                  isSup={isSuperAdmin}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Profile */}
      <div
        className="p-3 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center gap-2.5 p-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{ background: "var(--sp-lime)", color: "var(--sp-ink)" }}
          >
            {user?.init ?? "NS"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[12.5px] font-semibold truncate">
              {user?.name ?? "Natalia Soto"}
            </div>
            <RoleBadge role={role} />
          </div>
          <button
            onClick={logout}
            className="w-7 h-7 rounded-[9px] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>

        {/* View switcher dropdown */}
        <div className="relative mt-2">
          <button
            onClick={() => setDropOpen((o) => !o)}
            className="w-full h-8 rounded-[9px] flex items-center gap-2 px-2.5 text-[11.5px] font-medium text-white/50 hover:text-white/70 hover:bg-white/5 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Shield size={12} className="shrink-0" />
            <span className="flex-1 text-left">
              {VIEW_OPTIONS.find((o) => o.value === currentView)?.label ??
                "Vista actual"}
            </span>
            <ChevronDown
              size={12}
              className="shrink-0 transition-transform duration-150"
              style={{ transform: dropOpen ? "rotate(180deg)" : undefined }}
            />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full left-0 right-0 mb-1.5 rounded-xl overflow-hidden"
                style={{
                  background: "#1A1D24",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "var(--sp-sh-pop)",
                }}
              >
                {VIEW_OPTIONS.map((opt) => {
                  const active = opt.value === currentView;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleViewChange(opt.value)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                        active ? "bg-white/8" : "hover:bg-white/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold",
                          opt.value === "vigilante"
                            ? "bg-sp-blue/20 text-sp-blue"
                            : "bg-sp-lime/15 text-sp-lime",
                        )}
                      >
                        {opt.value === "vigilante" ? (
                          <Shield size={12} />
                        ) : (
                          opt.label[0]
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-[12px] font-medium",
                            active ? "text-white" : "text-white/70",
                          )}
                        >
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-white/35">
                          {opt.sub}
                        </div>
                      </div>
                      {active && (
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "var(--sp-lime)" }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}

function RoleBadge({ role }: { role: AdminRole }) {
  const isSup = role === "super";
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 mt-0.5"
      style={{
        background: isSup ? "var(--sp-lime-tint)" : "var(--sp-blue-tint)",
        color: isSup ? "var(--sp-lime-deep)" : "var(--sp-blue-tx)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {isSup ? "Super Admin" : "Administrador"}
    </span>
  );
}
