import { useGetDashboardSummary, useListInvestigations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { SeverityBadge, formatCurrency } from "@/components/ui/investigation-helpers";
import { Link } from "wouter";
import { Activity, Search, Siren, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: summary } = useGetDashboardSummary();
  const { data: investigations } = useListInvestigations();

  const activeInvestigations = investigations?.filter(i => i.status !== 'resolved') || [];
  const topInvestigations = [...activeInvestigations].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Investigation Center</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">Real-time threat monitoring and case management</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card/80 border border-border rounded-md px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="text-xs font-mono text-destructive uppercase">Live</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="font-mono text-sm">
            <span className="text-muted-foreground mr-2">SYS_LOAD</span>
            <span className="text-primary font-bold">42%</span>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Cases" 
          value={summary?.openInvestigations || 0} 
          icon={Activity} 
          trend="+2" 
        />
        <StatCard 
          title="Critical Alerts" 
          value={summary?.criticalAlerts || 0} 
          icon={Siren} 
          color="text-destructive" 
          trend="+1"
        />
        <StatCard 
          title="Avg Risk Score" 
          value={summary?.avgRiskScore || 0} 
          icon={Search} 
          suffix="/ 100" 
        />
        <StatCard 
          title="Resolved Today" 
          value={summary?.resolvedToday || 0} 
          icon={FileText} 
          color="text-green-500" 
        />
      </div>

      <div className="flex items-center justify-between mt-12 mb-6">
        <h2 className="text-xl font-bold tracking-tight">Priority Investigations</h2>
        <Link href="/investigations" className="text-sm font-mono text-primary hover:underline flex items-center">
          VIEW ALL <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Netflix-style horizontal/grid gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topInvestigations.map((inv, index) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link href={`/investigations/${inv.id}`}>
              <Card className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-card border-border/50 h-full flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="h-32 bg-secondary/50 relative overflow-hidden flex items-center justify-center border-b border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    {/* Abstract techy background visualization based on fraud type */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-background to-background" />
                    
                    <div className="z-20 flex flex-col items-center">
                      <div className="text-4xl font-black tracking-tighter text-white/90 drop-shadow-lg">
                        {inv.riskScore}
                      </div>
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest">Risk Score</div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <SeverityBadge severity={inv.severity} />
                      <span className="font-mono text-xs text-muted-foreground">{inv.fraudType}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{inv.title}</h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {inv.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-mono pt-4 border-t border-border/50 mt-auto">
                      <div className="text-muted-foreground">ACT: <span className="text-foreground">{inv.affectedAccount}</span></div>
                      <div className="text-destructive font-bold">{formatCurrency(inv.amount, inv.currency)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-primary", trend, suffix }: any) {
  return (
    <Card className="bg-card/50 border-border backdrop-blur">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
            {suffix && <span className="text-sm text-muted-foreground font-mono">{suffix}</span>}
          </div>
          {trend && (
            <div className="mt-2 text-xs font-mono text-muted-foreground">
              <span className={trend.startsWith('+') ? 'text-destructive' : 'text-green-500'}>{trend}</span> from yesterday
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-secondary ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
