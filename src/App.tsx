import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Lock, Activity, Zap, TrendingUp, AlertTriangle, Mic, ArrowRight, Search } from 'lucide-react';
import { EmailScanner } from '@/features/email/EmailScanner';
import { WebScanner } from '@/features/web/WebScanner';
import { AISecurityScanner } from '@/features/ai/AISecurityScanner';
import { AnalysisHistory } from '@/features/history/AnalysisHistory';

const Dashboard = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
      <p className="text-muted-foreground">SentinelX Global AI Threat Monitoring and Assessment.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Intelligence Scans', value: '1,284', icon: Activity, trend: '+12%', color: 'text-primary' },
        { label: 'Threats Blocked', value: '412', icon: Shield, trend: '+8%', color: 'text-emerald-500' },
        { label: 'Jailbreak Attempts', value: '89', icon: Zap, trend: '+24%', color: 'text-amber-500' },
        { label: 'Critical Alerts', value: '14', icon: AlertTriangle, trend: '-5%', color: 'text-destructive' },
      ].map((stat, i) => (
        <div key={i} className="security-card p-6 rounded-xl border border-border/50 bg-card/50 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 bg-secondary/50 rounded-lg border border-border/50 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> {stat.trend}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black font-mono tracking-tighter">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="security-card rounded-2xl glass-panel p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Global AI Threat Feed
            </h2>
            <span className="text-[10px] font-mono text-muted-foreground uppercase bg-secondary/50 px-2 py-1 rounded border border-border/50">Live Sync</span>
          </div>
          <div className="space-y-4">
            {[
              { type: 'Injection', target: 'Azure OpenAI', time: '2m ago', level: 'Medium' },
              { type: 'Phishing', target: 'Internal Finance', time: '14m ago', level: 'High' },
              { type: 'Deepfake', target: 'Voice Portal', time: '1h ago', level: 'Low' },
              { type: 'Spoofing', target: 'Legacy ERP', time: '3h ago', level: 'Medium' },
            ].map((threat, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    threat.level === 'High' ? 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                    threat.level === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-primary'
                  }`} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-tight">{threat.type} Attack Detected</p>
                    <p className="text-xs text-muted-foreground">Target: <span className="text-foreground font-mono">{threat.target}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{threat.time}</p>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    threat.level === 'High' ? 'text-destructive border-destructive/20 bg-destructive/10' : 
                    threat.level === 'Medium' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : 'text-primary border-primary/20 bg-primary/10'
                  }`}>
                    {threat.level} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="security-card rounded-2xl glass-panel p-6 border border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 font-mono">Model Intelligence</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>TRANSFORMER_V4</span>
                  <span className="text-primary">98.2%</span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[98.2%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>AUDIO_CNN_CORE</span>
                  <span className="text-primary">94.5%</span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[94.5%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="security-card rounded-2xl glass-panel p-6 border border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 font-mono">Network Integrity</h3>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/10 flex items-center justify-center">
                  <span className="text-xl font-black font-mono text-primary">100%</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="security-card rounded-2xl glass-panel p-6 border border-border/50">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Active Protection
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">OFFLINE_PROTOCOL_ACTIVE</p>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                SentinelX is running in fully isolated mode. All heuristics and models are executing on local hardware. No external dependencies detected.
              </p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full py-3 bg-secondary/50 border border-border/50 rounded-xl text-xs font-bold uppercase hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                <Search className="w-3 h-3" /> System Diagnostics
              </button>
              <button className="w-full py-3 bg-secondary/50 border border-border/50 rounded-xl text-xs font-bold uppercase hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                <Activity className="w-3 h-3" /> Update Knowledge Base
              </button>
            </div>
          </div>
        </div>

        <div className="security-card rounded-2xl glass-panel p-6 border border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
          <h3 className="text-sm font-bold uppercase mb-2">Security Advice</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            New surge in "Linguistic Camouflage" phishing detected. Ensure all corporate communications are scanned for AI entropy before action.
          </p>
          <button className="mt-4 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            Read Whitepaper <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 cyber-grid relative overflow-hidden">
    <div className="noise-overlay" />
    <div className="scanner-line" />
    
    <div className="z-10 text-center space-y-8 max-w-2xl animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <Shield className="w-16 h-16 text-primary animate-pulse-slow" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-foreground">
            SENTINEL<span className="text-primary">X</span>
          </h1>
          <p className="text-muted-foreground font-mono tracking-widest uppercase text-sm">
            AI-Driven Security Intelligence Suite
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
          The ultimate offline defense against AI-generated fraud, social engineering, and deepfake threats.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> PHISHING</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> SPOOFING</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> DEEPFAKE</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> INJECTION</span>
        </div>
      </div>

      <div className="pt-8">
        <button 
          onClick={onLogin}
          className="group relative px-12 py-4 bg-primary text-primary-foreground font-black text-lg rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
          <span className="relative flex items-center gap-2">
            INITIALIZE SENTINEL <Lock className="w-5 h-5" />
          </span>
        </button>
        <p className="mt-6 text-xs text-muted-foreground font-mono">
          SECURE PROTOCOL V4.1 // OFFLINE ENGINE LOADED
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Shield className="w-12 h-12 text-primary animate-pulse" />
          <p className="font-mono text-xs text-primary animate-pulse uppercase tracking-[0.2em]">Decrypting Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={() => login(window.location.origin)} />;
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/email" element={<EmailScanner />} />
          <Route path="/web" element={<WebScanner />} />
          <Route path="/audio" element={<div className="max-w-4xl mx-auto py-20 text-center space-y-4">
            <Mic className="w-20 h-20 text-muted-foreground mx-auto opacity-20" />
            <h2 className="text-2xl font-bold">Deepfake Audio Fingerprinting</h2>
            <p className="text-muted-foreground max-w-md mx-auto italic">Spectral MFCC analysis and synthetic voice fingerprinting module is being synchronized. Available in next update.</p>
          </div>} />
          <Route path="/ai-security" element={<AISecurityScanner />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/settings" element={<div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">System Settings</h1>
            <div className="security-card p-6 rounded-xl glass-panel border border-border/50 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-wider text-primary font-mono">Security Kernel</p>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Automatic Fraud Quarantine</p>
                    <p className="text-xs text-muted-foreground">Isolate high-risk messages automatically.</p>
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-wider text-primary font-mono">Explainability Engine</p>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Verbose Reasoning</p>
                    <p className="text-xs text-muted-foreground">Provide detailed technical breakdown for every scan.</p>
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <Toaster richColors position="top-right" theme="dark" />
    </Router>
  );
}
