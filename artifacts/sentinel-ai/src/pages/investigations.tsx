import { useState } from "react";
import { useListInvestigations } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Search, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SeverityBadge, StatusBadge, formatCurrency } from "@/components/ui/investigation-helpers";

export default function Investigations() {
  const { data: investigations, isLoading } = useListInvestigations();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filtered = investigations?.filter(inv => 
    inv.title.toLowerCase().includes(search.toLowerCase()) || 
    inv.affectedAccount.toLowerCase().includes(search.toLowerCase()) ||
    inv.fraudType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Directory</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Found {filtered?.length || 0} investigations</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search cases, accounts..." 
              className="pl-9 bg-card border-border font-mono text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 font-mono border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Case ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Risk</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground font-mono">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      Loading cases...
                    </div>
                  </td>
                </tr>
              ) : filtered?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground font-mono">
                    No cases match your search.
                  </td>
                </tr>
              ) : (
                filtered?.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-secondary/50 cursor-pointer transition-colors group"
                    onClick={() => setLocation(`/investigations/${inv.id}`)}
                  >
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      #{inv.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">{inv.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{inv.fraudType} • {inv.affectedAccount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={inv.severity} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${inv.riskScore >= 80 ? 'text-destructive' : inv.riskScore >= 50 ? 'text-amber-500' : 'text-primary'}`}>
                          {inv.riskScore}
                        </span>
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${inv.riskScore >= 80 ? 'bg-destructive' : inv.riskScore >= 50 ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${inv.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-destructive">
                      {formatCurrency(inv.amount, inv.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
