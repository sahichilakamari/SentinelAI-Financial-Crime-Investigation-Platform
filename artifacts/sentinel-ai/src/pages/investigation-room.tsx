import { useParams } from "wouter";
import { 
  useGetInvestigation, 
  useListEpisodes, 
  useListTransactions, 
  useGetEntityGraph, 
  useGetAiFindings,
  useListEvidence
} from "@workspace/api-client-react";
import { getGetInvestigationQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge, StatusBadge, formatCurrency } from "@/components/ui/investigation-helpers";
import { ChevronRight, Lock, Unlock, Play, FileTerminal, Network, BrainCircuit, ShieldAlert, Download, Activity, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvestigationRoom() {
  const params = useParams();
  const id = Number(params.id);

  const { data: investigation, isLoading: invLoading } = useGetInvestigation(id, {
    query: { enabled: !!id, queryKey: getGetInvestigationQueryKey(id) }
  });
  
  const { data: episodes } = useListEpisodes(id);
  const [activeEpisode, setActiveEpisode] = useState(1);

  if (invLoading || !investigation) {
    return <div className="p-8 text-center text-primary font-mono animate-pulse">Initializing Investigation Matrix...</div>;
  }

  const currentEp = episodes?.find(e => e.episodeNumber === activeEpisode);

  return (
    <div className="flex h-full flex-col max-w-[1600px] mx-auto gap-4">
      {/* Top Bar - Case Info */}
      <div className="bg-card border border-border p-4 rounded-md flex flex-wrap items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="bg-background border border-border p-2 rounded text-center min-w-[80px]">
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Case ID</div>
            <div className="font-mono font-bold text-primary">#{investigation.id.toString().padStart(4, '0')}</div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold tracking-tight">{investigation.title}</h1>
              <StatusBadge status={investigation.status} />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
              <SeverityBadge severity={investigation.severity} />
              <span>•</span>
              <span>{investigation.fraudType}</span>
              <span>•</span>
              <span>Target: <span className="text-foreground">{investigation.affectedAccount}</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10 bg-background/50 p-2 px-4 rounded-md border border-border/50">
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Risk Score</div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black ${investigation.riskScore >= 80 ? 'text-destructive' : 'text-primary'}`}>
                {investigation.riskScore}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Exposure</div>
            <div className="text-lg font-mono font-bold text-destructive">
              {formatCurrency(investigation.amount, investigation.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Room Layout */}
      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left Sidebar - Episode Stepper */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 pl-2">Investigation Phases</div>
          {episodes?.map((ep) => (
            <div 
              key={ep.id}
              onClick={() => ep.status !== 'locked' && setActiveEpisode(ep.episodeNumber)}
              className={`p-3 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
                activeEpisode === ep.episodeNumber 
                  ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : ep.status === 'locked'
                  ? 'bg-card/30 border-transparent opacity-60 cursor-not-allowed'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              {activeEpisode === ep.episodeNumber && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                  activeEpisode === ep.episodeNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {ep.episodeNumber}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground flex items-center justify-between">
                    {ep.title}
                    {ep.status === 'locked' && <Lock className="w-3 h-3 text-muted-foreground" />}
                    {ep.status === 'completed' && <Unlock className="w-3 h-3 text-primary" />}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1 line-clamp-1">{ep.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Main Area - Active Episode */}
        <div className="flex-1 bg-card border border-border rounded-md relative overflow-hidden flex flex-col">
          {/* Header for current episode */}
          <div className="h-14 border-b border-border bg-secondary/30 flex items-center px-6 justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary" />
              <h2 className="font-mono font-bold tracking-tight text-lg">Phase 0{activeEpisode}: {currentEp?.title}</h2>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="font-mono h-8">
                 <FileTerminal className="w-4 h-4 mr-2" /> Log Note
               </Button>
            </div>
          </div>

          {/* Episode Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEpisode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                {/* Switch based on episode number to render specific visualization */}
                {activeEpisode === 1 && <EpisodeNarrative narrative={currentEp?.aiNarrative} />}
                {activeEpisode === 2 && <EpisodeAttackReplay id={id} />}
                {activeEpisode === 3 && <EpisodeEvidence id={id} />}
                {activeEpisode === 4 && <EpisodeEntityGraph id={id} />}
                {activeEpisode === 5 && <EpisodeAiFindings id={id} />}
                {activeEpisode === 6 && <EpisodeRecommendations id={id} />}
                {activeEpisode === 7 && <EpisodeReport id={id} />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-background flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => setActiveEpisode(Math.max(1, activeEpisode - 1))}
              disabled={activeEpisode === 1}
            >
              Previous Phase
            </Button>
            <Button 
              onClick={() => setActiveEpisode(Math.min(7, activeEpisode + 1))}
              disabled={activeEpisode === 7 || episodes?.find(e => e.episodeNumber === activeEpisode + 1)?.status === 'locked'}
            >
              Advance Phase <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Specific Episode Components ---

function EpisodeNarrative({ narrative }: { narrative?: string }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Initial AI Synthesis</h3>
      </div>
      <Card className="bg-secondary/20 border-primary/20">
        <CardContent className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          <div className="text-primary mb-4 font-bold uppercase">&gt; SYSTEM START_SYNTHESIS</div>
          {narrative || "No narrative available for this phase."}
          <div className="text-primary mt-4 font-bold uppercase animate-pulse">&gt; _</div>
        </CardContent>
      </Card>
    </div>
  );
}

function EpisodeAttackReplay({ id }: { id: number }) {
  const { data: events, isLoading } = useListTransactions(id);

  if (isLoading) return <div>Loading timeline...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <Play className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold">Attack Vector Replay</h3>
      </div>
      
      <div className="relative flex-1 pl-8">
        <div className="absolute left-[39px] top-4 bottom-4 w-px bg-border" />
        <div className="space-y-6 relative">
          {events?.sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.5 }}
              className="flex gap-6 relative"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-background ${
                event.isSuspicious ? 'border-destructive text-destructive' : 'border-primary text-primary'
              }`}>
                {event.isSuspicious ? <ShieldAlert className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
              </div>
              <Card className={`flex-1 ${event.isSuspicious ? 'border-destructive/30 bg-destructive/5' : 'bg-background'}`}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-1">{event.eventTime}</div>
                    <div className="font-medium">{event.description}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono uppercase">{event.eventType}</div>
                  </div>
                  {event.amount && (
                    <div className={`font-mono font-bold ${event.isSuspicious ? 'text-destructive' : 'text-foreground'}`}>
                      {event.amount > 0 ? '+' : ''}{event.amount} USD
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EpisodeEvidence({ id }: { id: number }) {
  const { data: evidence, isLoading } = useListEvidence(id);

  if (isLoading) return <div>Loading evidence wall...</div>;

  return (
    <div>
       <div className="flex items-center gap-3 mb-6">
        <FileTerminal className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Digital Evidence Wall</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidence?.map((item) => (
          <Card key={item.id} className="bg-background hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{item.evidenceType}</span>
                <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${
                  item.riskLevel === 'high' ? 'text-destructive border-destructive/50' : 'text-muted-foreground border-border'
                }`}>{item.riskLevel.toUpperCase()}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
              <div className="font-mono font-medium text-foreground break-all">{item.value}</div>
              <div className="text-[10px] text-muted-foreground mt-4 text-right font-mono">
                Captured: {new Date(item.collectedAt).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EpisodeEntityGraph({ id }: { id: number }) {
  const { data: graph, isLoading } = useGetEntityGraph(id);

  if (isLoading || !graph) return <div>Loading entity relationships...</div>;

  // Simple hardcoded radial layout for nodes to avoid react-flow
  const centerX = 400;
  const centerY = 300;
  const radius = 200;
  
  const nodesWithPos = graph.nodes.map((node, i) => {
    // Put primary node in center
    if (i === 0) return { ...node, x: centerX, y: centerY };
    
    // Distribute others around circle
    const angle = ((i - 1) / (graph.nodes.length - 1)) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <Network className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold">Relationship Explorer</h3>
      </div>
      <div className="flex-1 bg-black/50 border border-border rounded-md relative overflow-hidden min-h-[500px]">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity="0.5" />
            </marker>
          </defs>
          
          {/* Draw edges */}
          {graph.edges.map(edge => {
            const sourceNode = nodesWithPos.find(n => n.id === edge.source);
            const targetNode = nodesWithPos.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;
            
            return (
              <g key={edge.id}>
                <line 
                  x1={sourceNode.x} 
                  y1={sourceNode.y} 
                  x2={targetNode.x} 
                  y2={targetNode.y} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="1.5"
                  opacity="0.4"
                  className="animated-edge"
                  markerEnd="url(#arrowhead)"
                />
                <text 
                  x={(sourceNode.x + targetNode.x) / 2} 
                  y={(sourceNode.y + targetNode.y) / 2 - 5}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.relationshipType}
                </text>
              </g>
            );
          })}
          
          {/* Draw nodes */}
          {nodesWithPos.map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle 
                r="18" 
                fill={node.riskLevel === 'high' ? 'hsl(var(--destructive))' : 'hsl(var(--secondary))'} 
                stroke={node.riskLevel === 'high' ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}
                strokeWidth="2"
                className="shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              />
              <text y="30" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold" textAnchor="middle">{node.label}</text>
              <text y="45" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace" textAnchor="middle">{node.entityType}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function EpisodeAiFindings({ id }: { id: number }) {
  const { data: findings, isLoading } = useGetAiFindings(id);

  if (isLoading || !findings) return <div>Loading AI Synthesis...</div>;

  // Gauge calculation
  const probability = findings.fraudProbability;
  const radius = 60;
  const circumference = radius * Math.PI; // semi-circle
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">AI Findings & Probability</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-4">Fraud Probability</div>
          <div className="relative w-40 h-24 overflow-hidden mb-2">
            <svg viewBox="0 0 140 70" className="w-full h-full">
              <path 
                d="M 10 70 A 60 60 0 0 1 130 70" 
                fill="none" 
                stroke="hsl(var(--secondary))" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              <path 
                d="M 10 70 A 60 60 0 0 1 130 70" 
                fill="none" 
                stroke={probability > 75 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-0 left-0 w-full text-center">
              <span className="text-3xl font-black">{probability}%</span>
            </div>
          </div>
        </Card>
        
        <Card className="md:col-span-2 bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground uppercase">Primary Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium leading-relaxed">{findings.primaryConclusion}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-md text-xs font-mono text-muted-foreground border border-border">
              <Cpu className="w-3 h-3" />
              Model Confidence: <span className="text-foreground">{findings.modelConfidence}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h4 className="text-sm font-mono text-muted-foreground uppercase mb-4 mt-8">SHAP Risk Factors</h4>
      <div className="space-y-3">
        {findings.riskFactors.map((factor, idx) => (
          <div key={idx} className="bg-background p-4 rounded-md border border-border flex items-center gap-4">
            <div className="w-32 text-sm font-mono font-bold">{factor.factor}</div>
            <div className="flex-1">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${factor.contribution > 0.5 ? 'bg-destructive' : 'bg-primary'}`} 
                  style={{ width: `${factor.contribution * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-right text-xs font-mono">{(factor.contribution * 100).toFixed(0)}%</div>
            <div className="flex-1 text-sm text-muted-foreground">{factor.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpisodeRecommendations({ id }: { id: number }) {
  const { data: findings, isLoading } = useGetAiFindings(id);

  if (isLoading || !findings) return <div>Loading Recommendations...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-6 h-6 text-amber-500" />
        <h3 className="text-xl font-bold">Recommended Actions</h3>
      </div>
      <p className="text-muted-foreground mb-6">Based on the synthesized findings, the following mitigation steps are recommended:</p>
      
      <div className="space-y-4">
        {findings.recommendedActions.map((action, idx) => (
          <div key={idx} className="flex gap-4 p-4 border border-border rounded-md bg-background items-start group hover:border-primary/50 transition-colors">
            <div className="w-6 h-6 rounded-full border border-primary/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <span className="text-xs font-mono">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">{action}</p>
            </div>
            <Button variant="outline" size="sm">Execute</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpisodeReport({ id }: { id: number }) {
  return (
    <div className="max-w-3xl flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-background shadow-xl">
        <FileTerminal className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">Final Investigation Report Ready</h3>
        <p className="text-muted-foreground max-w-md mx-auto">The system has compiled all findings, evidence, and narratives into a formal compliance report.</p>
      </div>
      
      <div className="flex gap-4">
        <Button size="lg" className="gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
           Submit to Compliance
        </Button>
      </div>
    </div>
  );
}
