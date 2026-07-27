import { ShieldAlert, LayoutDashboard, Search, List, Activity, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle grid background for war room feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Investigate", icon: Search },
    { href: "/dashboard", label: "Analytics", icon: LayoutDashboard },
    { href: "/investigations", label: "All Cases", icon: List },
    { href: "#", label: "Live Feed", icon: Activity, disabled: true },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <ShieldAlert className="w-6 h-6 text-primary mr-3 shadow-primary" />
        <span className="font-mono font-bold tracking-widest text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SENTINEL_AI</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        <div className="mb-6 px-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Main Modules
        </div>
        {links.map((link) => {
          const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
          return (
            <Link key={link.label} href={link.disabled ? "#" : link.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer group relative overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent",
                  link.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(59,130,246,1)]" />
                )}
                <link.icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary" : "")} />
                <span className="font-medium text-sm">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md cursor-pointer transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">Settings</span>
        </div>
        <div className="flex items-center px-3 py-2 mt-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md cursor-pointer transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">Sign out</span>
        </div>
        <div className="mt-6 flex items-center px-3 gap-3">
          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-border">
            <span className="font-mono text-xs text-primary">FA</span>
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Fraud Analyst</div>
            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
