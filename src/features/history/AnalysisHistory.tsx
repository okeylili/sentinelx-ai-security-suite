import React, { useState, useEffect } from 'react';
import { History, Shield, Mail, Globe, Terminal, Mic, AlertTriangle, CheckCircle2, Info, Search, Filter, Trash2, ArrowRight } from 'lucide-react';
import { blink } from '@/lib/blink';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AnalysisResult, ThreatLevel } from '@/types/analysis';

export function AnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await blink.db.analysisHistory.list({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' }
      });
      setHistory(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve intelligence history');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await blink.db.analysisHistory.delete(id);
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success('Record purged from database');
    } catch (error) {
      toast.error('Failed to purge record');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'url': return <Globe className="w-4 h-4" />;
      case 'prompt': return <Terminal className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.type === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Intelligence History</h1>
          </div>
          <p className="text-muted-foreground">Historical analysis reports and technical evidence logs.</p>
        </div>

        <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border/50">
          {['all', 'email', 'url', 'prompt'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                filter === t ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="security-card rounded-2xl glass-panel border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border/50">
                <th className="px-6 py-4 text-xs font-mono font-bold uppercase text-muted-foreground">Channel</th>
                <th className="px-6 py-4 text-xs font-mono font-bold uppercase text-muted-foreground">Source / Content</th>
                <th className="px-6 py-4 text-xs font-mono font-bold uppercase text-muted-foreground">Risk Level</th>
                <th className="px-6 py-4 text-xs font-mono font-bold uppercase text-muted-foreground">Score</th>
                <th className="px-6 py-4 text-xs font-mono font-bold uppercase text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="w-8 h-8 bg-secondary rounded-lg" /></td>
                    <td className="px-6 py-6"><div className="h-4 w-48 bg-secondary rounded" /></td>
                    <td className="px-6 py-6"><div className="h-6 w-20 bg-secondary rounded-full" /></td>
                    <td className="px-6 py-6"><div className="h-4 w-12 bg-secondary rounded" /></td>
                    <td className="px-6 py-6"><div className="h-8 w-8 bg-secondary rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="p-2 bg-secondary/50 rounded-lg border border-border/50 w-fit">
                        {getTypeIcon(record.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm font-medium truncate font-mono text-foreground">
                        {record.inputContent}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1">
                        {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                        record.threatLevel === 'Critical' || record.threatLevel === 'High' 
                          ? 'bg-destructive/10 text-destructive border-destructive/20' 
                          : record.threatLevel === 'Medium' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {record.threatLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-secondary h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${record.riskScore > 60 ? 'bg-destructive' : record.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${record.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold">{record.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toast.info('Full report coming soon')}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Info className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-medium uppercase tracking-widest font-mono">No intelligence gathered</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
