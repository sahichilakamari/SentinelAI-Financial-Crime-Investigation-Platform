import { ShieldAlert, AlertTriangle, AlertCircle, TrendingUp, DollarSign } from "lucide-react";

export function SeverityBadge({ severity }: { severity: string }) {
  const getProps = () => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { variant: "destructive" as const, icon: ShieldAlert, label: "CRITICAL" };
      case 'high':
        return { variant: "warning" as const, icon: AlertTriangle, label: "HIGH" };
      case 'medium':
        return { variant: "default" as const, icon: AlertCircle, label: "MEDIUM" };
      case 'low':
        return { variant: "secondary" as const, icon: TrendingUp, label: "LOW" };
      default:
        return { variant: "secondary" as const, icon: AlertCircle, label: severity };
    }
  };

  const { variant, icon: Icon, label } = getProps();

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${
      variant === 'destructive' ? 'bg-destructive/20 text-destructive border-destructive/50' :
      variant === 'warning' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' :
      variant === 'default' ? 'bg-primary/20 text-primary border-primary/50' :
      'bg-secondary text-secondary-foreground border-border'
    }`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${
      status === 'open' ? 'bg-destructive/10 text-destructive border-destructive/30' :
      status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
      status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
      'bg-secondary text-muted-foreground border-border'
    }`}>
      {status}
    </div>
  );
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}
