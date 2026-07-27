import { useGetDashboardSummary, useGetRiskBreakdown, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, SeverityBadge } from "@/components/ui/investigation-helpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: riskBreakdown } = useGetRiskBreakdown();
  const { data: recentActivity } = useGetRecentActivity();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-md shadow-xl font-mono text-sm">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Platform performance and risk distribution</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary border border-primary/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Transactions Monitored</p>
                <h3 className="text-2xl font-bold">{summary?.transactionsMonitored.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-destructive/10 rounded-full text-destructive border border-destructive/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Critical Alerts Open</p>
                <h3 className="text-2xl font-bold">{summary?.criticalAlerts}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/10 rounded-full text-green-500 border border-green-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Threats Mitigated (24h)</p>
                <h3 className="text-2xl font-bold">{summary?.resolvedToday}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              Risk Breakdown by Vector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="fraudType" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {riskBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border flex flex-col">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-mono">Live Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="divide-y divide-border/50">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <SeverityBadge severity={activity.severity} />
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                    Case: {activity.investigationTitle}
                  </p>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <div className="p-8 text-center text-muted-foreground font-mono text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
